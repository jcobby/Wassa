"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

type DisabledQuarter = { year: number; quarter: number };

const QUARTER_LABELS = ["Jan – Mar", "Apr – Jun", "Jul – Sep", "Oct – Dec"];

const keyOf = (year: number, quarter: number) => `${year}-${quarter}`;

export function QuarterCollection({
  initialDisabled,
}: {
  initialDisabled: DisabledQuarter[];
}) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [disabled, setDisabled] = useState<Set<string>>(
    () => new Set(initialDisabled.map((d) => keyOf(d.year, d.quarter)))
  );
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const years = useMemo(
    () => Array.from({ length: 5 }, (_, i) => currentYear - 2 + i),
    [currentYear]
  );

  const toggle = async (quarter: number, nextDisabled: boolean) => {
    setBusy(quarter);
    setError(null);
    // Optimistic update.
    const key = keyOf(year, quarter);
    const snapshot = new Set(disabled);
    const next = new Set(disabled);
    if (nextDisabled) next.add(key);
    else next.delete(key);
    setDisabled(next);
    try {
      await api.post("/settings/dues-quarter", {
        year,
        quarter,
        disabled: nextDisabled,
      });
      router.refresh();
    } catch (err) {
      setDisabled(snapshot); // revert
      setError(err instanceof ApiError ? err.message : "Could not update.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Year
        </label>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[1, 2, 3, 4].map((q) => {
          const isDisabled = disabled.has(keyOf(year, q));
          return (
            <div
              key={q}
              className={`flex items-center justify-between gap-3 rounded-xl border p-4 ${
                isDisabled
                  ? "border-amber-200 bg-amber-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Q{q}{" "}
                  <span className="font-normal text-slate-500">
                    ({QUARTER_LABELS[q - 1]})
                  </span>
                </div>
                <div
                  className={`mt-0.5 text-xs font-medium ${
                    isDisabled ? "text-amber-700" : "text-emerald-700"
                  }`}
                >
                  {isDisabled ? "Collection off — no one owes this quarter" : "Collecting dues"}
                </div>
              </div>
              <button
                onClick={() => toggle(q, !isDisabled)}
                disabled={busy === q}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors disabled:opacity-60 ${
                  isDisabled
                    ? "bg-green-900 text-cream hover:bg-green-800"
                    : "border border-amber-300 bg-white text-amber-800 hover:bg-amber-50"
                }`}
              >
                {busy === q
                  ? "…"
                  : isDisabled
                  ? "Re-enable"
                  : "Disable quarter"}
              </button>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
    </div>
  );
}
