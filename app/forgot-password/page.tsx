"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api, ApiError } from "@/lib/api";

const field =
  "w-full rounded-xl border border-green-900/15 bg-white px-4 py-3 text-green-950 outline-none transition-colors placeholder:text-green-900/35 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  // Already signed in? No need to reset — send them to their area.
  useEffect(() => {
    api
      .get<{ role: "member" | "admin" }>("/auth/me")
      .then((m) => router.replace(m.role === "admin" ? "/admin" : "/dashboard"))
      .catch(() => {
        // Not signed in — stay on the page.
      });
  }, [router]);

  const submit = async () => {
    setError(null);
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again."
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
                Member Account
              </div>
              <h1 className="mt-3 font-display text-3xl font-semibold text-green-950">
                Forgot your password?
              </h1>

              {sent ? (
                <div className="mt-7 rounded-2xl bg-emerald-50 p-6">
                  <h2 className="font-display text-lg font-semibold text-emerald-900">
                    Check your email
                  </h2>
                  <p className="mt-2 text-sm text-emerald-800/80">
                    If an active WPN account uses{" "}
                    <span className="font-semibold">{email.trim()}</span>,
                    we&apos;ve sent a link to reset your password. It expires in
                    2 hours. Check your spam folder if it doesn&apos;t arrive
                    shortly.
                  </p>
                  <Link
                    href="/login"
                    className="mt-5 inline-flex rounded-full bg-gold-500 px-7 py-3 text-sm font-semibold text-green-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
                  >
                    Back to Sign In
                  </Link>
                </div>
              ) : (
                <>
                  <p className="mt-2 text-sm text-green-900/65">
                    Enter the email linked to your membership and we&apos;ll send
                    you a link to choose a new password.
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submit();
                        }}
                      />
                    </div>

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
                          Sending…
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>

                    <p className="text-center text-xs text-green-900/55">
                      Remembered it?{" "}
                      <Link
                        href="/login"
                        className="font-semibold text-green-800 hover:text-gold-600"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
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
