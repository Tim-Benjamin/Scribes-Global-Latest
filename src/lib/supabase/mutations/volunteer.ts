import { supabase } from "../client";

/* =========================================================
   TYPES
========================================================= */

export type VolunteerApplicationPayload = {
  opportunity_id?: number | string | null;

  first_name: string;

  last_name: string;

  email: string;

  phone: string;

  availability: string;

  skills: string;

  motivation: string;

  chapter?: string;

  website?: string;
};

export type VolunteerApplicationResult = {
  success?: boolean;

  message?: string;

  error?: string;
};

/* =========================================================
   APPLY
========================================================= */

export async function applyVolunteer(
  payload: VolunteerApplicationPayload,
) {
  const {
    data,
    error,
  } =
    await supabase.functions.invoke<VolunteerApplicationResult>(
      "apply-volunteer",
      {
        body: {
          opportunity_id:
            payload.opportunity_id ??
            null,

          first_name:
            payload.first_name.trim(),

          last_name:
            payload.last_name.trim(),

          email:
            payload.email
              .trim()
              .toLowerCase(),

          phone:
            payload.phone.trim(),

          availability:
            payload.availability.trim(),

          skills:
            payload.skills.trim(),

          motivation:
            payload.motivation.trim(),

          chapter:
            payload.chapter?.trim() ||
            null,

          website:
            payload.website ?? "",
        },
      },
    );

  if (error) {
    throw new Error(
      error.message ||
        "Unable to submit volunteer application.",
    );
  }

  if (
    data?.success === false ||
    data?.error
  ) {
    throw new Error(
      data.error ||
        data.message ||
        "Unable to submit volunteer application.",
    );
  }

  return data;
}