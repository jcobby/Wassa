"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

type Quarter = {
  quarter: number;
  paid: boolean;
  waived: boolean;
  due: boolean;
};
type DuesStatus = {
  year: number;
  currentQuarter: number;
  amount: number;
  currency: string;
  quarters: Quarter[];
};

const LABELS = ["Jan – Mar", "Apr – Jun", "Jul – Sep", "Oct – Dec"];

export function DuesManager({ id }: { id: string }) {
  const [status, setStatus] = useState<DuesStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get<DuesStatus>(`/members/${id}/dues`)
      .then((s) => active && setStatus(s))
      .catch(
        (err) =>
          active &&
          setError(err instanceof ApiError ? err.message : "Couldn't load dues.")
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const toggle = async (quarter: number, waived: boolean) => {
    if (!status) return;
    setBusy(quarter);
    setError(null);
    try {
      const s = await api.post<DuesStatus>(`/members/${id}/dues-waiver`, {
        year: status.year,
        quarter,
        waived,
      });
      setStatus(s);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-display text-xl font-semibold">
        Quarterly dues &mdash; {status?.year ?? new Date().getFullYear()}
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Waive a quarter for a member who joined mid-year or has an approved
        hardship deferral — waived quarters are not owed and can&apos;t be paid.
      </p>

      {error && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-4 text-sm text-slate-500">Loading…</div>
      ) : status ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {status.quarters.map((q) => (
            <div
              key={q.quarter}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
            >
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Q{q.quarter}
                </div>
                <div className="text-xs text-slate-500">
                  {LABELS[q.quarter - 1]}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {q.paid ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                    Paid
                  </span>
                ) : q.waived ? (
                  <>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-blue-800">
                      Waived
                    </span>
                    <button
                      onClick={() => toggle(q.quarter, false)}
                      disabled={busy !== null}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50"
                    >
                      Un-waive
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        q.due
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {q.due ? "Due" : "Upcoming"}
                    </span>
                    <button
                      onClick={() => toggle(q.quarter, true)}
                      disabled={busy !== null}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 disabled:opacity-50"
                    >
                      Waive
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
