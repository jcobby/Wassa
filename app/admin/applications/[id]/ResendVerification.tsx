"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";

export function ResendVerification({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resend = async () => {
    setLoading(true);
    setError(null);
    try {
      const out = await api.post<{ ok: boolean; email: string }>(
        `/applications/${id}/resend-verification`
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

  if (done) {
    return (
      <p className="mt-3 text-sm font-medium text-amber-900">
        Confirmation link re-sent to {done}.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <button
        onClick={resend}
        disabled={loading}
        className="rounded-lg border border-amber-400 bg-white px-4 py-2 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-100 disabled:opacity-60"
      >
        {loading ? "Sending…" : "Resend confirmation email"}
      </button>
      {error && <p className="mt-2 text-sm text-rose-700">{error}</p>}
    </div>
  );
}
