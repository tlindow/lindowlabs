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

export type StytchSessionPayload = {
  session_token?: string;
  session_jwt?: string;
  user?: StytchUser;
  phone_id?: string;
  user_created?: boolean;
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

async function stytchPost(
  path: string,
  body: Record<string, unknown>
): Promise<StytchSessionPayload> {
  const env = readStytchEnv();
  if (!env) {
    throw new StytchError("Stytch is not configured on this deployment.", 503);
  }
  const url = baseUrlFor(env.projectId) + path;
  const auth = Buffer.from(`${env.projectId}:${env.secret}`).toString("base64");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
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
    const record = payload as unknown as {
      error_message?: string;
      error_type?: string;
    } | null;
    const message =
      (record && (record.error_message || record.error_type)) ||
      `Stytch ${res.status}`;
    throw new StytchError(message, res.status, record?.error_type);
  }

  return payload || {};
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
