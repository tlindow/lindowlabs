"use client";

import { useState, type FormEvent } from "react";
import "./learning-auth-gate.css";

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** Lindow Labs stacked-L mark (same asset as /public/brand/lindow-labs-icon.svg). */
function LindowLabsMark() {
  return (
    <svg viewBox="0 0 64 64" width="48" height="48" fill="none" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#FFFDF7" />
      <defs>
        <linearGradient id="ll-login-cool" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="50%" stopColor="#A5B4FC" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>
      </defs>
      <path
        d="M14 10 H22 V38 H44 V46 H14 Z"
        fill="url(#ll-login-cool)"
        opacity="0.65"
      />
      <path d="M22 18 H30 V46 H52 V54 H22 Z" fill="#1F1D1A" />
    </svg>
  );
}

type LearningSignInProps = {
  /**
   * Static GitHub Pages host: show the same gate UI, but SMS cannot run
   * without the Vercel SSR deploy. No client-side security pretence.
   */
  staticHost?: boolean;
};

/**
 * Phone + PIN gate matching Tinker's Stytch SMS OTP UI
 * (cream backdrop, indigo capsule, Fraunces title), with the Lindow Labs mark.
 */
export default function LearningSignIn({ staticHost = false }: LearningSignInProps) {
  const [step, setStep] = useState<"phone" | "pin">("phone");
  const [phone, setPhone] = useState("");
  const [phoneId, setPhoneId] = useState("");
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState(
    staticHost
      ? "SMS sign-in needs the Vercel deploy (Stytch API routes)."
      : ""
  );
  const [statusKind, setStatusKind] = useState<"info" | "error" | "ok" | "">(
    staticHost ? "info" : ""
  );
  const [busy, setBusy] = useState(false);

  async function postJson(path: string, body: Record<string, string>) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let data: { error?: string; phone_id?: string; token?: string } = {};
    try {
      data = (await res.json()) as typeof data;
    } catch {
      data = {};
    }
    if (!res.ok) {
      throw new Error(data.error || `Request failed (${res.status})`);
    }
    return data;
  }

  async function onPhoneSubmit(event: FormEvent) {
    event.preventDefault();
    if (staticHost) {
      setStatus("SMS sign-in needs the Vercel deploy with Stytch env vars.");
      setStatusKind("error");
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setStatus("Please enter a 10-digit US phone number.");
      setStatusKind("error");
      return;
    }
    setBusy(true);
    setStatus("Sending code…");
    setStatusKind("info");
    try {
      const data = await postJson("/api/auth/phone/request", { phone: digits });
      if (!data.phone_id) throw new Error("No phone_id returned.");
      setPhoneId(data.phone_id);
      setStatus("Code sent.");
      setStatusKind("info");
      setStep("pin");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Request failed");
      setStatusKind("error");
    } finally {
      setBusy(false);
    }
  }

  async function onPinSubmit(event: FormEvent) {
    event.preventDefault();
    if (!phoneId) {
      setStatus("Your code expired. Request a new one.");
      setStatusKind("error");
      setStep("phone");
      return;
    }
    const code = pin.replace(/\D/g, "");
    if (code.length !== 6) {
      setStatus("Enter the 6-digit code you received.");
      setStatusKind("error");
      return;
    }
    setBusy(true);
    setStatus("Verifying…");
    setStatusKind("info");
    try {
      await postJson("/api/auth/phone/verify", {
        phone_id: phoneId,
        pin: code,
      });
      setStatus("Welcome back.");
      setStatusKind("ok");
      window.location.assign("/learning");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Verify failed");
      setStatusKind("error");
      setBusy(false);
    }
  }

  return (
    <div className="learning-auth-gate" role="dialog" aria-modal="true">
      <div className="learning-auth-gate__inner">
        <div className="learning-auth-gate__brand">
          <LindowLabsMark />
        </div>

        <h1 className="learning-auth-gate__title">
          {step === "pin" ? "Enter your code" : "Sign in or sign up"}
        </h1>

        <p className="learning-auth-gate__lede">
          {step === "pin" ? (
            <>
              Sent to <strong>{formatPhone(phone)}</strong>. The code expires in
              10 minutes.
            </>
          ) : (
            <>
              Enter your phone number and we&rsquo;ll text you a six-digit code.
              New numbers create an account.
            </>
          )}
        </p>

        {step === "phone" ? (
          <form
            onSubmit={onPhoneSubmit}
            className="learning-auth-gate__pill"
            role="search"
          >
            <span className="learning-auth-gate__cc" aria-hidden="true">
              +1
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(555) 000-0000"
              maxLength={14}
              aria-label="Phone number"
              required
              disabled={busy}
            />
            <button
              type="submit"
              className="learning-auth-gate__begin"
              disabled={busy}
            >
              Send code
            </button>
          </form>
        ) : (
          <form
            onSubmit={onPinSubmit}
            className="learning-auth-gate__pill learning-auth-gate__pill--pin"
            role="search"
          >
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              maxLength={6}
              pattern="\d{6}"
              aria-label="Six-digit code"
              required
              disabled={busy}
            />
            <button
              type="submit"
              className="learning-auth-gate__begin"
              disabled={busy}
            >
              Verify
            </button>
          </form>
        )}

        <div
          className="learning-auth-gate__status"
          role="status"
          aria-live="polite"
          data-kind={statusKind || undefined}
        >
          {status}
        </div>

        {step === "pin" ? (
          <button
            type="button"
            className="learning-auth-gate__link"
            disabled={busy}
            onClick={() => {
              setStep("phone");
              setPin("");
              setPhoneId("");
              setStatus("");
              setStatusKind("");
            }}
          >
            ← Use a different number
          </button>
        ) : null}

        <p className="learning-auth-gate__fineprint">
          Private Lindow Labs learning desk. Only an allowlisted phone can sign
          in; everyone else is refused before a code is sent.
        </p>

        <p className="learning-auth-gate__fineprint">
          Sign-up and login use the same screen. First-time users get an account
          created automatically when they verify.
        </p>

        <p className="learning-auth-gate__made-by">Lindow Labs Learning</p>
      </div>
    </div>
  );
}
