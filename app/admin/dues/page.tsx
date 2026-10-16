import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";
import { money } from "@/lib/format";
import { DuesGrid, type GridRow } from "./DuesGrid";

type Overview = {
  year: number;
  currentQuarter: number;
  amount: number;
  currency: string;
  rows: GridRow[];
  summary: {
    activeMembers: number;
    membersOwing: number;
    quartersOwed: number;
    amountOwed: number;
    quartersPaid: number;
    collected: number;
  };
};

async function loadOverview(
  year: number,
  view: string,
  search: string
): Promise<Overview | null> {
  const q = new URLSearchParams({ year: String(year) });
  if (view === "owing") q.set("view", "owing");
  if (search) q.set("search", search);
  try {
    return await adminFetch<Overview>(`/dues?${q}`);
  } catch {
    return null;
  }
}

export default async function DuesPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; view?: string; search?: string }>;
}) {
  const params = await searchParams;
  const currentYear = new Date().getFullYear();
  const year = Number(params.year) || currentYear;
  const view = params.view === "owing" ? "owing" : "all";
  const search = params.search?.trim() ?? "";
  const data = await loadOverview(year, view, search);
  // Dues can be recorded up to the end of next year.
  const years = Array.from({ length: 4 }, (_, i) => currentYear - 2 + i);

  const href = (over: Partial<{ year: number; view: string }>) => {
    const q = new URLSearchParams({ year: String(over.year ?? year) });
    const v = over.view ?? view;
    if (v === "owing") q.set("view", "owing");
    if (search) q.set("search", search);
    return `/admin/dues?${q}`;
  };

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-3xl font-semibold">Dues</h1>
      <p className="mt-2 text-sm text-slate-600">
        Quarterly dues for every active member, by the same rules members see
        on their own dues page. Click an unpaid quarter to record a payment
        taken in cash or by transfer.
      </p>

      {data && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label={`Members owing (${year})`}
            value={`${data.summary.membersOwing} of ${data.summary.activeMembers}`}
            accent={data.summary.membersOwing > 0}
          />
          <Stat label="Quarters overdue" value={String(data.summary.quartersOwed)} />
          <Stat
            label="Outstanding"
            value={money(data.currency, data.summary.amountOwed)}
          />
          <Stat
            label={`Collected in ${year}`}
            value={money(data.currency, data.summary.collected)}
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          {years.map((y) => (
            <Link
              key={y}
              href={href({ year: y })}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                y === year ? "bg-green-900 text-cream" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {y}
            </Link>
          ))}
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          {[
            { key: "all", label: "All members" },
            { key: "owing", label: "Owing only" },
          ].map((t) => (
            <Link
              key={t.key}
              href={href({ view: t.key })}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                view === t.key ? "bg-green-900 text-cream" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
        <form action="/admin/dues" className="flex flex-1 gap-2 sm:max-w-xs">
          <input type="hidden" name="year" value={year} />
          {view === "owing" && <input type="hidden" name="view" value="owing" />}
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Name, email or WPN ID"
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

      {data ? (
        <DuesGrid
          rows={data.rows}
          year={data.year}
          amount={data.amount}
          currency={data.currency}
        />
      ) : (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700">
          Couldn&apos;t load dues. Refresh to try again.
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        A quarter is <span className="font-semibold">due</span> once it has
        started; later quarters are upcoming and can be paid ahead. Waive a
        quarter for one member from their page, or turn a quarter off for
        everyone in Settings.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 ${
        accent ? "border-amber-300" : "border-slate-200"
      }`}
    >
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="mt-1.5 font-display text-2xl font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}
