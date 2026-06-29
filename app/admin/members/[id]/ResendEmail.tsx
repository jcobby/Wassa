"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";

type Mode = "payment" | "set_password";

const COPY: Record<
  Mode,
  { title: string; body: string; button: string; sending: string }
> = {
  payment: {
    title: "Awaiting payment",
    body: "This member was approved but hasn't paid yet. Resend the email containing their membership payment link (a fresh link is issued if the old one has expired).",
    button: "Resend payment link",
    sending: "Sending…",
  },
  set_password: {
    title: "Hasn't set a password",
    body: "This member has paid and their account is active, but they haven't set a password yet. Resend the email with their set-password link.",
    button: "Resend set-password email",
    sending: "Sending…",
  },
};

export function ResendEmail({ id, mode }: { id: string; mode: Mode }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const copy = COPY[mode];

  const resend = async () => {
    setLoading(true);
    setError(null);
    try {
      const out = await api.post<{ ok: boolean; email: string }>(
        `/members/${id}/resend-email`
      );
      setDone(out.email);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't send. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-display text-xl font-semibold">{copy.title}</h2>
      <p className="mt-1 text-sm text-slate-600">{copy.body}</p>

      {done ? (
        <p className="mt-4 text-sm font-medium text-emerald-700">
          Email re-sent to {done}.
        </p>
      ) : (
        <div className="mt-4">
          <button
            onClick={resend}
            disabled={loading}
            className="rounded-lg bg-green-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? copy.sending : copy.button}
          </button>
          {error && <p className="mt-2 text-sm text-rose-700">{error}</p>}
        </div>
      )}
    </div>
  );
}
