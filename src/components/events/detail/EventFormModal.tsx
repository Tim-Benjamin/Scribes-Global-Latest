import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMotionEngine } from "../../motion/motion-context";
import { eventDateParts } from "../../../lib/events/format";
import type { EventItem } from "../../../lib/supabase/queries/events";

type EventFormModalProps = {
  event: EventItem;
  open: boolean;
  onClose: () => void;
  kicker: string;
  intro?: string;
  children: ReactNode;
  labelledBy: string;
  closeLabel: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Dialog chrome shared by the registration and RSVP forms: a purple
 * band with the event's date in big type beside a paper form sheet.
 * Rises as a bottom sheet on phones. Locks page scroll (body + Lenis),
 * closes on Escape / backdrop, and returns focus when it closes.
 */
export default function EventFormModal({
  event, open, onClose, kicker, intro, children, labelledBy, closeLabel,
}: EventFormModalProps) {
  const engine = useMotionEngine();
  const closeRef = useRef<HTMLButtonElement>(null);
  const date = eventDateParts(event.start_date, event.end_date);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    const focused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    engine.lenis.current?.stop();
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = previous;
      engine.lenis.current?.start();
      window.removeEventListener("keydown", onKeyDown);
      focused?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, engine]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="evm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          data-lenis-prevent
        >
          <motion.div
            className="evm-panel"
            initial={{ y: 80, opacity: 0, clipPath: "inset(12% 6% 0% 6% round 40px)" }}
            animate={{ y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0% round 28px)" }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.8, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <aside className="evm-band theme-purple" aria-hidden="true">
              <span className="evm-band-kicker">{kicker}</span>
              <span className="evm-band-day nums">{date.day}</span>
              <span className="evm-band-my nums">{date.month} {date.year}</span>
              <span className="evm-band-title">{event.title}</span>
              {intro ? <span className="evm-band-intro">{intro}</span> : null}
            </aside>
            <div className="evm-sheet theme-paper">
              <button ref={closeRef} type="button" className="evm-close" onClick={onClose} aria-label={closeLabel} data-cursor="Close">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
              </button>
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
