import type { ReportSummary } from "@/lib/transactions";
import { SaveAsPdf } from "./SaveAsPdf";

// Totals for a dated ledger view: what came in, from how many, and on what.
// Prints as the top of the saved report, above the table.
export function ReportPanel({
  title,
  period,
  filterNote,
  summary,
  truncated,
  fileName,
}: {
  title: string;
  period: string;
  filterNote?: string;
  summary: ReportSummary;
  truncated: boolean;
  fileName: string;
}) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 print:mt-0 print:border-0 print:p-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </div>
          <div className="mt-1 font-display text-2xl font-semibold text-slate-900">
            {period}
          </div>
          {filterNote && (
            <div className="mt-1 text-sm text-slate-600">{filterNote}</div>
          )}
        </div>
        <SaveAsPdf fileName={fileName} className="sm:text-right" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3 print:grid-cols-3">
        {summary.stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {s.label}
            </div>
            <div className="mt-1 font-display text-xl font-semibold text-slate-900">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {summary.groups.length > 0 && (
        <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
          {summary.groups.map((g) => (
            <li
              key={g.label}
              className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-2.5 text-sm"
            >
              <span className="text-slate-800">
                {g.label}{" "}
                <span className="text-slate-500">· {g.countText}</span>
              </span>
              <span className="font-semibold text-slate-900">{g.total}</span>
            </li>
          ))}
        </ul>
      )}

      {summary.unfinished > 0 && (
        <p className="mt-3 text-xs text-slate-500">
          {summary.unfinished} unfinished checkout
          {summary.unfinished === 1 ? "" : "s"} in this view brought in no
          money and {summary.unfinished === 1 ? "is" : "are"} left out of the
          totals.
        </p>
      )}

      {truncated && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          This range holds more transactions than one report can show, so the
          totals may be incomplete. Narrow the dates.
        </p>
      )}
    </section>
  );
}
