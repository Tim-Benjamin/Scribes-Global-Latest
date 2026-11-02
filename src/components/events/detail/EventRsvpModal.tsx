import { useState, type FormEvent } from "react";
import { RollButton } from "../../../fx";
import EventFormModal from "./EventFormModal";
import { rsvpEvent, type EventRsvpResponse } from "../../../lib/supabase/mutations/events";
import type { EventItem } from "../../../lib/supabase/queries/events";
import { EVENT_RSVP_FORM as T } from "../../../content/events";

type EventRsvpModalProps = {
  event: EventItem;
  open: boolean;
  onClose: () => void;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  response: EventRsvpResponse;
  guests: number;
  message: string;
  website: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  response: "yes",
  guests: 1,
  message: "",
  website: "",
};

const RESPONSES: EventRsvpResponse[] = ["yes", "maybe", "no"];

export default function EventRsvpModal({ event, open, onClose }: EventRsvpModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError(T.required);
      return;
    }

    try {
      setSubmitting(true);
      await rsvpEvent({
        event_id: event.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        response: form.response,
        guests_count: form.guests,
        message: form.message,
        website: form.website,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : T.failed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EventFormModal
      event={event}
      open={open}
      onClose={onClose}
      kicker={T.kicker}
      intro={T.intro}
      labelledBy="evm-rsvp-title"
      closeLabel={T.close}
    >
      {!success ? (
        <>
          <header className="evm-head">
            <p className="kicker">{T.kicker}</p>
            <h2 id="evm-rsvp-title" className="evm-title">{event.title}</h2>
            <p className="evm-intro">{T.intro}</p>
          </header>

          <form className="evm-form" onSubmit={submit}>
            <div className="hp-field" aria-hidden="true">
              <input
                value={form.website}
                tabIndex={-1}
                autoComplete="off"
                onChange={(e) => setForm((current) => ({ ...current, website: e.target.value }))}
              />
            </div>

            <div className="field">
              <label htmlFor="evv-name">{T.name}</label>
              <input id="evv-name" type="text" required value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
            </div>

            <div className="field">
              <label htmlFor="evv-email">{T.email}</label>
              <input id="evv-email" type="email" required value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} />
            </div>

            <div className="field">
              <label htmlFor="evv-phone">{T.phone}</label>
              <input id="evv-phone" type="tel" value={form.phone} onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))} />
            </div>

            <fieldset className="evm-choices">
              <legend>{T.responseLegend}</legend>
              <div className="evm-choices-row">
                {RESPONSES.map((response) => (
                  <label key={response} className={`evm-choice ${form.response === response ? "is-on" : ""}`}>
                    <input
                      type="radio"
                      name="response"
                      value={response}
                      checked={form.response === response}
                      onChange={() => setForm((current) => ({ ...current, response }))}
                    />
                    <span>{T.responses[response]}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="field evm-guests">
              <label htmlFor="evv-guests">{T.guests}</label>
              <input
                id="evv-guests"
                type="number"
                min={1}
                max={20}
                className="nums"
                value={form.guests}
                onChange={(e) => setForm((current) => ({ ...current, guests: Math.max(1, Number(e.target.value) || 1) }))}
              />
            </div>

            <div className="field">
              <label htmlFor="evv-message">{T.message}</label>
              <textarea id="evv-message" rows={4} value={form.message} onChange={(e) => setForm((current) => ({ ...current, message: e.target.value }))} />
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
          <h2 id="evm-rsvp-title" className="evm-success-title">
            {T.successTitle.split("\n").map((l) => <span key={l}>{l}</span>)}
          </h2>
          <RollButton
            variant="outline"
            onClick={() => {
              setSuccess(false);
              setForm(INITIAL_FORM);
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
