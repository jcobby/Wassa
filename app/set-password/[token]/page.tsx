"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api, ApiError } from "@/lib/api";

const field =
  "w-full rounded-xl border border-green-900/15 bg-white px-4 py-3 text-green-950 outline-none transition-colors placeholder:text-green-900/35 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

export default function SetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async () => {
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/set-password", { token, password });
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not set your password. The link may have expired."
      );
      setLoading(false);
    }
  };

  return (
    <main className="bg-cream">
      <Navbar />

      <section className="relative min-h-screen overflow-hidden bg-green-950 pt-32 pb-20 texture-grain">
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-green-700/35 blur-3xl" />

        <div className="mx-auto flex max-w-5xl items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-cream/10 bg-cream p-8 shadow-2xl shadow-black/30 sm:p-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                New Member
              </div>
              <h1 className="mt-3 font-display text-3xl font-semibold text-green-950">
                Set your password
              </h1>
              <p className="mt-2 text-sm text-green-900/65">
                Welcome to WPN. Choose a password to sign in to your member
                account.
              </p>

              {done ? (
                <div className="mt-8 rounded-2xl bg-emerald-50 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h2 className="mt-4 font-display text-lg font-semibold text-emerald-900">
                    Password set
                  </h2>
                  <p className="mt-1 text-sm text-emerald-800/80">
                    Redirecting you to sign in…
                  </p>
                </div>
              ) : (
                <div className="mt-7 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-green-900">
                      New Password
                    </label>
                    <input
                      type={show ? "text" : "password"}
                      autoComplete="new-password"
                      className={field}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-green-900">
                      Confirm Password
                    </label>
                    <input
                      type={show ? "text" : "password"}
                      autoComplete="new-password"
                      className={field}
                      placeholder="Repeat your password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 text-sm text-green-900/75">
                    <input
                      type="checkbox"
                      checked={show}
                      onChange={(e) => setShow(e.target.checked)}
                      className="h-4 w-4 rounded text-green-700 focus:ring-gold-500"
                    />
                    Show password
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
                        Setting password…
                      </>
                    ) : (
                      "Set Password"
                    )}
                  </button>

                  <p className="text-center text-xs text-green-900/55">
                    Already set?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-green-800 hover:text-gold-600"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
