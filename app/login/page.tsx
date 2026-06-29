"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api, ApiError } from "@/lib/api";

type LoginResponse = {
  id: string;
  email: string;
  role: "member" | "admin";
  fullName: string;
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in? Skip the form — send them to their area.
  useEffect(() => {
    api
      .get<LoginResponse>("/auth/me")
      .then((m) => router.replace(m.role === "admin" ? "/admin" : "/dashboard"))
      .catch(() => {
        // Not signed in — stay on the login page.
      });
  }, [router]);

  const submit = async () => {
    setError(null);
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const me = await api.post<LoginResponse>("/auth/login", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      const rawNext = searchParams.get("next");
      // Only allow internal paths — blocks open-redirect via a crafted ?next=.
      const next =
        rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
          ? rawNext
          : null;
      const fallback = me.role === "admin" ? "/admin" : "/dashboard";
      router.push(next || fallback);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Sign in failed. Please try again."
      );
      setLoading(false);
    }
  };

  const field =
    "w-full rounded-xl border border-green-900/15 bg-white px-4 py-3 text-green-950 outline-none transition-colors placeholder:text-green-900/35 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

  return (
    <main className="bg-cream">
      <Navbar />

      <section className="relative min-h-screen overflow-hidden bg-green-950 pt-32 pb-20 texture-grain">
        <div className="pointer-events-none absolute -right-32 -top-24 h-112 w-md rounded-full bg-green-700/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 lg:grid-cols-12">
          {/* Brand panel */}
          <div className="lg:col-span-6">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-green-900/60 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold-400">
                Members Only
              </span>
            </div>

            <h1
              className="animate-fade-up mt-6 font-display text-5xl font-semibold leading-[1.05] text-cream sm:text-6xl"
              style={{ animationDelay: "0.1s" }}
            >
              Welcome back to <span className="italic text-gold-400">WPN</span>
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-md text-lg leading-relaxed text-cream/70"
              style={{ animationDelay: "0.2s" }}
            >
              Sign in to access your member dashboard, dues records, committee
              spaces, and General Assembly resources.
            </p>

            <div
              className="animate-fade-up mt-10 hidden gap-8 border-t border-cream/10 pt-7 sm:flex"
              style={{ animationDelay: "0.3s" }}
            >
              {[
                ["Dues", "Track payments"],
                ["Committees", "Workspaces"],
                ["AGM", "Notices & papers"],
              ].map(([t, s]) => (
                <div key={t}>
                  <div className="font-display text-sm font-semibold text-gold-400">
                    {t}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-cream/55">
                    {s}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form card */}
          <div
            className="animate-fade-up lg:col-span-6"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="rounded-3xl border border-cream/10 bg-cream p-8 shadow-2xl shadow-black/30 sm:p-10">
              <h2 className="font-display text-2xl font-semibold text-green-950">
                Member Sign In
              </h2>
              <p className="mt-1 text-sm text-green-900/60">
                Use the credentials linked to your Full Membership.
              </p>

              <div className="mt-7 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-green-900">
                    Email Address
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    className={field}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-sm font-medium text-green-900">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-green-700 hover:text-gold-600"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      className={`${field} pr-12`}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold uppercase tracking-wider text-green-900/60 hover:text-green-900"
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-green-900/80">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) =>
                      setForm({ ...form, remember: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-green-900/30 text-green-700 focus:ring-gold-500"
                  />
                  Keep me signed in on this device
                </label>

                {error && (
                  <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  onClick={submit}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-3.5 font-semibold text-green-950 shadow-lg shadow-gold-500/20 transition-all hover:-translate-y-0.5 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-950/30 border-t-green-950" />
                      Signing in…
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-green-900/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-cream px-3 text-xs uppercase tracking-wider text-green-900/50">
                      Or
                    </span>
                  </div>
                </div>

                <p className="text-center text-sm text-green-900/70">
                  Not yet a member?{" "}
                  <Link
                    href="/membership/apply"
                    className="font-semibold text-green-800 hover:text-gold-600"
                  >
                    Apply for membership
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-cream/45">
              Trouble signing in?{" "}
              <Link href="/contact" className="text-gold-400 hover:underline">
                Contact the General Secretary
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function Login() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
