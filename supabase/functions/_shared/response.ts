// The one response shape every function returns, per DATA_CONTRACT_INTERACTIONS.md:
//
//   success: { ok: true, ... }
//   failure: { ok: false, error: { code, message, fields? } }

import { corsHeaders } from "./cors.ts";

export type ErrorCode =
  | "validation_failed"
  | "feature_disabled"
  | "sign_in_required"
  | "not_found"
  | "rate_limited"
  | "bad_request"
  | "method_not_allowed"
  | "server_error";

const STATUS: Record<ErrorCode, number> = {
  validation_failed: 422,
  feature_disabled: 403,
  sign_in_required: 401,
  not_found: 404,
  rate_limited: 429,
  bad_request: 400,
  method_not_allowed: 405,
  server_error: 500,
};

export function ok(req: Request, body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify({ ok: true, ...body }), {
    status,
    headers: { ...corsHeaders(req), "content-type": "application/json" },
  });
}

export function fail(
  req: Request,
  code: ErrorCode,
  message: string,
  fields?: Record<string, string>,
): Response {
  return new Response(
    JSON.stringify({ ok: false, error: { code, message, ...(fields ? { fields } : {}) } }),
    {
      status: STATUS[code],
      headers: { ...corsHeaders(req), "content-type": "application/json" },
    },
  );
}

/** Thrown by validate.ts / business logic to short-circuit straight to a fail() response. */
export class ApiError extends Error {
  code: ErrorCode;
  fields?: Record<string, string>;
  constructor(code: ErrorCode, message: string, fields?: Record<string, string>) {
    super(message);
    this.code = code;
    this.fields = fields;
  }
}
