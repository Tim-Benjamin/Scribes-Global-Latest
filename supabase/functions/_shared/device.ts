// Turns a client-supplied device_id into a salted hash before it ever touches
// a table, per DATA_CONTRACT_INTERACTIONS.md ("the server stores only a
// salted hash"). Uses HMAC-SHA256 with a server-only secret so the raw
// device_id (and therefore the visitor's identity across posts) can never be
// recovered from the database alone.
//
// Set DEVICE_HASH_SALT as a Supabase secret before deploying:
//   supabase secrets set DEVICE_HASH_SALT="$(openssl rand -hex 32)"
// If it's ever missing, we fail closed (throw) rather than hashing with a
// predictable fallback.

let keyPromise: Promise<CryptoKey> | null = null;

function getKey(): Promise<CryptoKey> {
  if (keyPromise) return keyPromise;
  const salt = Deno.env.get("DEVICE_HASH_SALT");
  if (!salt) {
    throw new Error("DEVICE_HASH_SALT secret is not set — run: supabase secrets set DEVICE_HASH_SALT=<random-value>");
  }
  keyPromise = crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(salt),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return keyPromise;
}

export async function hashDeviceId(deviceId: string): Promise<string> {
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(deviceId));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
