"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api, ApiError } from "@/lib/api";

type Quarter = {
  quarter: number;
  paid: boolean;
  waived: boolean;
  disabled: boolean;
  // Owed now (this or an earlier quarter).
  due: boolean;
  // Not yet settled, so it can be paid — including quarters still ahead.
  payable?: boolean;
};
type DuesStatus = {
  year: number;
  currentQuarter: number;
  amount: number;
  currency: string;
  quarters: Quarter[];
};

const QUARTER_LABELS = ["Jan – Mar", "Apr – Jun", "Jul – Sep", "Oct – Dec"];

function money(currency: string, amount: number): string {
  const symbol = currency === "GHS" ? "GH₵" : `${currency} `;
  return `${symbol}${amount}`;
}

function DuesContent() {
  const searchParams = useSearchParams();
  // This year, then next year — dues can be paid ahead through next year.
  const [statuses, setStatuses] = useState<DuesStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // "year-quarter" of the payment being opened.
  const [paying, setPaying] = useState<string | null>(null);
  const [justPaid, setJustPaid] = useState(false);

  const load = async () => {
    try {
      // The server decides what "this year" is, so ask it first, then fetch
      // the year after. A failure on next year still shows this year.
      const current = await api.get<DuesStatus>("/payments/dues/status");
      const next = await api
        .get<DuesStatus>(`/payments/dues/status?year=${current.year + 1}`)
        .catch(() => null);
      setStatuses(next ? [current, next] : [current]);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not load your dues."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const reference =
      searchParams.get("reference") || searchParams.get("trxref");
    (async () => {
      if (reference) {
        // Returning from Paystack — fulfill the payment, then refresh status.
        try {
          await api.get(`/payments/verify/${encodeURIComponent(reference)}`);
          setJustPaid(true);
        } catch {
          // Ignore — the reloaded status reflects the true state anyway.
        }
      }
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pay = async (year: number, quarter: number) => {
    setPaying(`${year}-${quarter}`);
    setError(null);
    try {
      const out = await api.post<{ authorizationUrl: string }>(
        "/payments/dues/initialize",
        { year, quarter }
      );
      window.location.href = out.authorizationUrl;
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not start payment."
      );
      setPaying(null);
    }
  };

  // Every unsettled quarter across the years shown, overdue ones included —
  // what "pay all remaining" will cover. The server recomputes the same list.
  const remaining = statuses.flatMap((s) =>
    s.quarters
      .filter((q) => q.payable)
      .map((q) => ({ year: s.year, quarter: q.quarter }))
  );
  const perQuarter = statuses[0]?.amount ?? 0;
  const currency = statuses[0]?.currency ?? "GHS";
  const remainingTotal =
    (Math.round(perQuarter * 100) * remaining.length) / 100;
  const lastYear = statuses[statuses.length - 1]?.year;

  const payAll = async () => {
    setPaying("all");
    setError(null);
    try {
      const out = await api.post<{ authorizationUrl: string }>(
        "/payments/dues/initialize-all"
      );
      window.location.assign(out.authorizationUrl);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not start payment."
      );
      setPaying(null);
    }
  };

  return (
    <main className="bg-cream">
      <Navbar />

      <section className="bg-green-950 pb-10 pt-32 texture-grain">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Membership
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold text-cream sm:text-5xl">
            Quarterly <span className="italic text-gold-400">dues</span>
          </h1>
          <p className="mt-4 max-w-xl text-cream/70">
            Dues keep your membership in good standing and your voting and
            office-holding rights active. Pay each calendar quarter.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        {justPaid && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            Payment received — thank you. Your dues status is updated below.
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-green-900/20 border-t-green-800" />
          </div>
        ) : statuses.length > 0 ? (
          <>
            {remaining.length >= 2 && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold-500/40 bg-white p-6 sm:p-8">
                <div>
                  <h2 className="font-display text-xl font-semibold text-green-950">
                    Pay all remaining dues
                  </h2>
                  <p className="mt-1 text-sm text-green-900/60">
                    {remaining.length} quarters through the end of {lastYear},
                    in one payment.
                  </p>
                </div>
                <button
                  onClick={payAll}
                  disabled={paying !== null}
                  className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-green-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {paying === "all"
                    ? "Opening…"
                    : `Pay ${money(currency, remainingTotal)}`}
                </button>
              </div>
            )}

            {statuses.map((status, i) => (
            <div
              key={status.year}
              className={`rounded-2xl border border-green-900/10 bg-white p-6 sm:p-8 ${
                i > 0 ? "mt-6" : ""
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl font-semibold text-green-950">
                  {status.year} dues
                  {i > 0 && (
                    <span className="ml-2 text-sm font-normal text-green-900/55">
                      (pay ahead)
                    </span>
                  )}
                </h2>
                <div className="text-sm text-green-900/60">
                  {money(status.currency, status.amount)} per quarter
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {status.quarters.map((q) => {
                  const label = QUARTER_LABELS[q.quarter - 1];
                  return (
                    <div
                      key={q.quarter}
                      className="flex items-center justify-between gap-3 rounded-xl border border-green-900/10 bg-cream p-4"
                    >
                      <div>
                        <div className="text-sm font-semibold text-green-950">
                          Q{q.quarter}
                        </div>
                        <div className="text-xs text-green-900/55">{label}</div>
                      </div>
                      {q.paid ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                          Paid
                        </span>
                      ) : q.waived ? (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-800">
                          Waived
                        </span>
                      ) : q.disabled ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
                          No dues
                        </span>
                      ) : q.due || q.payable ? (
                        // A quarter still ahead can be settled early — same
                        // payment, quieter styling so what's owed now leads.
                        <button
                          onClick={() => pay(status.year, q.quarter)}
                          disabled={paying !== null}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                            q.due
                              ? "bg-gold-500 text-green-950 hover:bg-gold-400"
                              : "border border-green-900/20 text-green-900 hover:bg-green-900/5"
                          }`}
                        >
                          {paying === `${status.year}-${q.quarter}`
                            ? "Opening…"
                            : q.due
                              ? `Pay ${money(status.currency, status.amount)}`
                              : `Pay ahead ${money(
                                  status.currency,
                                  status.amount
                                )}`}
                        </button>
                      ) : (
                        <span className="rounded-full border border-green-900/15 px-3 py-1 text-xs font-medium text-green-900/50">
                          Upcoming
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            ))}

            <p className="mt-6 text-center text-sm text-green-900/60">
              Payments are processed securely by Paystack (MTN MoMo, Vodafone
              Cash, card, and bank transfer).
            </p>

            <div className="mt-6 text-center">
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-green-800 hover:text-green-700"
              >
                ← Back to dashboard
              </Link>
            </div>
          </>
        ) : null}
      </section>

      <Footer />
    </main>
  );
}

export default function DuesPage() {
  return (
    <Suspense>
      <DuesContent />
    </Suspense>
  );
}
