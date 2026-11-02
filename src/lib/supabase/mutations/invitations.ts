import { supabase } from "../client";

/* =========================================================
   TYPES
========================================================= */

export type InvitationPayload = {
  name: string;
  email: string;
  phone: string;

  organization?: string;

  event_type: string;

  event_date: string;

  event_time?: string;

  venue: string;

  audience_size?: string;

  duration?: string;

  performance_type?: string;

  additional_details?: string;

  budget_range?: string;

  website?: string;
};

export type InvitationResult = {
  success?: boolean;

  message?: string;

  error?: string;
};

/* =========================================================
   SUBMIT INVITATION
========================================================= */

export async function submitInvitation(
  payload: InvitationPayload,
) {
  const {
    data,
    error,
  } =
    await supabase.functions.invoke<InvitationResult>(
      "submit-invitation",
      {
        body: {
          name:
            payload.name.trim(),

          email:
            payload.email
              .trim()
              .toLowerCase(),

          phone:
            payload.phone.trim(),

          organization:
            payload.organization?.trim() ||
            null,

          event_type:
            payload.event_type.trim(),

          event_date:
            payload.event_date,

          event_time:
            payload.event_time?.trim() ||
            null,

          venue:
            payload.venue.trim(),

          audience_size:
            payload.audience_size?.trim() ||
            null,

          duration:
            payload.duration?.trim() ||
            null,

          performance_type:
            payload.performance_type?.trim() ||
            null,

          additional_details:
            payload.additional_details?.trim() ||
            null,

          budget_range:
            payload.budget_range?.trim() ||
            null,

          website:
            payload.website ?? "",
        },
      },
    );

  if (error) {
    throw new Error(
      error.message ||
        "Unable to submit invitation.",
    );
  }

  if (
    data?.success === false ||
    data?.error
  ) {
    throw new Error(
      data.error ||
        data.message ||
        "Unable to submit invitation.",
    );
  }

  return data;
}