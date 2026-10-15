import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";
import { formatDateTime } from "@/lib/format";
import type { ContributionView } from "@/lib/transactions";
import { TxnStatusPill } from "../_components/ReceiptCard";

type ContributionRow = ContributionView;

type Stats = {
  totalRaised: number;
  totalGifts: number;
  raisedThisYear: number;
  donors: number;
  pending: number;
};

const TABS = [
  { key: "success", label: "Received" },
  { key: "initialized", label: "In Progress" },
  { key: "failed", label: "Failed" },
  { key: "", label: "All" },
] as const;

function query(status: string, search: string): string {
  const q = new URLSearchParams();
  if (status) q.set("status", status);
  if (search) q.set("search", search);
  const qs = q.toString();
  return qs ? `?${qs}` : "";
}

async function loadRows(
  status: string,
  search: string
): Promise<ContributionRow[]> {
  try {
    return await adminFetch<ContributionRow[]>(
      `/contributions${query(status, search)}`
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
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const active = params.status ?? "success";
  const search = params.search?.trim() ?? "";
  const [rows, stats] = await Promise.all([
    loadRows(active, search),
    loadStats(),
  ]);

  // Every gift is charged in the currency configured at the time, so read the
  // label off the data rather than hard-coding GHS.
  const currency = rows[0]?.currency ?? "GHS";

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-3xl font-semibold">Contributions</h1>
      <p className="mt-2 text-sm text-slate-600">
        Voluntary gifts made through the public{" "}
        <Link href="/contribute" className="underline">
          Contribute
        </Link>{" "}
        page — open to members and non-members alike.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          {TABS.map((t) => (
            <Link
              key={t.label}
              href={`/admin/contributions${query(t.key, search)}`}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                active === t.key
                  ? "bg-green-900 text-cream"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <form
          action="/admin/contributions"
          className="flex flex-1 gap-2 sm:max-w-sm"
        >
          <input type="hidden" name="status" value={active} />
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Donor name, email or reference"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
          />
          <button
            type="submit"
            className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-cream hover:bg-green-800"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            {search
              ? `No contributions match “${search}”.`
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
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="align-top hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      {r.donorName}
                      {r.anonymous && (
                        <span
                          title="Donor asked not to be named publicly"
                          className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600"
                        >
                          Anonymous
                        </span>
                      )}
                      {r.memberId && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-800">
                          Member
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">{r.donorEmail}</div>
                    {r.donorPhone && (
                      <div className="text-xs text-slate-500">
                        {r.donorPhone}
                      </div>
                    )}
                    {r.message && (
                      <div className="mt-1 max-w-xs text-xs italic text-slate-500">
                        &ldquo;{r.message}&rdquo;
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                    {r.currency} {r.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{r.cause || "—"}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">
                    {r.reference}
                  </td>
                  <td className="px-6 py-4">
                    <TxnStatusPill status={r.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {formatDateTime(r.completedAt ?? r.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
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
