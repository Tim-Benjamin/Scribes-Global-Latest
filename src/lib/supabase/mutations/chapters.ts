import { supabase } from "../client";

export type JoinChapterPayload = {
  chapter_id:
    number | string;

  first_name:
    string;

  last_name:
    string;

  email:
    string;

  phone?:
    string;

  message?:
    string;

  website?:
    string;
};

export type JoinChapterResult = {
  success?: boolean;
  message?: string;
  error?: string;
};

/* =========================================================
   JOIN CHAPTER
========================================================= */

export async function joinChapter(
  payload: JoinChapterPayload,
) {
  const {
    data,
    error,
  } =
    await supabase.functions.invoke<
      JoinChapterResult
    >("join-chapter", {
      body: {
        ...payload,

        phone:
          payload.phone?.trim() ||
          null,

        message:
          payload.message?.trim() ||
          null,

        website:
          payload.website ?? "",
      },
    });

  if (error) {
    throw new Error(
      error.message ||
        "Unable to submit your request.",
    );
  }

  if (
    data?.success === false ||
    data?.error
  ) {
    throw new Error(
      data.error ||
        data.message ||
        "Unable to submit your request.",
    );
  }

  return data;
}