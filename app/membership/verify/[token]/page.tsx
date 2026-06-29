"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api, ApiError } from "@/lib/api";

type State =
  | { kind: "verifying" }
  | { kind: "success"; email?: string }
  | { kind: "error"; message: string };

export default function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [state, setState] = useState<State>({ kind: "verifying" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const out = await api.post<{ ok: boolean; email?: string }>(
          "/applications/verify",
          { token }
        );
        if (!cancelled) setState({ kind: "success", email: out.email });
      } catch (err) {
        if (cancelled) return;
        setState({
          kind: "error",
          message:
            err instanceof ApiError
              ? err.message
              : "We couldn't confirm your email. The link may have expired.",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="bg-cream">
      <Navbar />

      <section className="relative min-h-screen overflow-hidden bg-green-950 pt-32 pb-20 texture-grain">
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-green-700/35 blur-3xl" />

        <div className="mx-auto flex max-w-5xl items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-cream/10 bg-cream p-8 text-center shadow-2xl shadow-black/30 sm:p-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                Membership Application
              </div>

              {state.kind === "verifying" && (
                <>
                  <h1 className="mt-3 font-display text-3xl font-semibold text-green-950">
                    Confirming your email…
                  </h1>
                  <div className="mt-8 flex justify-center">
                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-green-900/20 border-t-green-800" />
                  </div>
                </>
              )}

              {state.kind === "success" && (
                <>
                  <div className="mx-auto mt-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h1 className="mt-5 font-display text-3xl font-semibold text-green-950">
                    Email confirmed
                  </h1>
                  <p className="mt-2 text-sm text-green-900/70">
                    Thank you{state.email ? `, ${state.email}` : ""}. Your email
                    is verified. The Executive Council will review your
                    application and email you the outcome.
                  </p>
                  <Link
                    href="/"
                    className="mt-7 inline-flex rounded-full bg-gold-500 px-8 py-3.5 font-semibold text-green-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
                  >
                    Back to Home
                  </Link>
                </>
              )}

              {state.kind === "error" && (
                <>
                  <h1 className="mt-3 font-display text-3xl font-semibold text-green-950">
                    Couldn&apos;t confirm email
                  </h1>
                  <p className="mt-3 text-sm text-green-900/70">{state.message}</p>
                  <Link
                    href="/contact"
                    className="mt-7 inline-flex rounded-full border border-green-900/20 px-7 py-3 text-sm font-semibold text-green-900 transition-colors hover:border-green-700"
                  >
                    Contact the General Secretary
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
