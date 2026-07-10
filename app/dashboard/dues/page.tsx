"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api, ApiError } from "@/lib/api";

type Quarter = { quarter: number; paid: boolean; waived: boolean; due: boolean };
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
  const [status, setStatus] = useState<DuesStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState<number | null>(null);
  const [justPaid, setJustPaid] = useState(false);

  const load = async () => {
    try {
      const s = await api.get<DuesStatus>("/payments/dues/status");
      setStatus(s);
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

  const pay = async (quarter: number) => {
    if (!status) return;
    setPaying(quarter);
    setError(null);
    try {
      const out = await api.post<{ authorizationUrl: string }>(
        "/payments/dues/initialize",
        { year: status.year, quarter }
      );
      window.location.href = out.authorizationUrl;
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
        ) : status ? (
          <>
            <div className="rounded-2xl border border-green-900/10 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl font-semibold text-green-950">
                  {status.year} dues
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
                      ) : q.due ? (
                        <button
                          onClick={() => pay(q.quarter)}
                          disabled={paying !== null}
                          className="rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-green-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {paying === q.quarter
                            ? "Opening…"
                            : `Pay ${money(status.currency, status.amount)}`}
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
