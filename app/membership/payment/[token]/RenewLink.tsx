"use client";

import { useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";

// Shown on an expired payment link: one click emails a fresh link to the
// applicant's own address (never on screen — see the API route).
export function RenewLink({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const renew = async () => {
    setLoading(true);
    setError(null);
    try {
      const out = await api.post<{ email: string }>(
        `/payments/access/${encodeURIComponent(token)}/renew`
      );
      setSentTo(out.email);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't send a new link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (sentTo) {
    return (
      <div className="mt-6 rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-800">
        A fresh payment link is on its way to{" "}
        <span className="font-semibold">{sentTo}</span>. Check your spam folder
        if it doesn&apos;t arrive in a few minutes.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={renew}
        disabled={loading}
        className="inline-flex rounded-full bg-gold-500 px-7 py-3 text-sm font-semibold text-green-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Sending…" : "Email me a new payment link"}
      </button>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {error && (
        <p className="mt-2 text-xs text-green-900/55">
          Still stuck?{" "}
          <Link href="/contact" className="font-semibold underline">
            Contact the General Secretary
          </Link>
          .
        </p>
      )}
    </div>
  );
}
