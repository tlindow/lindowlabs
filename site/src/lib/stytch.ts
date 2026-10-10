/**
 * Thin Stytch REST client for the /learning auth flow.
 * Mirrors beginner-work/tinker api/_lib/stytch.js: SMS OTP login_or_create,
 * OTP authenticate, and session authenticate. Same env names:
 * STYTCH_PROJECT_ID + STYTCH_SECRET.
 */

export type StytchEmail = { email: string; email_id?: string; verified?: boolean };
export type StytchPhone = {
  phone_number: string;
  phone_id?: string;
  verified?: boolean;
};
export type StytchUser = {
  user_id: string;
  created_at?: string;
  emails?: StytchEmail[];
  phone_numbers?: StytchPhone[];
  trusted_metadata?: Record<string, unknown>;
};

export type StytchAuthFactor = {
  delivery_method?: string;
  phone_number?: string;
  type?: string;
};

export type StytchSessionPayload = {
  session_token?: string;
  session_jwt?: string;
  user?: StytchUser;
  phone_id?: string;
  user_created?: boolean;
  /** Present on sessions/authenticate; may carry the SMS factor phone. */
  session?: {
    authentication_factors?: StytchAuthFactor[];
  };
};

export class StytchError extends Error {
  status: number;
  stytchType?: string;

  constructor(message: string, status = 500, stytchType?: string) {
    super(message);
    this.name = "StytchError";
    this.status = status;
    this.stytchType = stytchType;
  }
}

export function readStytchEnv(): { projectId: string; secret: string } | null {
  const projectId = process.env.STYTCH_PROJECT_ID;
  const secret = process.env.STYTCH_SECRET;
  if (!projectId || !secret) return null;
  return { projectId, secret };
}

function baseUrlFor(projectId: string): string {
  return projectId.startsWith("project-test-")
    ? "https://test.stytch.com"
    : "https://api.stytch.com";
}

function stytchAuthHeader(projectId: string, secret: string): string {
  return `Basic ${Buffer.from(`${projectId}:${secret}`).toString("base64")}`;
}

async function stytchParseError(
  res: Response,
  payload: unknown
): Promise<never> {
  const record = payload as {
    error_message?: string;
    error_type?: string;
  } | null;
  const message =
    (record && (record.error_message || record.error_type)) ||
    `Stytch ${res.status}`;
  throw new StytchError(message, res.status, record?.error_type);
}

async function stytchPost(
  path: string,
  body: Record<string, unknown>
): Promise<StytchSessionPayload> {
  const env = readStytchEnv();
  if (!env) {
    throw new StytchError("Stytch is not configured on this deployment.", 503);
  }
  const url = baseUrlFor(env.projectId) + path;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: stytchAuthHeader(env.projectId, env.secret),
    },
    body: JSON.stringify(body),
  });

  let payload: StytchSessionPayload | null = null;
  try {
    payload = (await res.json()) as StytchSessionPayload;
  } catch {
    payload = null;
  }

  if (!res.ok) {
    await stytchParseError(res, payload);
  }

  return payload || {};
}

async function stytchGet(path: string): Promise<StytchUser> {
  const env = readStytchEnv();
  if (!env) {
    throw new StytchError("Stytch is not configured on this deployment.", 503);
  }
  const url = baseUrlFor(env.projectId) + path;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: stytchAuthHeader(env.projectId, env.secret),
    },
    cache: "no-store",
  });

  let payload: StytchUser | null = null;
  try {
    payload = (await res.json()) as StytchUser;
  } catch {
    payload = null;
  }

  if (!res.ok) {
    await stytchParseError(res, payload);
  }

  return payload || { user_id: "" };
}

/** Full user profile (includes phone_numbers). GET /v1/users/{user_id}. */
export async function getStytchUser(userId: string): Promise<StytchUser> {
  if (!userId || typeof userId !== "string") {
    throw new StytchError("user_id is required.", 400);
  }
  return stytchGet(`/v1/users/${encodeURIComponent(userId)}`);
}

/** Normalize a 10-digit US phone to E.164 (same as Tinker). */
export function toE164(raw: string): string {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  throw new StytchError("Enter a 10-digit US phone number.", 400);
}

export async function sendSmsOtp(phone: string): Promise<StytchSessionPayload> {
  return stytchPost("/v1/otps/sms/login_or_create", {
    phone_number: toE164(phone),
    expiration_minutes: 10,
  });
}

export async function authenticateOtp(
  phoneId: string,
  code: string
): Promise<StytchSessionPayload> {
  if (!phoneId || typeof phoneId !== "string") {
    throw new StytchError("phone_id is required.", 400);
  }
  if (!/^\d{6}$/.test(String(code || ""))) {
    throw new StytchError("Enter the 6-digit code you received.", 400);
  }
  // 30 days — same duration as Tinker.
  return stytchPost("/v1/otps/authenticate", {
    method_id: phoneId,
    code,
    session_duration_minutes: 60 * 24 * 30,
  });
}

export async function authenticateSession(
  bearer: string
): Promise<StytchSessionPayload> {
  if (!bearer || typeof bearer !== "string") {
    throw new StytchError("Missing token.", 401);
  }
  const body = bearer.includes(".")
    ? { session_jwt: bearer }
    : { session_token: bearer };
  try {
    return await stytchPost("/v1/sessions/authenticate", body);
  } catch (err) {
    if (err instanceof StytchError && err.status >= 400 && err.status < 500) {
      throw new StytchError("Session expired.", 401);
    }
    throw err;
  }
}

/** Collect emails from a Stytch user (emails[] + trusted_metadata.email). */
export function emailsFromStytchUser(user: StytchUser | null | undefined): string[] {
  if (!user) return [];
  const out: string[] = [];
  for (const entry of user.emails || []) {
    if (entry?.email) out.push(entry.email);
  }
  const meta = user.trusted_metadata;
  if (meta && typeof meta.email === "string") out.push(meta.email);
  if (meta && Array.isArray(meta.emails)) {
    for (const value of meta.emails) {
      if (typeof value === "string") out.push(value);
    }
  }
  return out;
}

/** Collect phone numbers from a Stytch user (phone_numbers[]). */
export function phonesFromStytchUser(
  user: StytchUser | null | undefined
): string[] {
  if (!user) return [];
  const out: string[] = [];
  for (const entry of user.phone_numbers || []) {
    if (entry?.phone_number) out.push(entry.phone_number);
  }
  return out;
}

/** Phones from session authentication_factors (SMS login factor). */
export function phonesFromSessionFactors(
  session: StytchSessionPayload | null | undefined
): string[] {
  const factors = session?.session?.authentication_factors;
  if (!factors?.length) return [];
  const out: string[] = [];
  for (const factor of factors) {
    if (factor?.phone_number) out.push(factor.phone_number);
  }
  return out;
}

function uniquePhones(phones: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const phone of phones) {
    const key = phone.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(phone);
  }
  return out;
}

/**
 * Resolve phones for ownership after sessions/authenticate.
 * Session user payloads sometimes omit phone_numbers; fall back to
 * authentication_factors, then users.get(user_id). Never logs phones.
 */
export async function loadUserPhonesForAccess(
  session: StytchSessionPayload,
  deps: { getUser?: (userId: string) => Promise<StytchUser> } = {}
): Promise<string[]> {
  const getUser = deps.getUser ?? getStytchUser;
  const merged = uniquePhones([
    ...phonesFromStytchUser(session.user),
    ...phonesFromSessionFactors(session),
  ]);
  if (merged.length > 0) return merged;

  const userId = session.user?.user_id;
  if (!userId) return [];

  try {
    const full = await getUser(userId);
    return uniquePhones(phonesFromStytchUser(full));
  } catch {
    // Fail closed on phone resolution; ownership stays false without phones.
    return [];
  }
}
