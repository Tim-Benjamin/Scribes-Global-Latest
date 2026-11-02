import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./location-map.css";

// Leaflet's default marker icons resolve to broken paths under Vite's
// bundler. Rather than fight that, every map on the site uses this one
// brand pin (pulsing dot) instead of Leaflet's default marker image.
const pinIcon = L.divIcon({
  className: "location-map__pin",
  html: `<span class="location-map__pin-pulse"></span><span class="location-map__pin-dot"></span>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  popupAnchor: [0, -16],
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type LocationMapProps = {
  address: string;
  latitude: number | null;
  longitude: number | null;
  label?: string;
  zoom?: number;
};

/**
 * Venue card + map. On wide containers the card floats over the map's
 * corner; in narrow ones (phones, admin previews) it stacks above it.
 * Props are shared with Event detail and the admin forms — keep stable.
 */
export default function LocationMap({
  address,
  latitude,
  longitude,
  label = "Location",
  zoom = 14,
}: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const hasCoordinates = latitude != null && longitude != null;

  useEffect(() => {
    if (!containerRef.current || !hasCoordinates) return;

    const map = L.map(containerRef.current, {
      center: [latitude as number, longitude as number],
      zoom,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.marker([latitude as number, longitude as number], { icon: pinIcon, title: label })
      .addTo(map)
      .bindPopup(`<strong>${escapeHtml(label)}</strong><br/>${escapeHtml(address)}`, { className: "location-map__popup" })
      .openPopup();

    return () => {
      map.remove();
    };
  }, [hasCoordinates, latitude, longitude, zoom, address, label]);

  const directionsHref = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  async function copyCoordinates() {
    if (!hasCoordinates) return;
    try {
      await navigator.clipboard.writeText(`${latitude}, ${longitude}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable (older browsers, insecure context);
      // the "Get directions" link still works, so fail quietly here.
    }
  }

  return (
    <div className={`location-map ${hasCoordinates ? "has-map" : "no-map"}`}>
      <div className="location-map__card">
        <span className="location-map__card-icon" aria-hidden="true">
          <svg width="18" height="24" viewBox="0 0 30 40">
            <path
              d="M15 0C6.7 0 0 6.7 0 15c0 10.5 13 23.4 14.4 24.7a.8.8 0 0 0 1.2 0C17 38.4 30 25.5 30 15 30 6.7 23.3 0 15 0z"
              fill="currentColor"
            />
            <circle cx="15" cy="15" r="6.5" fill="var(--magenta, #C538BF)" />
          </svg>
        </span>

        <div className="location-map__details">
          <span>{label}</span>
          <strong>{address}</strong>
        </div>

        <div className="location-map__actions">
          <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="location-map__button" data-cursor="Go">
            Get directions
          </a>
          {hasCoordinates && (
            <button type="button" className="location-map__button location-map__button--ghost nums" onClick={copyCoordinates}>
              {copied ? "Copied" : "Copy coordinates"}
            </button>
          )}
        </div>
      </div>

      {hasCoordinates ? (
        <div ref={containerRef} className="location-map__canvas" role="img" aria-label={`Map showing ${address}`} />
      ) : (
        <p className="location-map__placeholder">Exact coordinates haven't been added for this location yet.</p>
      )}
    </div>
  );
}
