import { useState, type FormEvent } from "react";
import { RollButton } from "../../../fx";
import EventFormModal from "./EventFormModal";
import { registerEvent } from "../../../lib/supabase/mutations/events";
import type { EventItem } from "../../../lib/supabase/queries/events";
import { EVENT_REGISTRATION_FORM as T } from "../../../content/events";

type EventRegistrationModalProps = {
  event: EventItem;
  open: boolean;
  onClose: () => void;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  chapter: string;
  dietaryNeeds: string;
  additionalInfo: string;
  website: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  chapter: "",
  dietaryNeeds: "",
  additionalInfo: "",
  website: "",
};

export default function EventRegistrationModal({ event, open, onClose }: EventRegistrationModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (eventObject: FormEvent<HTMLFormElement>) => {
    eventObject.preventDefault();
    if (submitting) return;
    setError(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError(T.required);
      return;
    }

    try {
      setSubmitting(true);
      await registerEvent({
        event_id: event.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        chapter: form.chapter,
        dietary_needs: form.dietaryNeeds,
        additional_info: form.additionalInfo,
        website: form.website,
      });
      setSuccess(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : T.failed);
    } finally {
      setSubmitting(false);
    }
  };

  const copy = T.successCopy(event.title);

  return (
    <EventFormModal
      event={event}
      open={open}
      onClose={onClose}
      kicker={T.kicker}
      intro={T.intro}
      labelledBy="evm-reg-title"
      closeLabel={T.close}
    >
      {!success ? (
        <>
          <header className="evm-head">
            <p className="kicker">{T.kicker}</p>
            <h2 id="evm-reg-title" className="evm-title">{event.title}</h2>
            <p className="evm-intro">{T.intro}</p>
          </header>

          <form className="evm-form" onSubmit={submit}>
            <div className="hp-field" aria-hidden="true">
              <label>
                {T.honeypot}
                <input
                  type="text"
                  value={form.website}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => update("website", e.target.value)}
                />
              </label>
            </div>

            <div className="field">
              <label htmlFor="evr-name">{T.name}</label>
              <input id="evr-name" type="text" value={form.name} autoComplete="name" required onChange={(e) => update("name", e.target.value)} />
            </div>

            <div className="field">
              <label htmlFor="evr-email">{T.email}</label>
              <input id="evr-email" type="email" value={form.email} autoComplete="email" required onChange={(e) => update("email", e.target.value)} />
            </div>

            <div className="evm-row">
              <div className="field">
                <label htmlFor="evr-phone">{T.phone}</label>
                <input id="evr-phone" type="tel" value={form.phone} autoComplete="tel" onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="evr-chapter">{T.chapter}</label>
                <input id="evr-chapter" type="text" value={form.chapter} placeholder={T.chapterPlaceholder} onChange={(e) => update("chapter", e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="evr-diet">{T.dietary}</label>
              <textarea id="evr-diet" rows={3} value={form.dietaryNeeds} onChange={(e) => update("dietaryNeeds", e.target.value)} />
            </div>

            <div className="field">
              <label htmlFor="evr-info">{T.additional}</label>
              <textarea id="evr-info" rows={4} value={form.additionalInfo} onChange={(e) => update("additionalInfo", e.target.value)} />
            </div>

            {error ? <div className="evm-error" role="alert">{error}</div> : null}

            <div className="evm-submit">
              <RollButton type="submit" size="lg" disabled={submitting} cursor="Send">
                {submitting ? T.submitting : T.submit}
              </RollButton>
            </div>
          </form>
        </>
      ) : (
        <div className="evm-success" role="status">
          <span className="evm-success-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>
          </span>
          <p className="kicker">{T.successKicker}</p>
          <h2 id="evm-reg-title" className="evm-success-title">
            {T.successTitle.split("\n").map((l) => <span key={l}>{l}</span>)}
          </h2>
          <p className="evm-intro">
            {copy.before}<strong>{copy.title}</strong>{copy.after}
          </p>
          <RollButton
            variant="outline"
            onClick={() => {
              setSuccess(false);
              onClose();
            }}
          >
            {T.close}
          </RollButton>
        </div>
      )}
    </EventFormModal>
  );
}
