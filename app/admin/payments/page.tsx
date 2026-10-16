import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";
import { formatDateTime, money } from "@/lib/format";
import {
  channelLabel,
  paymentDescription,
  rangeLabel,
  REPORT_ROW_LIMIT,
  summarizePayments,
  type PaymentListRow,
} from "@/lib/transactions";
import { TxnStatusPill } from "../_components/ReceiptCard";
import {
  LedgerFilters,
  ledgerHref,
  type LedgerQuery,
} from "../_components/LedgerFilters";
import { ReportPanel } from "../_components/ReportPanel";
import { PrintHeader } from "@/components/PrintHeader";

// "all" is explicit: with no status at all the page falls back to Successful.
const TABS = [
  { key: "success", label: "Successful" },
  { key: "initialized", label: "In Progress" },
  { key: "failed", label: "Failed" },
  { key: "all", label: "All" },
] as const;

async function loadPayments(query: LedgerQuery): Promise<PaymentListRow[]> {
  try {
    return await adminFetch<PaymentListRow[]>(ledgerHref("/payments", query));
  } catch {
    return [];
  }
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    search?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;
  const query: LedgerQuery = {
    status: params.status || "success",
    search: params.search?.trim() ?? "",
    from: params.from ?? "",
    to: params.to ?? "",
  };
  const badRange = Boolean(query.from && query.to && query.from > query.to);
  const dated = Boolean(query.from || query.to) && !badRange;
  const rows = badRange ? [] : await loadPayments(query);
  const tabLabel = TABS.find((t) => t.key === query.status)?.label ?? "All";
  const period = rangeLabel(query.from || undefined, query.to || undefined);

  return (
    <div className="max-w-6xl">
      <PrintHeader title="Payments report" />
      <h1 className="font-display text-3xl font-semibold print:hidden">
        Payments
      </h1>
      <p className="mt-2 text-sm text-slate-600 print:hidden">
        Paystack transactions for membership activation and dues. Open any
        payment for a plain-language receipt, or pick dates for a report.
      </p>

      <LedgerFilters
        basePath="/admin/payments"
        tabs={TABS}
        query={query}
        searchPlaceholder="Name, email, WPN ID or reference"
      />

      {badRange && (
        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          The &ldquo;From&rdquo; date must be on or before the &ldquo;To&rdquo;
          date.
        </div>
      )}

      {dated && (
        <ReportPanel
          title={`${tabLabel} payments`}
          period={period}
          filterNote={query.search ? `Matching “${query.search}”` : undefined}
          summary={summarizePayments(rows)}
          truncated={rows.length >= REPORT_ROW_LIMIT}
          fileName={`WPN payments report - ${period}`}
        />
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white print:overflow-visible">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            {query.search
              ? `No payments match “${query.search}”.`
              : dated
                ? "No payments in this period."
                : "No payments to show."}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Member</th>
                <th className="px-6 py-3 font-semibold">Paid for</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 print:hidden" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="break-inside-avoid align-top hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {r.member ? (
                      <>
                        <div>{r.member.fullName}</div>
                        {/* Name and WPN ID identify a member on a saved
                            report; their email stays off paper. */}
                        <div className="text-xs text-slate-500 print:hidden">
                          {r.member.email}
                        </div>
                        {r.member.applicantId && (
                          <div className="font-mono text-[11px] text-slate-500">
                            {r.member.applicantId}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div>{paymentDescription(r)}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-slate-400">
                      {r.batchReference ?? r.reference}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                    <div>{money(r.currency, r.amount)}</div>
                    {channelLabel(r.channel) && (
                      <div className="text-xs text-slate-500">
                        {channelLabel(r.channel)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <TxnStatusPill status={r.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {formatDateTime(r.completedAt ?? r.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right print:hidden">
                    <Link
                      href={`/admin/payments/${r.id}`}
                      className="font-semibold text-green-800 hover:text-green-700"
                    >
                      Details &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
