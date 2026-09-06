"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

export type ContributionConfig = {
  enabled: boolean;
  currency: string;
  minAmount: number;
  suggestedAmounts: number[];
  causes: string[];
};

// Both lists are edited as free text — comma-separated for amounts, one per
// line for causes — which is far quicker for an admin than a chip editor.
function parseAmounts(raw: string): number[] | null {
  const parts = raw
    .split(/[,\n]/)
    .map((p) => p.trim())
    .filter(Boolean);
  const nums = parts.map(Number);
  if (nums.some((n) => !Number.isFinite(n) || n <= 0)) return null;
  return [...new Set(nums)].sort((a, b) => a - b);
}

export function ContributionSettings({
  initial,
}: {
  initial: ContributionConfig;
}) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initial.enabled);
  const [currency, setCurrency] = useState(initial.currency);
  const [minAmount, setMinAmount] = useState(String(initial.minAmount));
  const [amounts, setAmounts] = useState(initial.suggestedAmounts.join(", "));
  const [causes, setCauses] = useState(initial.causes.join("\n"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const save = async () => {
    setError(null);

    const min = Number(minAmount);
    if (!Number.isFinite(min) || min <= 0) {
      setError("The minimum contribution must be a positive amount.");
      return;
    }
    const suggested = parseAmounts(amounts);
    if (!suggested) {
      setError("Suggested amounts must be positive numbers, comma-separated.");
      return;
    }
    if (suggested.length > 8) {
      setError("Please keep suggested amounts to eight or fewer.");
      return;
    }
    const causeList = causes
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);
    if (causeList.length > 12) {
      setError("Please keep causes to twelve or fewer.");
      return;
    }

    setSaving(true);
    try {
      await api.patch("/settings/contributions", {
        enabled,
        currency: currency || undefined,
        minAmount: min,
        suggestedAmounts: suggested,
        causes: causeList,
      });
      setSavedAt(new Date());
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const input =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20";
  const label =
    "mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500";

  return (
    <div className="mt-6 space-y-5">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-none accent-green-800"
        />
        <span className="text-sm text-slate-700">
          <span className="font-medium text-slate-900">
            Accept contributions online
          </span>
          <br />
          When off, the public Contribute page explains that giving is paused
          and no new transaction can be started.
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Minimum contribution</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className={input}
          />
          <p className="mt-1 text-xs text-slate-500">
            A floor only — donors may give any amount above it, with no maximum.
          </p>
        </div>
        <div>
          <label className={label}>Currency</label>
          <input
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            maxLength={3}
            className={`${input} font-mono uppercase`}
          />
        </div>
      </div>

      <div>
        <label className={label}>Suggested amounts</label>
        <input
          value={amounts}
          onChange={(e) => setAmounts(e.target.value)}
          placeholder="50, 100, 200, 500, 1000"
          className={input}
        />
        <p className="mt-1 text-xs text-slate-500">
          Comma-separated. Shown as one-tap buttons on the Contribute page.
        </p>
      </div>

      <div>
        <label className={label}>Causes a gift can be directed to</label>
        <textarea
          rows={5}
          value={causes}
          onChange={(e) => setCauses(e.target.value)}
          placeholder={"Where it's needed most\nEducation Fund"}
          className={`${input} resize-none`}
        />
        <p className="mt-1 text-xs text-slate-500">
          One per line. The first line is the default selection. Leave empty to
          hide the choice entirely.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="h-10 rounded-lg bg-green-900 px-5 text-sm font-semibold text-cream hover:bg-green-800 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {savedAt && !error && (
          <span className="text-xs text-emerald-700">
            Saved at {savedAt.toLocaleTimeString()}.
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
    </div>
  );
}
