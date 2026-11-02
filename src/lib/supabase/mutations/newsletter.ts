import { supabase } from "../client";

export type NewsletterSubscribePayload = {
  email: string;
  name?: string;
  website?: string; // honeypot — always sent empty by real visitors
};

type NewsletterSubscribeResponse = {
  ok?: boolean;
  status?: "pending" | "active";
  message?: string;
  error?: { code: string; message: string; fields?: Record<string, string> };
};

export async function subscribeToNewsletter(payload: NewsletterSubscribePayload) {
  const { data, error } = await supabase.functions.invoke<NewsletterSubscribeResponse>(
    "newsletter-subscribe",
    {
      body: {
        email: payload.email.trim().toLowerCase(),
        name: payload.name?.trim() || undefined,
        website: payload.website ?? "",
      },
    }
  );

  if (error) {
    throw new Error(error.message || "Unable to subscribe right now. Please try again.");
  }

  if (data?.ok === false) {
    throw new Error(data.error?.message || "Unable to subscribe right now. Please try again.");
  }

  return { status: data?.status ?? "active", message: data?.message ?? "Thanks for subscribing!" };
}
