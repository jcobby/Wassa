"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

export function MemberActions({
  id,
  status,
}: {
  id: string;
  status: "active" | "suspended" | "terminated";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"suspend" | "reinstate" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const act = async (kind: "suspend" | "reinstate") => {
    setLoading(kind);
    setError(null);
    try {
      await api.patch(`/members/${id}/${kind}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Action failed. Try again."
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-display text-xl font-semibold">Member actions</h2>
      <p className="mt-1 text-sm text-slate-600">
        Per Article 13 of the Constitution, members may be suspended from
        voting and office-holding for a period not exceeding twelve (12)
        months. Suspension is reversible &mdash; reinstatement restores all
        member rights.
      </p>

      {error && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {status === "active" && (
          <button
            onClick={() => act("suspend")}
            disabled={loading !== null}
            className="rounded-lg border border-amber-300 bg-white px-5 py-2.5 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:opacity-60"
          >
            {loading === "suspend" ? "Suspending…" : "Suspend Member"}
          </button>
        )}
        {status === "suspended" && (
          <button
            onClick={() => act("reinstate")}
            disabled={loading !== null}
            className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading === "reinstate" ? "Reinstating…" : "Reinstate Member"}
          </button>
        )}
        {status === "terminated" && (
          <span className="text-sm text-slate-500">
            Termination is final and cannot be reversed via this console.
          </span>
        )}
      </div>
    </div>
  );
}
