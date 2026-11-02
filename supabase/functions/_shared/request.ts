import { fail } from "./response.ts";
import { handlePreflight } from "./cors.ts";

/**
 * Standard entry guard for every function: handles the CORS preflight,
 * rejects anything but POST, and parses the JSON body. Returns either the
 * parsed body or an already-built Response to return immediately.
 */
export async function readJsonBody(
  req: Request,
): Promise<Record<string, unknown> | Response> {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  if (req.method !== "POST") {
    return fail(req, "method_not_allowed", "Use POST.");
  }

  try {
    const body = await req.json();
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return fail(req, "bad_request", "Expected a JSON object body.");
    }
    return body as Record<string, unknown>;
  } catch {
    return fail(req, "bad_request", "Body must be valid JSON.");
  }
}

export function isResponse(x: unknown): x is Response {
  return x instanceof Response;
}
