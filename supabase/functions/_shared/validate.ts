// Small, dependency-free validation helpers shared by every function.
// Each returns a string error message, or null when the value is fine, so
// callers can build up a `fields` object for a single validation_failed reply.

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function stringLength(
  v: unknown,
  min: number,
  max: number,
): string | null {
  if (typeof v !== "string") return "This field is required.";
  const len = v.trim().length;
  if (len < min) return `Must be at least ${min} character${min === 1 ? "" : "s"}.`;
  if (len > max) return `Must be ${max} characters or fewer.`;
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function email(v: unknown): string | null {
  if (typeof v !== "string" || !EMAIL_RE.test(v.trim())) {
    return "Enter a valid email address.";
  }
  return null;
}

export function optionalString(v: unknown, max: number): string | null {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v !== "string") return "Invalid value.";
  if (v.length > max) return `Must be ${max} characters or fewer.`;
  return null;
}

export function positiveInt(v: unknown): string | null {
  if (typeof v !== "number" || !Number.isInteger(v) || v <= 0) {
    return "Must be a positive whole number.";
  }
  return null;
}

export function oneOf<T extends string>(v: unknown, options: readonly T[]): string | null {
  if (typeof v !== "string" || !options.includes(v as T)) {
    return `Must be one of: ${options.join(", ")}.`;
  }
  return null;
}

const DEVICE_ID_RE = /^[A-Za-z0-9_-]{16,64}$/;
export function deviceId(v: unknown): string | null {
  if (typeof v !== "string" || !DEVICE_ID_RE.test(v)) {
    return "Invalid device id.";
  }
  return null;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export function isoDate(v: unknown): string | null {
  if (typeof v !== "string" || !DATE_RE.test(v) || Number.isNaN(Date.parse(v))) {
    return "Enter a valid date (YYYY-MM-DD).";
  }
  return null;
}

/**
 * The honeypot field every public form includes: a hidden input named
 * `website` that real visitors leave empty. A non-empty value means a bot
 * filled every field it could find. Callers should still respond with the
 * normal success shape (so the bot gets no signal), just skip the insert.
 */
export function isHoneypotTripped(body: Record<string, unknown>): boolean {
  return typeof body.website === "string" && body.website.trim().length > 0;
}
