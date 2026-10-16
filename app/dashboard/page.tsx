import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PrintHeader } from "@/components/PrintHeader";
import { SaveAsPdf } from "@/components/SaveAsPdf";
import { authFetch, getMe } from "@/lib/adminAuth";
import { getFees } from "@/lib/fees";
import { formatDate, money } from "@/lib/format";
import {
  statementLines,
  totalsByCurrency,
  type MemberTransactions,
} from "@/lib/transactions";
import { SignOutButton } from "../admin/_components/SignOutButton";

type DuesQuarter = {
  quarter: number;
  paid: boolean;
  waived: boolean;
  disabled: boolean;
  due: boolean;
};
type DuesStatus = { year: number; quarters: DuesQuarter[] };

const QUARTER_MONTHS = ["Jan – Mar", "Apr – Jun", "Jul – Sep", "Oct – Dec"];

export default async function MemberDashboard() {
  const me = await getMe();
  if (!me) redirect("/login?next=/dashboard");

  const [fees, dues, history] = await Promise.all([
    getFees(),
    authFetch<DuesStatus>("/payments/dues/status").catch(() => null),
    authFetch<MemberTransactions>("/members/me/transactions").catch(() => null),
  ]);
  // The API returns only money received, so every line here is a payment.
  const lines = history ? statementLines(history) : [];
  const totals = totalsByCurrency(lines);
  const owing = dues?.quarters.filter((q) => q.due).length ?? 0;

  return (
    <main className="bg-cream print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>
      <section className="relative overflow-hidden bg-green-950 pt-40 pb-20 texture-grain print:hidden">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-green-700/30 blur-3xl" />
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Member Dashboard
          </div>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-cream sm:text-6xl">
            Welcome, <span className="italic text-gold-400">{firstName(me.fullName)}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-cream/70">
            Your membership at a glance &mdash; dues for the year, everything
            you&rsquo;ve paid, and receipts you can save.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 print:max-w-none print:p-0">
        <PrintHeader title="Payment history" />

        <div className="grid gap-6 sm:grid-cols-2 print:hidden">
          <div className="rounded-3xl border border-green-900/10 bg-white p-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              Your account
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-green-900/80">
              <div>
                <span className="text-green-900/55">Name:</span> {me.fullName}
              </div>
              <div>
                <span className="text-green-900/55">Email:</span> {me.email}
              </div>
              <div>
                <span className="text-green-900/55">Status:</span>{" "}
                <span className="capitalize">{me.status}</span>
              </div>
              {me.applicantId && (
                <div>
                  <span className="text-green-900/55">WPN ID:</span>{" "}
                  <span className="font-mono font-semibold tracking-wide text-green-950">
                    {me.applicantId}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-5">
              <SignOutButton />
            </div>
          </div>

          {/* Dues for this year, quarter by quarter */}
          <div className="rounded-3xl border-2 border-gold-400/40 bg-white p-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              Dues {dues ? `· ${dues.year}` : ""}
            </div>
            <h2 className="mt-1 font-display text-xl font-semibold text-green-950">
              {fees.dues} every quarter
            </h2>
            <p className="mt-1 text-sm text-green-900/65">
              {fees.duesPerYear} a year keeps your voting and office-holding
              rights active.
            </p>
            {dues && (
              <>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {dues.quarters.map((q) => (
                    <QuarterChip key={q.quarter} q={q} />
                  ))}
                </div>
                <p
                  className={`mt-3 text-sm font-medium ${
                    owing ? "text-amber-700" : "text-emerald-700"
                  }`}
                >
                  {owing
                    ? `${owing} quarter${owing === 1 ? "" : "s"} due now.`
                    : `You're up to date for ${dues.year}.`}
                </p>
              </>
            )}
            <Link
              href="/dashboard/dues"
              className="mt-4 inline-flex rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-green-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
            >
              {owing ? "Pay your dues" : "View or pay ahead"} &rarr;
            </Link>
          </div>
        </div>

        {/* Payment history — also what "Save as PDF" prints */}
        <div className="mt-6 rounded-3xl border border-green-900/10 bg-white p-7 print:mt-0 print:rounded-none print:border-0 print:p-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gold-600 print:hidden">
                Payment history
              </div>
              <h2 className="mt-1 font-display text-xl font-semibold text-green-950">
                {me.fullName}
                {me.applicantId && (
                  <span className="ml-2 font-mono text-sm font-medium text-green-900/60">
                    {me.applicantId}
                  </span>
                )}
              </h2>
              <p className="mt-1 text-sm text-green-900/65">
                {lines.length
                  ? `Total paid: ${totals.join(" + ")} across ${lines.length} payment${lines.length === 1 ? "" : "s"}.`
                  : "Payments you make will appear here."}
              </p>
            </div>
            {lines.length > 0 && (
              <SaveAsPdf
                fileName={`WPN payment history - ${me.fullName}`}
                className="sm:text-right"
              />
            )}
          </div>

          {history === null ? (
            <p className="mt-5 text-sm text-red-700">
              We couldn&apos;t load your payments just now. Please refresh.
            </p>
          ) : lines.length > 0 ? (
            <div className="mt-5 overflow-x-auto rounded-2xl border border-green-900/10 print:overflow-visible">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-green-900/10 bg-cream text-xs uppercase tracking-wider text-green-900/55">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Paid for</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-900/5">
                  {lines.map((l) => (
                    <tr key={l.key} className="break-inside-avoid align-top">
                      <td className="whitespace-nowrap px-4 py-3 text-green-900/70">
                        {formatDate(l.date)}
                      </td>
                      <td className="px-4 py-3 text-green-950">
                        <div>{l.description}</div>
                        {l.method && (
                          <div className="text-xs text-green-900/55">{l.method}</div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-green-950">
                        {money(l.currency, l.amount)}
                      </td>
                      <td className="break-all px-4 py-3 font-mono text-xs text-green-900/60">
                        {l.reference || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        <div className="mt-6 rounded-3xl border border-green-900/10 bg-white p-7 print:hidden">
          <div className="text-xs font-semibold uppercase tracking-wider text-gold-600">
            Quick links
          </div>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
            <li>
              <Link
                href="/committees"
                className="font-medium text-green-800 hover:text-green-700"
              >
                Standing committees &rarr;
              </Link>
            </li>
            <li>
              <Link
                href="/executives"
                className="font-medium text-green-800 hover:text-green-700"
              >
                Executive Council &rarr;
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="font-medium text-green-800 hover:text-green-700"
              >
                Contact the General Secretary &rarr;
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <div className="print:hidden">
        <Footer />
      </div>
    </main>
  );
}

function QuarterChip({ q }: { q: DuesQuarter }) {
  const [label, tone] = q.paid
    ? ["Paid", "bg-emerald-100 text-emerald-800"]
    : q.waived
      ? ["Waived", "bg-blue-100 text-blue-800"]
      : q.disabled
        ? ["No dues", "bg-slate-100 text-slate-600"]
        : q.due
          ? ["Due", "bg-amber-100 text-amber-800"]
          : ["Upcoming", "bg-cream text-green-900/55"];
  return (
    <div className={`rounded-xl px-2 py-2 text-center ${tone}`}>
      <div className="text-sm font-semibold">Q{q.quarter}</div>
      <div className="text-[10px] uppercase tracking-wider">{label}</div>
      <div className="mt-0.5 hidden text-[10px] opacity-70 sm:block">
        {QUARTER_MONTHS[q.quarter - 1]}
      </div>
    </div>
  );
}

function firstName(full: string): string {
  return full.split(" ")[0];
}
