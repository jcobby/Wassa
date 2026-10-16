"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import {
  RecordQuarterModal,
  type RecordResult,
} from "../../dues/RecordQuarterModal";

type Quarter = {
  quarter: number;
  paid: boolean;
  waived: boolean;
  disabled: boolean;
  due: boolean;
  // The payment that settled a paid quarter; `manual` if an admin recorded it.
  payment: { id: string; manual: boolean } | null;
};
type DuesStatus = {
  year: number;
  currentQuarter: number;
  amount: number;
  currency: string;
  quarters: Quarter[];
};

const LABELS = ["Jan – Mar", "Apr – Jun", "Jul – Sep", "Oct – Dec"];

export function DuesManager({ id, memberName }: { id: string; memberName: string }) {
  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(thisYear);
  const [status, setStatus] = useState<DuesStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [recording, setRecording] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get<DuesStatus>(`/members/${id}/dues?year=${year}`)
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
  }, [id, year]);

  const switchYear = (y: number) => {
    setLoading(true);
    setError(null);
    setNotice(null);
    setYear(y);
  };

  const run = async (quarter: number, request: () => Promise<DuesStatus>) => {
    setBusy(quarter);
    setError(null);
    setNotice(null);
    try {
      setStatus(await request());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed.");
    } finally {
      setBusy(null);
    }
  };

  const toggleWaiver = (quarter: number, waived: boolean) =>
    run(quarter, () =>
      api.post<DuesStatus>(`/members/${id}/dues-waiver`, { year, quarter, waived })
    );

  const remove = (q: Quarter) => {
    if (
      !q.payment ||
      !window.confirm(
        `Remove the payment recorded for Q${q.quarter} ${year}? The quarter will show as unpaid again.`
      )
    ) {
      return;
    }
    const paymentId = q.payment.id;
    return run(q.quarter, async () =>
      (await api.delete<{ dues: DuesStatus }>(`/dues/quarters/${paymentId}`)).dues
    );
  };

  const recorded = async (quarter: number, out: RecordResult) => {
    setRecording(null);
    setNotice(
      `Recorded Q${quarter} ${year}.${
        out.receiptSent
          ? " Receipt emailed."
          : out.receiptError
            ? ` The receipt couldn't be emailed (${out.receiptError}).`
            : ""
      }`
    );
    setStatus(await api.get<DuesStatus>(`/members/${id}/dues?year=${year}`));
  };

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Quarterly dues</h2>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          {[thisYear - 1, thisYear, thisYear + 1].map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => switchYear(y)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                y === year ? "bg-green-900 text-cream" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        Record a quarter paid in cash or by transfer, or waive one for a member
        who joined mid-year or has an approved hardship deferral &mdash; waived
        quarters are not owed and can&apos;t be paid.
      </p>

      {notice && (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {notice}
        </div>
      )}
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
                <div className="text-xs text-slate-500">{LABELS[q.quarter - 1]}</div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                {q.paid ? (
                  <>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                      {q.payment?.manual ? "Paid · recorded" : "Paid"}
                    </span>
                    {q.payment?.manual && (
                      <button
                        type="button"
                        onClick={() => remove(q)}
                        disabled={busy !== null}
                        className="text-xs font-semibold text-rose-700 hover:text-rose-900 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </>
                ) : q.waived ? (
                  <>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-blue-800">
                      Waived
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleWaiver(q.quarter, false)}
                      disabled={busy !== null}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50"
                    >
                      Un-waive
                    </button>
                  </>
                ) : q.disabled ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Turned off
                  </span>
                ) : (
                  <>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        q.due ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {q.due ? "Due" : "Upcoming"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRecording(q.quarter)}
                      disabled={busy !== null}
                      className="text-xs font-semibold text-green-800 hover:text-green-950 disabled:opacity-50"
                    >
                      Record payment
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWaiver(q.quarter, true)}
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

      {status && recording !== null && (
        <RecordQuarterModal
          memberId={id}
          memberName={memberName}
          year={year}
          quarter={recording}
          defaultAmount={status.amount}
          currency={status.currency}
          onClose={() => setRecording(null)}
          onSaved={(out) => recorded(recording, out)}
        />
      )}
    </div>
  );
}
