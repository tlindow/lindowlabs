"use client";

import { useState, type FormEvent } from "react";

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/**
 * Phone + PIN gate matching Tinker's Stytch SMS OTP flow
 * (POST /api/auth/phone/request and /api/auth/phone/verify).
 */
export default function LearningSignIn() {
  const [step, setStep] = useState<"phone" | "pin">("phone");
  const [phone, setPhone] = useState("");
  const [phoneId, setPhoneId] = useState("");
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState("");
  const [statusKind, setStatusKind] = useState<"info" | "error" | "ok" | "">("");
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
      // Full reload so the server reads the new httpOnly cookie.
      window.location.assign("/learning");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Verify failed");
      setStatusKind("error");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-16">
      <div className="max-w-md w-full space-y-6">
        <div className="space-y-3 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted">
            Lindow Labs Learning
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
            {step === "pin" ? "Enter your code" : "Sign in"}
          </h1>
          <p className="text-sm font-mono text-muted leading-relaxed">
            {step === "pin" ? (
              <>
                Sent to <strong className="text-foreground">{formatPhone(phone)}</strong>.
                The code expires in 10 minutes.
              </>
            ) : (
              <>
                Same Stytch SMS sign-in as Tinker. Enter your phone number and
                we&rsquo;ll text a six-digit code.
              </>
            )}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={onPhoneSubmit} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-xs font-mono font-bold text-foreground">
                Phone
              </span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(555) 555-5555"
                className="w-full px-3 py-2.5 text-sm font-mono bg-surface border border-border text-foreground focus:outline-none focus:border-indigo-dark"
                disabled={busy}
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full px-4 py-2.5 text-sm font-mono font-bold text-foreground border border-border hover:border-indigo-dark hover:text-indigo-dark transition-colors disabled:opacity-60"
            >
              Text me a code
            </button>
          </form>
        ) : (
          <form onSubmit={onPinSubmit} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-xs font-mono font-bold text-foreground">
                Six-digit code
              </span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="123456"
                className="w-full px-3 py-2.5 text-sm font-mono bg-surface border border-border text-foreground focus:outline-none focus:border-indigo-dark tracking-[0.3em]"
                disabled={busy}
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full px-4 py-2.5 text-sm font-mono font-bold text-foreground border border-border hover:border-indigo-dark hover:text-indigo-dark transition-colors disabled:opacity-60"
            >
              Verify
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setStep("phone");
                setPin("");
                setStatus("");
                setStatusKind("");
              }}
              className="w-full px-4 py-2 text-xs font-mono text-muted hover:text-foreground transition-colors"
            >
              Use a different number
            </button>
          </form>
        )}

        {status ? (
          <p
            className={[
              "text-center text-xs font-mono",
              statusKind === "error"
                ? "text-rose"
                : statusKind === "ok"
                  ? "text-mint-dark"
                  : "text-muted",
            ].join(" ")}
            role="status"
          >
            {status}
          </p>
        ) : null}
      </div>
    </main>
  );
}
