"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  if (compact) {
    return (
      <button
        onClick={out}
        disabled={loading}
        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        {loading ? "…" : "Sign out"}
      </button>
    );
  }

  return (
    <button
      onClick={out}
      disabled={loading}
      className="mt-3 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
