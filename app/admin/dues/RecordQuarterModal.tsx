"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";

export type RecordResult = {
  paymentId: string;
  receiptSent: boolean;
  receiptError?: string;
};

const METHODS = ["Cash", "Mobile money", "Bank transfer", "Cheque", "Other"];
const QUARTER_MONTHS = ["Jan – Mar", "Apr – Jun", "Jul – Sep", "Oct – Dec"];

// Records one quarter of dues paid outside Paystack. Once saved, the quarter
// counts as paid everywhere — including the member's own dues page — and the
// member can be emailed a receipt.
export function RecordQuarterModal({
  memberId,
  memberName,
  year,
  quarter,
  defaultAmount,
  currency,
  onClose,
  onSaved,
}: {
  memberId: string;
  memberName: string;
  year: number;
  quarter: number;
  defaultAmount: number;
  currency: string;
  onClose: () => void;
  onSaved: (result: RecordResult) => void;
}) {
  // Ghana time is UTC, so today's UTC date is WPN's today.
  const today = new Date().toISOString().slice(0, 10);
  const [amount, setAmount] = useState(String(defaultAmount));
  const [method, setMethod] = useState("Cash");
  const [reference, setReference] = useState("");
  const [paidAt, setPaidAt] = useState(today);
  const [notes, setNotes] = useState("");
  const [sendReceipt, setSendReceipt] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter the amount received.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const out = await api.post<RecordResult>("/dues/quarters", {
        memberId,
        year,
        quarter,
        amount: value,
        method,
        reference,
        notes,
        paidAt,
        sendReceipt,
      });
      onSaved(out);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save. Try again.");
      setSaving(false);
    }
  };

  const field =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20";
  const label = "mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="font-display text-xl font-semibold">
          Record Q{quarter} {year} dues
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          {memberName} &middot; {QUARTER_MONTHS[quarter - 1]} {year}
        </p>

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Amount ({currency})</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={field}
              />
            </div>
            <div>
              <label className={label}>Date paid</label>
              <input
                type="date"
                max={today}
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                className={field}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={field}
              >
                {METHODS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Receipt no.</label>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Optional"
                className={field}
              />
            </div>
          </div>
          <div>
            <label className={label}>Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional — e.g. collected at the AGM"
              className={`${field} resize-none`}
            />
          </div>
          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={sendReceipt}
              onChange={(e) => setSendReceipt(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-green-800"
            />
            Email the member a receipt
          </label>

          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-green-900 px-5 py-2 text-sm font-semibold text-cream hover:bg-green-800 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Record payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
