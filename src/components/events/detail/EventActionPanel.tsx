import { RollButton } from "../../../fx";
import { EVENT_ACTIONS, EVENT_OVERVIEW } from "../../../content/events";
import { eventDateParts } from "../../../lib/events/format";
import { getEventActions } from "../../../lib/events/actions";
import type { EventItem } from "../../../lib/supabase/queries/events";

type EventActionPanelProps = {
  event: EventItem;
  onRegister: () => void;
  onRsvp: () => void;
  /** "panel" = sticky card beside the description; "dock" = compact bar on phones. */
  layout?: "panel" | "dock";
};

export default function EventActionPanel({ event, onRegister, onRsvp, layout = "panel" }: EventActionPanelProps) {
  const a = getEventActions(event);
  const date = eventDateParts(event.start_date, event.end_date);

  const buttons = (
    <div className="eva-actions">
      {a.registrationAvailable ? (
        <RollButton size={layout === "panel" ? "lg" : "md"} onClick={onRegister} cursor="Register">{EVENT_ACTIONS.register}</RollButton>
      ) : null}
      {a.showFull && layout === "panel" ? <span className="eva-full">{EVENT_ACTIONS.full}</span> : null}
      {a.rsvpAvailable ? (
        <RollButton variant={a.registrationAvailable ? "outline" : "solid"} size={layout === "panel" ? "lg" : "md"} onClick={onRsvp} cursor="RSVP">
          {EVENT_ACTIONS.rsvp}
        </RollButton>
      ) : null}
      {a.virtualLink ? (
        <RollButton href={a.virtualLink} variant={a.hasActions ? "ghost" : "solid"} size={layout === "panel" ? "lg" : "md"} cursor="Join">
          {EVENT_OVERVIEW.joinVirtual}
        </RollButton>
      ) : null}
    </div>
  );

  if (layout === "dock") {
    if (!a.hasAnything) return null;
    return (
      <div className="eva-dock theme-night">
        <span className="eva-dock-date nums">
          <strong>{date.day}</strong> {date.month}
        </span>
        {buttons}
      </div>
    );
  }

  return (
    <div className="eva theme-night">
      <div className="eva-date" aria-hidden="true">
        <span className="eva-day nums">{date.day}</span>
        <span className="eva-my">
          <span className="nums">{date.month} {date.year}</span>
          <span className="eva-wd">{date.weekday}{date.time ? `, ${date.time}` : ""}</span>
        </span>
      </div>

      {a.hasActions ? (
        <div className="eva-copy">
          <p className="kicker">{EVENT_ACTIONS.kicker}</p>
          <h2 className="eva-title">
            {EVENT_ACTIONS.title.split("\n").map((l) => <span key={l}>{l}</span>)}
          </h2>
          <p className="eva-text">{a.registrationAvailable ? EVENT_ACTIONS.registerCopy : EVENT_ACTIONS.rsvpCopy}</p>
        </div>
      ) : null}

      {a.hasAnything || a.showFull ? buttons : null}
    </div>
  );
}
