import Link from "next/link";

export type LedgerQuery = {
  status: string;
  search: string;
  // YYYY-MM-DD, or "" for no bound.
  from: string;
  to: string;
};

// Serves both the console's own links and the API call, which take the same
// query parameters.
export function ledgerHref(basePath: string, q: LedgerQuery): string {
  const p = new URLSearchParams();
  if (q.status) p.set("status", q.status);
  if (q.search) p.set("search", q.search);
  if (q.from) p.set("from", q.from);
  if (q.to) p.set("to", q.to);
  const qs = p.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// One-click ranges. Ghana time is UTC all year, so UTC calendar days are
// exactly WPN's days.
function quickRanges(now = new Date()) {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const today = isoDay(now);
  return [
    { label: "This month", from: isoDay(new Date(Date.UTC(y, m, 1))), to: today },
    {
      label: "Last month",
      from: isoDay(new Date(Date.UTC(y, m - 1, 1))),
      to: isoDay(new Date(Date.UTC(y, m, 0))),
    },
    { label: "This year", from: `${y}-01-01`, to: today },
  ];
}

const fieldLabel =
  "text-xs font-semibold uppercase tracking-wider text-slate-500";
const fieldInput =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20";

// Status tabs, search and a From/To date range for a ledger page. Plain links
// and a GET form, so every view is a shareable, bookmarkable URL.
export function LedgerFilters({
  basePath,
  tabs,
  query,
  searchPlaceholder,
}: {
  basePath: string;
  tabs: readonly { key: string; label: string }[];
  query: LedgerQuery;
  searchPlaceholder: string;
}) {
  const hasDates = Boolean(query.from || query.to);

  return (
    <div className="mt-6 print:hidden">
      <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-1">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={ledgerHref(basePath, { ...query, status: t.key })}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              query.status === t.key
                ? "bg-green-900 text-cream"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Keyed on the query so the fields refill when a quick range or tab
          link changes the URL — they're uncontrolled inputs. */}
      <form
        key={`${query.status}|${query.search}|${query.from}|${query.to}`}
        action={basePath}
        className="mt-4 flex flex-wrap items-end gap-3"
      >
        <input type="hidden" name="status" value={query.status} />
        <label className="flex min-w-[12rem] flex-1 flex-col gap-1 sm:max-w-xs">
          <span className={fieldLabel}>Search</span>
          <input
            type="search"
            name="search"
            defaultValue={query.search}
            placeholder={searchPlaceholder}
            className={fieldInput}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={fieldLabel}>From</span>
          <input
            type="date"
            name="from"
            defaultValue={query.from}
            className={fieldInput}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={fieldLabel}>To</span>
          <input
            type="date"
            name="to"
            defaultValue={query.to}
            className={fieldInput}
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-green-900 px-5 py-2 text-sm font-semibold text-cream hover:bg-green-800"
        >
          Apply
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={fieldLabel}>Quick dates</span>
        {quickRanges().map((r) => {
          const active = r.from === query.from && r.to === query.to;
          return (
            <Link
              key={r.label}
              href={ledgerHref(basePath, { ...query, from: r.from, to: r.to })}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                active
                  ? "border-green-900 bg-green-900 text-cream"
                  : "border-slate-300 bg-white text-slate-600 hover:text-slate-900"
              }`}
            >
              {r.label}
            </Link>
          );
        })}
        {hasDates ? (
          <Link
            href={ledgerHref(basePath, { ...query, from: "", to: "" })}
            className="ml-1 text-xs font-semibold text-slate-500 underline hover:text-slate-900"
          >
            Clear dates
          </Link>
        ) : (
          <span className="ml-1 text-xs text-slate-500">
            Pick dates for a report you can save as PDF.
          </span>
        )}
      </div>
    </div>
  );
}
