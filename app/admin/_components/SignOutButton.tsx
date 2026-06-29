"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const out = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
    } catch {
      // even if it fails, push to login
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {compact ? (
        <button
          onClick={() => setConfirming(true)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          Sign out
        </button>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="mt-3 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Sign out
        </button>
      )}

      {confirming && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !loading && setConfirming(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl shadow-black/40">
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Sign out?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              You&apos;ll need to sign in again to access your account.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirming(false)}
                disabled={loading}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={out}
                disabled={loading}
                className="rounded-full bg-green-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800 disabled:opacity-50"
              >
                {loading ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
