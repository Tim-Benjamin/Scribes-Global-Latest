import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Section, Split, gsap, useGsap } from "../../fx";
import { getChapterSlug, type ActiveChapterItem } from "../../lib/supabase/queries/chapters";
import { CHAPTERS_MAP } from "../../content/chapters";
import { escapeHtml, toCoord } from "./chapterMedia";
import "./chapters-map.css";

type ChaptersMapProps = {
  chapters: ActiveChapterItem[];
};

type Located = { chapter: ActiveChapterItem; latitude: number; longitude: number };

function pinIcon(name: string, campus: boolean) {
  return L.divIcon({
    className: `chm-marker ${campus ? "is-campus" : ""}`,
    html: `<span class="chm-pin"><span class="chm-pin-pulse"></span><span class="chm-pin-dot"></span><span class="chm-pin-label">${escapeHtml(name)}</span></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
}

function popupHtml(item: Located) {
  const slug = getChapterSlug(item.chapter);
  return `<div class="chm-pop">
    <span class="chm-pop-loc">${escapeHtml(item.chapter.location)}</span>
    <strong class="chm-pop-name">${escapeHtml(item.chapter.name)}</strong>
    <a class="chm-pop-link" href="/chapters/${encodeURIComponent(slug)}" data-chapter-link="${encodeURIComponent(slug)}">${CHAPTERS_MAP.viewChapter}</a>
  </div>`;
}

/**
 * The live network. A rounded window onto the Leaflet map grows to full
 * bleed as it pins (desktop); brand pins pulse, popups are restyled, and
 * the chip row flies the map to any chapter.
 */
export default function ChaptersMap({ chapters }: ChaptersMapProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<ActiveChapterItem["id"], L.Marker>>(new Map());
  const [active, setActive] = useState<ActiveChapterItem["id"] | null>(null);
  const navigate = useNavigate();

  const located = useMemo<Located[]>(
    () => chapters
      .map((chapter) => ({ chapter, latitude: toCoord(chapter.latitude), longitude: toCoord(chapter.longitude) }))
      .filter((item): item is Located => item.latitude !== null && item.longitude !== null),
    [chapters],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || located.length === 0) return undefined;

    const map = L.map(el, {
      scrollWheelZoom: false,
      center: [located[0].latitude, located[0].longitude],
      zoom: 6,
      zoomControl: false,
    });
    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const markers = markersRef.current;
    markers.clear();
    const list = located.map((item) => {
      const marker = L.marker([item.latitude, item.longitude], {
        icon: pinIcon(item.chapter.name, Boolean(item.chapter.is_campus)),
        title: item.chapter.name,
        riseOnHover: true,
      }).bindPopup(popupHtml(item), { className: "chm-popup", maxWidth: 280, minWidth: 200 });
      marker.on("popupopen", () => setActive(item.chapter.id));
      marker.on("popupclose", () => setActive((cur) => (cur === item.chapter.id ? null : cur)));
      markers.set(item.chapter.id, marker);
      return marker;
    });

    const group = L.featureGroup(list).addTo(map);
    if (located.length > 1) {
      map.fitBounds(group.getBounds().pad(0.3));
    } else {
      map.setView([located[0].latitude, located[0].longitude], 10);
    }

    // Popup links are plain HTML — route them through the SPA router.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-chapter-link]");
      if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      navigate(`/chapters/${link.dataset.chapterLink ?? ""}`);
    };
    el.addEventListener("click", onClick);
    mapRef.current = map;

    return () => {
      el.removeEventListener("click", onClick);
      markers.clear();
      mapRef.current = null;
      map.remove();
    };
  }, [located, navigate]);

  useGsap(({ reduced, scope }) => {
    const stage = scope.querySelector<HTMLElement>(".chm-stage");
    const frame = scope.querySelector<HTMLElement>(".chm-frame");
    const ui = scope.querySelectorAll<HTMLElement>(".chm-ui");
    if (!stage || !frame || reduced) return undefined;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.1}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(frame, { clipPath: "inset(9% 11% 9% 11% round 44px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1,
      })
        .fromTo(ui, { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.4 }, 0.55)
        .to({}, { duration: 0.25 });
    });
    mm.add("(max-width: 899px)", () => {
      gsap.fromTo(frame, { clipPath: "inset(12% 6% 12% 6% round 28px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 28px)",
        ease: "none",
        scrollTrigger: { trigger: stage, start: "top 95%", end: "top 30%", scrub: true },
      });
    });
    return () => mm.revert();
  }, [located.length], sectionRef);

  function flyTo(item: Located) {
    const map = mapRef.current;
    const marker = markersRef.current.get(item.chapter.id);
    if (!map || !marker) return;
    map.flyTo([item.latitude, item.longitude], Math.max(map.getZoom(), 9), { duration: 1.4 });
    map.once("moveend", () => marker.openPopup());
  }

  if (located.length === 0) return null;

  return (
    <Section ref={sectionRef} theme="night" flush className="chm" ariaLabel={CHAPTERS_MAP.ariaSection}>
      <header className="chm-head wrap">
        <p className="kicker">{CHAPTERS_MAP.kicker}</p>
        <Split as="h2" text={CHAPTERS_MAP.title} className="t-display chm-title" effect="tilt" />
      </header>

      <div className="chm-stage">
        <div className="chm-frame">
          <div ref={containerRef} className="chm-canvas" role="region" aria-label={CHAPTERS_MAP.ariaMap} />
          <div className="chm-vignette" aria-hidden="true" />

          <div className="chm-card chm-ui">
            <span className="chm-card-kicker">{CHAPTERS_MAP.drag}</span>
            <strong className="chm-card-count nums">{CHAPTERS_MAP.onMap(located.length)}</strong>
            <a href="#chapters-list" className="chm-card-link u-link">
              {CHAPTERS_MAP.browse} <span aria-hidden="true">↓</span>
            </a>
          </div>

          <ul className="chm-chips chm-ui" aria-label={CHAPTERS_MAP.legend}>
            {located.map((item) => (
              <li key={item.chapter.id}>
                <button
                  type="button"
                  className={`chm-chip ${active === item.chapter.id ? "is-on" : ""} ${item.chapter.is_campus ? "is-campus" : ""}`}
                  onClick={() => flyTo(item)}
                  data-cursor="Fly"
                >
                  <span className="chm-chip-dot" aria-hidden="true" />
                  {item.chapter.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
