"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

type DuesRow = {
  memberId: string;
  fullName: string;
  email: string;
  year: number;
  paid: boolean;
  amountPaid: number;
  paidAt: string | null;
  method?: string;
  reference?: string;
};

export function DuesTable({
  rows,
  year,
  arrearsOnly,
}: {
  rows: DuesRow[];
  year: number;
  arrearsOnly: boolean;
}) {
  const [editing, setEditing] = useState<DuesRow | null>(null);

  if (rows.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
        {arrearsOnly
          ? `No outstanding dues for ${year}.`
          : `No active members found.`}
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Member</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Amount</th>
              <th className="px-6 py-3 font-semibold">Paid On</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.memberId} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {r.fullName}
                </td>
                <td className="px-6 py-4 text-slate-600">{r.email}</td>
                <td className="px-6 py-4">
                  {r.paid ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                      Paid
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-800">
                      Unpaid
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-700">
                  {r.amountPaid ? `GH₵ ${r.amountPaid.toFixed(2)}` : "—"}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {r.paidAt ? new Date(r.paidAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setEditing(r)}
                    className="font-semibold text-green-800 hover:text-green-700"
                  >
                    Record Payment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <RecordPaymentModal
          row={editing}
          year={year}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}

function RecordPaymentModal({
  row,
  year,
  onClose,
}: {
  row: DuesRow;
  year: number;
  onClose: () => void;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(String(row.amountPaid || ""));
  const [method, setMethod] = useState(row.method ?? "");
  const [reference, setReference] = useState(row.reference ?? "");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 0) {
      setError("Enter a valid amount.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.post("/dues/payments", {
        memberId: row.memberId,
        year,
        amount: value,
        method,
        reference,
        notes,
      });
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="font-display text-xl font-semibold">
          Record Payment &mdash; {year}
        </h3>
        <p className="mt-1 text-sm text-slate-600">{row.fullName}</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Amount (GH₵)
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
              Method
            </label>
            <input
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              placeholder="Cash, MoMo, Bank Transfer…"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Reference
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Receipt no. or transaction ID"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-green-900 px-5 py-2 text-sm font-semibold text-cream hover:bg-green-800 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
