"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RecordQuarterModal, type RecordResult } from "./RecordQuarterModal";

export type GridQuarter = {
  quarter: number;
  paid: boolean;
  waived: boolean;
  disabled: boolean;
  due: boolean;
  // Paid quarter recorded by an admin rather than on Paystack.
  manual: boolean;
};

export type GridRow = {
  memberId: string;
  fullName: string;
  email: string;
  applicantId: string | null;
  quarters: GridQuarter[];
  owed: number;
};

type Picked = { row: GridRow; quarter: number };

// Every member's four quarters at a glance. An unpaid quarter is a button:
// click it to record a payment taken in cash, by bank transfer, and so on.
export function DuesGrid({
  rows,
  year,
  amount,
  currency,
}: {
  rows: GridRow[];
  year: number;
  amount: number;
  currency: string;
}) {
  const router = useRouter();
  const [picked, setPicked] = useState<Picked | null>(null);
  const [notice, setNotice] = useState<{ text: string; warn: boolean } | null>(null);

  const saved = (p: Picked, out: RecordResult) => {
    setPicked(null);
    setNotice({
      text: `Recorded Q${p.quarter} ${year} for ${p.row.fullName}.${
        out.receiptSent
          ? " Receipt emailed."
          : out.receiptError
            ? ` The receipt couldn't be emailed (${out.receiptError}).`
            : ""
      }`,
      warn: Boolean(out.receiptError),
    });
    router.refresh();
  };

  return (
    <>
      {notice && (
        <div
          className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
            notice.warn
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No members to show.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Member</th>
                {[1, 2, 3, 4].map((q) => (
                  <th key={q} className="px-2 py-3 text-center font-semibold">
                    Q{q}
                  </th>
                ))}
                <th className="px-6 py-3 font-semibold">Owes</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.memberId} className="hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <div className="font-medium text-slate-900">{r.fullName}</div>
                    <div className="text-xs text-slate-500">
                      {r.applicantId ? (
                        <span className="font-mono">{r.applicantId}</span>
                      ) : (
                        r.email
                      )}
                    </div>
                  </td>
                  {r.quarters.map((q) => (
                    <td key={q.quarter} className="px-2 py-3 text-center">
                      <Chip q={q} onRecord={() => setPicked({ row: r, quarter: q.quarter })} />
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-6 py-3">
                    {r.owed > 0 ? (
                      <span className="font-semibold text-amber-700">
                        {r.owed} &times; {currency} {amount.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-emerald-700">Up to date</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right">
                    <Link
                      href={`/admin/members/${r.memberId}`}
                      className="font-semibold text-green-800 hover:text-green-700"
                    >
                      Member &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {picked && (
        <RecordQuarterModal
          memberId={picked.row.memberId}
          memberName={picked.row.fullName}
          year={year}
          quarter={picked.quarter}
          defaultAmount={amount}
          currency={currency}
          onClose={() => setPicked(null)}
          onSaved={(out) => saved(picked, out)}
        />
      )}
    </>
  );
}

function Chip({ q, onRecord }: { q: GridQuarter; onRecord: () => void }) {
  const base =
    "inline-flex min-w-[4.5rem] flex-col items-center rounded-lg px-2 py-1 text-[11px] font-semibold uppercase tracking-wider";
  if (q.paid) {
    return (
      <span
        className={`${base} bg-emerald-100 text-emerald-800`}
        title={q.manual ? "Recorded by an admin" : "Paid on the website"}
      >
        Paid
        {q.manual && (
          <span className="text-[9px] font-medium normal-case tracking-normal">
            by admin
          </span>
        )}
      </span>
    );
  }
  if (q.waived) return <span className={`${base} bg-blue-100 text-blue-800`}>Waived</span>;
  if (q.disabled) return <span className={`${base} bg-slate-100 text-slate-500`}>Off</span>;
  return (
    <button
      type="button"
      onClick={onRecord}
      title="Record a payment for this quarter"
      className={`${base} transition-colors ${
        q.due
          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
          : "border border-dashed border-slate-300 text-slate-500 hover:border-green-700 hover:text-green-800"
      }`}
    >
      {q.due ? "Due" : "Upcoming"}
      <span className="text-[9px] font-medium normal-case tracking-normal">
        record
      </span>
    </button>
  );
}
