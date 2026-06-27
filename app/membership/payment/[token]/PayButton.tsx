"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";

type InitializeResponse = {
  reference: string;
  authorizationUrl: string;
};

export function PayButton({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    setError(null);
    setLoading(true);
    try {
      const out = await api.post<InitializeResponse>("/payments/initialize", {
        accessToken: token,
      });
      // Hand off to Paystack hosted checkout. After payment, Paystack
      // redirects to the callback_url we passed (the success page).
      window.location.href = out.authorizationUrl;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not start payment. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="mt-7">
      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <button
        onClick={pay}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-4 text-base font-semibold text-green-950 shadow-lg shadow-gold-500/25 transition-all hover:-translate-y-0.5 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-950/30 border-t-green-950" />
            Opening Paystack…
          </>
        ) : (
          <>Pay Now</>
        )}
      </button>
    </div>
  );
}
