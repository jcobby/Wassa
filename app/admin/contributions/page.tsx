import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";
import { formatDateTime } from "@/lib/format";
import {
  giftDesignation,
  rangeLabel,
  REPORT_ROW_LIMIT,
  summarizeContributions,
  type ContributionView,
} from "@/lib/transactions";
import { TxnStatusPill } from "../_components/ReceiptCard";
import {
  LedgerFilters,
  ledgerHref,
  type LedgerQuery,
} from "../_components/LedgerFilters";
import { ReportPanel } from "../_components/ReportPanel";
import { PrintHeader } from "@/components/PrintHeader";

type Stats = {
  totalRaised: number;
  totalGifts: number;
  raisedThisYear: number;
  donors: number;
  pending: number;
};

// "all" is explicit: with no status at all the page falls back to Received.
const TABS = [
  { key: "success", label: "Received" },
  { key: "initialized", label: "In Progress" },
  { key: "failed", label: "Failed" },
  { key: "all", label: "All" },
] as const;

async function loadRows(query: LedgerQuery): Promise<ContributionView[]> {
  try {
    return await adminFetch<ContributionView[]>(
      ledgerHref("/contributions", query)
    );
  } catch {
    return [];
  }
}

async function loadStats(): Promise<Stats> {
  try {
    return await adminFetch<Stats>("/contributions/stats");
  } catch {
    return {
      totalRaised: 0,
      totalGifts: 0,
      raisedThisYear: 0,
      donors: 0,
      pending: 0,
    };
  }
}

export default async function ContributionsPage({
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
  const [rows, stats] = await Promise.all([
    badRange ? Promise.resolve([]) : loadRows(query),
    loadStats(),
  ]);
  const tabLabel = TABS.find((t) => t.key === query.status)?.label ?? "All";
  const period = rangeLabel(query.from || undefined, query.to || undefined);

  // Every gift is charged in the currency configured at the time, so read the
  // label off the data rather than hard-coding GHS.
  const currency = rows[0]?.currency ?? "GHS";

  return (
    <div className="max-w-6xl">
      <PrintHeader title="Contributions report" />
      <h1 className="font-display text-3xl font-semibold print:hidden">
        Contributions
      </h1>
      <p className="mt-2 text-sm text-slate-600 print:hidden">
        Voluntary gifts made through the public{" "}
        <Link href="/contribute" className="underline">
          Contribute
        </Link>{" "}
        page — open to members and non-members alike.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
        <Stat
          label="Total raised"
          value={`${currency} ${stats.totalRaised.toFixed(2)}`}
        />
        <Stat
          label={`Raised in ${new Date().getFullYear()}`}
          value={`${currency} ${stats.raisedThisYear.toFixed(2)}`}
        />
        <Stat label="Gifts received" value={String(stats.totalGifts)} />
        <Stat label="Distinct donors" value={String(stats.donors)} />
      </div>

      <LedgerFilters
        basePath="/admin/contributions"
        tabs={TABS}
        query={query}
        searchPlaceholder="Donor name, email or reference"
      />

      {badRange && (
        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          The &ldquo;From&rdquo; date must be on or before the &ldquo;To&rdquo;
          date.
        </div>
      )}

      {dated && (
        <ReportPanel
          title={`${tabLabel} contributions`}
          period={period}
          filterNote={query.search ? `Matching “${query.search}”` : undefined}
          summary={summarizeContributions(rows)}
          truncated={rows.length >= REPORT_ROW_LIMIT}
          fileName={`WPN contributions report - ${period}`}
        />
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white print:overflow-visible">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            {query.search
              ? `No contributions match “${query.search}”.`
              : dated
                ? "No contributions in this period."
                : "No contributions to show."}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Donor</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Directed to</th>
                <th className="px-6 py-3 font-semibold">Reference</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 print:hidden" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="break-inside-avoid align-top hover:bg-slate-50">
                  {/* A saved report can travel well beyond the Secretariat:
                      on paper, anonymous donors stay unnamed and nobody's
                      contact details or message are included. */}
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className={r.anonymous ? "print:hidden" : ""}>
                        {r.donorName}
                      </span>
                      {r.anonymous && (
                        <>
                          <span className="hidden print:inline">
                            Anonymous donor
                          </span>
                          <span
                            title="Donor asked not to be named publicly"
                            className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 print:hidden"
                          >
                            Anonymous
                          </span>
                        </>
                      )}
                      {r.memberId && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-800">
                          Member
                        </span>
                      )}
                    </div>
                    <div className="print:hidden">
                      <div className="text-xs text-slate-500">{r.donorEmail}</div>
                      {r.donorPhone && (
                        <div className="text-xs text-slate-500">
                          {r.donorPhone}
                        </div>
                      )}
                      {/* An "Other" gift's message is its purpose, shown under
                          "Directed to" instead. */}
                      {r.message && giftDesignation(r) === r.cause && (
                        <div className="mt-1 max-w-xs text-xs italic text-slate-500">
                          &ldquo;{r.message}&rdquo;
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                    {r.currency} {r.amount.toFixed(2)}
                  </td>
                  <td className="max-w-xs px-6 py-4 text-slate-600">
                    {giftDesignation(r) || "—"}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">
                    {r.reference}
                  </td>
                  <td className="px-6 py-4">
                    <TxnStatusPill status={r.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {formatDateTime(r.completedAt ?? r.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right print:hidden">
                    <Link
                      href={`/admin/contributions/${r.id}`}
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="mt-1.5 font-display text-2xl font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}
