"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";

type Result = { email: string; total: number; currency: string; sentAt: string };

// Emails one member the dues they owe this year, with a link to pay online.
// Used on the members list and on the member's own page.
export function RemindDuesButton({
  id,
  name,
  lastSentAt,
  align = "right",
}: {
  id: string;
  name: string;
  lastSentAt?: string | null;
  align?: "left" | "right";
}) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    if (!window.confirm(`Email ${name} a reminder to pay their outstanding dues?`)) {
      return;
    }
    setSending(true);
    setError(null);
    try {
      setSent(await api.post<Result>(`/members/${id}/remind-dues`));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't send. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className={`flex flex-col gap-0.5 ${align === "right" ? "items-end text-right" : "items-start"}`}
    >
      {sent ? (
        <span className="text-xs font-semibold text-emerald-700">
          Reminder sent ({sent.currency} {sent.total.toFixed(2)})
        </span>
      ) : (
        <button
          type="button"
          onClick={send}
          disabled={sending}
          className="whitespace-nowrap rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100 disabled:opacity-60"
        >
          {sending ? "Sending…" : "Remind to pay"}
        </button>
      )}
      {error ? (
        <span className="max-w-[220px] text-xs text-rose-700">{error}</span>
      ) : (
        !sent &&
        lastSentAt && (
          <span className="text-[11px] text-slate-500">
            Last reminded {new Date(lastSentAt).toLocaleDateString()}
          </span>
        )
      )}
    </div>
  );
}
