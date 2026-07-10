"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

export function FeeForm({
  initialAmount,
  initialCurrency,
  endpoint = "/settings/membership-fee",
}: {
  initialAmount: number;
  initialCurrency: string;
  endpoint?: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(String(initialAmount));
  const [currency, setCurrency] = useState(initialCurrency);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const save = async () => {
    setError(null);
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a positive amount.");
      return;
    }
    setSaving(true);
    try {
      await api.patch(endpoint, {
        amount: value,
        currency: currency || undefined,
      });
      setSavedAt(new Date());
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_120px_auto] sm:items-end">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Amount
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Currency
        </label>
        <input
          value={currency}
          onChange={(e) => setCurrency(e.target.value.toUpperCase())}
          maxLength={3}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono uppercase outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
        />
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="h-10 rounded-lg bg-green-900 px-5 text-sm font-semibold text-cream hover:bg-green-800 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save"}
      </button>

      {error && (
        <div className="sm:col-span-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
      {savedAt && !error && (
        <div className="sm:col-span-3 text-xs text-emerald-700">
          Saved at {savedAt.toLocaleTimeString()}.
        </div>
      )}
    </div>
  );
}
