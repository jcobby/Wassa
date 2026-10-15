import { STATUS_LABEL, type Receipt, type TxnStatus } from "@/lib/transactions";

// A transaction explained for the member: what, how much, when, and what the
// status means. Doubles as the printable receipt.
export function ReceiptCard({ receipt }: { receipt: Receipt }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div
        className="bg-green-900 px-6 py-5 text-cream sm:px-8"
        // Browsers drop backgrounds when printing unless told otherwise.
        style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
      >
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">
          Wassa Professionals Network
        </div>
        <div className="mt-1 font-display text-lg font-semibold">
          {receipt.kind}
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500">{receipt.title}</div>
            <div className="mt-1 font-display text-4xl font-semibold text-slate-900">
              {receipt.amount}
            </div>
          </div>
          <TxnStatusPill status={receipt.status} />
        </div>

        <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
          {receipt.summary}
        </p>

        <dl className="mt-6 divide-y divide-slate-100">
          {receipt.rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:gap-4"
            >
              <dt className="w-36 flex-none text-xs uppercase tracking-wider text-slate-500 sm:pt-0.5">
                {row.label}
              </dt>
              <dd
                className={`min-w-0 text-sm text-slate-800 ${
                  row.mono ? "break-all font-mono text-xs sm:pt-0.5" : ""
                }`}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        {receipt.note && (
          <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
            {receipt.note}
          </p>
        )}
      </div>
    </div>
  );
}

export function TxnStatusPill({ status }: { status: TxnStatus }) {
  const colors: Record<TxnStatus, string> = {
    success: "bg-emerald-100 text-emerald-800",
    initialized: "bg-amber-100 text-amber-800",
    failed: "bg-rose-100 text-rose-800",
    abandoned: "bg-slate-200 text-slate-700",
  };
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
        colors[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
