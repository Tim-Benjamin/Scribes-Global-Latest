import { useState } from "react";
import { motion } from "motion/react";

import { subscribeToNewsletter } from "../../lib/supabase/mutations/newsletter";

import "./blog.css";

type Status = "idle" | "submitting" | "success" | "error";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setMessage(null);

    try {
      const result = await subscribeToNewsletter({ email, website });
      setStatus("success");
      setMessage(result.message);
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to subscribe right now.");
    }
  }

  return (
    <section className="newsletter-cta" id="newsletter">
      <div className="newsletter-cta__glow" aria-hidden="true" />

      <motion.div
        className="newsletter-cta__container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="newsletter-cta__eyebrow">Stay connected</p>

        <h2>Join the Scribes Global newsletter.</h2>

        <p>
          Stories, new chapters, upcoming events and creative resources — straight to your inbox,
          as they happen.
        </p>

        <form className="newsletter-cta__form" onSubmit={handleSubmit}>
          <label className="newsletter-cta__honeypot" aria-hidden="true">
            Leave this field empty
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>

          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "submitting"}
          />

          <button type="submit" className="newsletter-cta__submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>

        {message && (
          <p
            className={`newsletter-cta__status newsletter-cta__status--${
              status === "error" ? "bad" : "good"
            }`}
            role="status"
          >
            {message}
          </p>
        )}
      </motion.div>
    </section>
  );
}
