"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";

type Result = { total: number; sent: number; failed: string[] };

// Re-sends the approval email (with payment link) to everyone approved who
// never paid. Anyone whose link expired gets a fresh one.
export function RemindAwaitingPayment({ count }: { count: number }) {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    if (
      !window.confirm(
        `Email a payment link to all ${count} ${count === 1 ? "person" : "people"} awaiting payment?`
      )
    ) {
      return;
    }
    setSending(true);
    setError(null);
    try {
      setResult(await api.post<Result>("/members/resend-payment-links"));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't send. Try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-blue-200 bg-white p-6">
      <h2 className="font-display text-xl font-semibold">
        Approved but not yet paid
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-slate-600">
        These applicants were approved but never paid the registration fee.
        Sending re-emails each of them their approval with a payment link
        &mdash; a fresh one if theirs has expired. To remind just one person,
        open their page and use <span className="font-medium">Resend payment link</span>.
        Applicants can also get their link themselves from{" "}
        <span className="font-medium">Membership → Continue an Application</span>.
      </p>

      {result ? (
        <div className="mt-4 text-sm">
          <p className="font-medium text-emerald-700">
            Payment link sent to {result.sent} of {result.total}.
          </p>
          {result.failed.length > 0 && (
            <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
              Couldn&apos;t email: {result.failed.join(", ")}. Try these again
              from each member&apos;s page.
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <button
            type="button"
            onClick={send}
            disabled={sending || count === 0}
            className="rounded-lg bg-green-900 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-green-800 disabled:opacity-60"
          >
            {sending
              ? "Sending…"
              : `Email payment links to all ${count}`}
          </button>
          {error && <p className="mt-2 text-sm text-rose-700">{error}</p>}
        </div>
      )}
    </div>
  );
}
