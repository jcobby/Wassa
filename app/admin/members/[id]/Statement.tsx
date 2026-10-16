import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";
import { formatDate, money } from "@/lib/format";
import {
  duesSummary,
  statementLines,
  totalsByCurrency,
  type DuesStatus,
  type MemberTransactions,
} from "@/lib/transactions";
import { TxnStatusPill } from "../../_components/ReceiptCard";
import { SaveAsPdf } from "@/components/SaveAsPdf";

// Everything a member has paid, as one statement the admin can walk them
// through or save as a PDF. Unfinished checkouts are hidden by default —
// every abandoned Paystack page leaves one, and they aren't money received.
export async function Statement({
  id,
  showAll,
}: {
  id: string;
  showAll: boolean;
}) {
  const [data, dues] = await Promise.all([
    adminFetch<MemberTransactions>(`/members/${id}/transactions`).catch(
      () => null
    ),
    adminFetch<DuesStatus>(`/members/${id}/dues`).catch(() => null),
  ]);

  if (!data) {
    return (
      <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700 print:hidden">
        Couldn&apos;t load this member&apos;s payments. Refresh to try again.
      </div>
    );
  }

  const all = statementLines(data);
  const paid = all.filter((l) => l.status === "success");
  const unfinished = all.length - paid.length;
  const shown = showAll ? all : paid;
  const totals = totalsByCurrency(paid);
  const firstName = data.member.fullName.split(/\s+/)[0];

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 print:mt-0 print:border-0 print:p-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">
            Payments &amp; statement
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate-600 print:hidden">
            Everything {firstName} has paid &mdash; registration fee, quarterly
            dues, contributions, and payments recorded by hand. Open a line for
            its full receipt.
          </p>
        </div>
        <SaveAsPdf
          fileName={`WPN statement - ${data.member.fullName}`}
          className="sm:text-right"
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3 print:grid-cols-3">
        <Tile label="Total paid" value={totals.length ? totals.join(" + ") : "—"} />
        <Tile label="Payments" value={String(paid.length)} />
        <Tile
          label="Last payment"
          value={paid[0] ? formatDate(paid[0].date) : "—"}
        />
      </div>

      {dues && (
        <p className="mt-3 text-sm text-slate-600">{duesSummary(dues)}</p>
      )}

      {unfinished > 0 && (
        <Link
          href={showAll ? `/admin/members/${id}` : `/admin/members/${id}?txns=all`}
          scroll={false}
          className="mt-3 inline-flex text-sm font-semibold text-green-800 hover:text-green-700 print:hidden"
        >
          {showAll
            ? "Show completed payments only"
            : `Show ${unfinished} unfinished checkout${unfinished === 1 ? "" : "s"}`}
        </Link>
      )}

      {shown.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500">
          No payments on record yet.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 print:overflow-visible">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Paid for</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 print:hidden" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((l) => (
                <tr key={l.key} className="break-inside-avoid align-top hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {formatDate(l.date)}
                  </td>
                  <td className="px-4 py-3 text-slate-800">
                    <div>{l.description}</div>
                    {l.method && (
                      <div className="text-xs text-slate-500">{l.method}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                    {money(l.currency, l.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <TxnStatusPill status={l.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right print:hidden">
                    {l.href && (
                      <Link
                        href={l.href}
                        className="font-semibold text-green-800 hover:text-green-700"
                      >
                        Receipt &rarr;
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="mt-1 font-display text-lg font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}
