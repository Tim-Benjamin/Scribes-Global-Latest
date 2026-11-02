import { supabase } from "../client";

/* =========================================================
   SHARED
========================================================= */

type FunctionResult = {
  success?: boolean;
  message?: string;
  error?: string;
};

/* =========================================================
   REGISTRATION
========================================================= */

export type RegisterEventPayload = {
  event_id: number | string;

  name: string;

  email: string;

  phone?: string;

  chapter?: string;

  dietary_needs?: string;

  additional_info?: string;

  website?: string;
};

export async function registerEvent(
  payload: RegisterEventPayload,
) {
  const {
    data,
    error,
  } =
    await supabase.functions.invoke<FunctionResult>(
      "register-event",
      {
        body: {
          event_id:
            payload.event_id,

          name:
            payload.name.trim(),

          email:
            payload.email
              .trim()
              .toLowerCase(),

          phone:
            payload.phone?.trim() ||
            null,

          chapter:
            payload.chapter?.trim() ||
            null,

          dietary_needs:
            payload.dietary_needs?.trim() ||
            null,

          additional_info:
            payload.additional_info?.trim() ||
            null,

          website:
            payload.website ?? "",
        },
      },
    );

  if (error) {
    throw new Error(
      error.message ||
        "Unable to register for this event.",
    );
  }

  if (
    data?.success === false ||
    data?.error
  ) {
    throw new Error(
      data.error ||
        data.message ||
        "Unable to register for this event.",
    );
  }

  return data;
}

/* =========================================================
   RSVP
========================================================= */

export type EventRsvpResponse =
  | "yes"
  | "no"
  | "maybe";

export type RsvpEventPayload = {
  event_id: number | string;

  name: string;

  email: string;

  phone?: string;

  response:
    EventRsvpResponse;

  guests_count:
    number;

  message?: string;

  website?: string;
};

export async function rsvpEvent(
  payload: RsvpEventPayload,
) {
  const {
    data,
    error,
  } =
    await supabase.functions.invoke<FunctionResult>(
      "rsvp-event",
      {
        body: {
          event_id:
            payload.event_id,

          name:
            payload.name.trim(),

          email:
            payload.email
              .trim()
              .toLowerCase(),

          phone:
            payload.phone?.trim() ||
            null,

          response:
            payload.response,

          guests_count:
            Math.max(
              1,
              Math.floor(
                payload.guests_count,
              ),
            ),

          message:
            payload.message?.trim() ||
            null,

          website:
            payload.website ?? "",
        },
      },
    );

  if (error) {
    throw new Error(
      error.message ||
        "Unable to submit your RSVP.",
    );
  }

  if (
    data?.success === false ||
    data?.error
  ) {
    throw new Error(
      data.error ||
        data.message ||
        "Unable to submit your RSVP.",
    );
  }

  return data;
}