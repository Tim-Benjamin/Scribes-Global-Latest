import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { RollButton, gsap, prefersReducedMotion } from "../../../fx";
import { useMotionEngine } from "../../motion/motion-context";
import type { ActiveChapterItem } from "../../../lib/supabase/queries/chapters";
import { joinChapter } from "../../../lib/supabase/mutations/chapters";
import { JOIN_MODAL } from "../../../content/chapters";

type JoinChapterModalProps = {
  chapter: ActiveChapterItem;
  open: boolean;
  onClose: () => void;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

const INITIAL_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
  website: "",
};

/**
 * Join request sheet. The panel wipes in from the side over a dimmed
 * page (bottom sheet on phones); the chapter's name sits large on its
 * coloured half. Submission is unchanged: joinChapter() with honeypot.
 */
export default function JoinChapterModal({ chapter, open, onClose }: JoinChapterModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const leavingRef = useRef(false);
  const engine = useMotionEngine();
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  /** Play the exit, then let the parent unmount us. */
  const requestClose = useCallback((after?: () => void) => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) {
      onClose();
      after?.();
      return;
    }
    if (leavingRef.current) return;
    leavingRef.current = true;
    gsap.timeline({
      onComplete: () => {
        leavingRef.current = false;
        onClose();
        after?.();
      },
    })
      .to(root.querySelector(".jcm-panel"), { xPercent: 6, opacity: 0, duration: 0.45, ease: "power3.in" }, 0)
      .to(root.querySelector(".jcm-scrim"), { opacity: 0, duration: 0.5 }, 0.05);
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const root = rootRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    engine.lenis.current?.stop();

    if (root && !prefersReducedMotion()) {
      const panel = root.querySelector(".jcm-panel");
      const bits = root.querySelectorAll(".jcm-in");
      gsap.timeline()
        .fromTo(root.querySelector(".jcm-scrim"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)
        .fromTo(panel, { clipPath: "inset(0% 0% 0% 100%)", opacity: 1, xPercent: 0 }, {
          clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "sg.inOut",
        }, 0)
        .fromTo(bits, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.8 }, 0.45);
    }
    root?.querySelector<HTMLElement>("input:not([tabindex='-1']), button.jcm-close")?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestClose();
        return;
      }
      if (event.key === "Tab" && root) {
        const focusables = Array.from(root.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([tabindex='-1']), textarea, select",
        ));
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      engine.lenis.current?.start();
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [open, requestClose, engine]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setError(null);

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError(JOIN_MODAL.required);
      return;
    }

    try {
      setSubmitting(true);
      await joinChapter({
        chapter_id: chapter.id,
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        website: form.website,
      });
      setSuccess(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error("[JoinChapter] Submission failed:", err);
      setError(err instanceof Error ? err.message : JOIN_MODAL.failed);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      ref={rootRef}
      className="jcm"
      role="dialog"
      aria-modal="true"
      aria-label={`Join ${chapter.name}`}
      data-lenis-prevent
    >
      <div className="jcm-scrim" onClick={() => requestClose()} aria-hidden="true" />

      <div className="jcm-panel">
        <aside className="jcm-side theme-purple" aria-hidden="true">
          <div className="jcm-side-glow" aria-hidden="true" />
          <p className="kicker jcm-in">{success ? JOIN_MODAL.successKicker : JOIN_MODAL.kicker}</p>
          <p className="jcm-side-name jcm-in">{chapter.name}</p>
        </aside>

        <div className="jcm-body theme-paper">
          <button type="button" className="jcm-close" onClick={() => requestClose()} aria-label={JOIN_MODAL.close} data-cursor="Close">
            <span aria-hidden="true">×</span>
          </button>

          {!success ? (
            <>
              <div className="jcm-head">
                <p className="kicker jcm-in jcm-mobile-kicker">{JOIN_MODAL.kicker}</p>
                <h2 className="jcm-title jcm-in">{chapter.name}</h2>
                <p className="jcm-intro jcm-in">{JOIN_MODAL.intro}</p>
              </div>

              <form onSubmit={handleSubmit} className="jcm-form">
                {/* Honeypot */}
                <div className="hp-field" aria-hidden="true">
                  <label>
                    {JOIN_MODAL.honeypot}
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(event) => updateField("website", event.target.value)}
                    />
                  </label>
                </div>

                <div className="jcm-row jcm-in">
                  <div className="field">
                    <label htmlFor={id("first")}>{JOIN_MODAL.firstName}</label>
                    <input
                      id={id("first")}
                      type="text"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={(event) => updateField("firstName", event.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={id("last")}>{JOIN_MODAL.lastName}</label>
                    <input
                      id={id("last")}
                      type="text"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={(event) => updateField("lastName", event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="jcm-row jcm-in">
                  <div className="field">
                    <label htmlFor={id("email")}>{JOIN_MODAL.email}</label>
                    <input
                      id={id("email")}
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={id("phone")}>{JOIN_MODAL.phone}</label>
                    <input
                      id={id("phone")}
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                    />
                  </div>
                </div>

                <div className="field jcm-in">
                  <label htmlFor={id("message")}>{JOIN_MODAL.message}</label>
                  <textarea
                    id={id("message")}
                    rows={4}
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    placeholder={JOIN_MODAL.messagePlaceholder}
                  />
                </div>

                {error ? (
                  <div className="jcm-error field-error" role="alert">{error}</div>
                ) : null}

                <div className="jcm-in">
                  <RollButton type="submit" size="lg" disabled={submitting} magnetic={false}>
                    {submitting ? JOIN_MODAL.sending : JOIN_MODAL.send}
                  </RollButton>
                </div>
              </form>
            </>
          ) : (
            <div className="jcm-success" role="status">
              <span className="jcm-success-icon" aria-hidden="true">✓</span>
              <p className="kicker">{JOIN_MODAL.successKicker}</p>
              <h2 className="jcm-success-title">
                {JOIN_MODAL.successTitle.split("\n").map((line, i) => (
                  <span key={i} className={i === 1 ? "jcm-success-alt" : undefined}>{line}</span>
                ))}
              </h2>
              <p className="jcm-success-copy">
                {JOIN_MODAL.successBefore} <strong>{chapter.name}</strong> {JOIN_MODAL.successAfter}
              </p>
              <RollButton onClick={() => requestClose(() => setSuccess(false))} variant="outline">{JOIN_MODAL.close}</RollButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
