"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

type ApproveResponse = {
  memberId: string;
  emailSent: boolean;
  emailError?: string;
  fallbackPaymentUrl?: string;
};

export function ReviewActions({ id }: { id: string }) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState<"approve" | "reject" | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [approved, setApproved] = useState<ApproveResponse | null>(null);

  const act = async (kind: "approve" | "reject") => {
    setSubmitting(kind);
    setError(null);
    try {
      if (kind === "approve") {
        const out = await api.patch<ApproveResponse>(
          `/applications/${id}/approve`,
          { notes }
        );
        // Don't router.refresh() here — it would unmount this component (the
        // app is no longer "pending") and wipe the result panel before the
        // admin can read it / copy the fallback payment link.
        setApproved(out);
      } else {
        await api.patch(`/applications/${id}/reject`, { notes });
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Action failed. Try again."
      );
    } finally {
      setSubmitting(null);
    }
  };

  if (approved) {
    if (approved.emailSent) {
      return (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="font-display text-xl font-semibold text-emerald-900">
            Approved &mdash; payment link emailed
          </h2>
          <p className="mt-2 text-sm text-emerald-900/80">
            The applicant will receive an email with a link to pay the
            membership fee. Their account will activate automatically after
            payment.
          </p>
          <Link
            href="/admin/applications"
            className="mt-4 inline-flex text-sm font-semibold text-emerald-800 hover:text-emerald-700"
          >
            &larr; Back to applications
          </Link>
        </div>
      );
    }
    return (
      <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-6">
        <h2 className="font-display text-xl font-semibold text-amber-900">
          Approved &mdash; but email failed
        </h2>
        <p className="mt-2 text-sm text-amber-900/80">
          {approved.emailError ??
            "We couldn't send the approval email. Copy the link below and share it with the applicant manually."}
        </p>
        {approved.fallbackPaymentUrl && (
          <div className="mt-4 flex items-stretch gap-2">
            <input
              readOnly
              value={approved.fallbackPaymentUrl}
              className="flex-1 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-mono text-amber-900"
              onFocus={(e) => e.currentTarget.select()}
            />
            <button
              onClick={() =>
                navigator.clipboard?.writeText(approved.fallbackPaymentUrl!)
              }
              className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Copy
            </button>
          </div>
        )}
        <Link
          href="/admin/applications"
          className="mt-4 inline-flex text-sm font-semibold text-amber-800 hover:text-amber-700"
        >
          &larr; Back to applications
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-display text-xl font-semibold">Review decision</h2>
      <p className="mt-1 text-sm text-slate-600">
        Add optional notes for the record, then approve or reject. Approval
        emails the applicant a link to pay the membership fee; their account
        activates automatically after payment.
      </p>
      <textarea
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
      />
      {error && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => act("approve")}
          disabled={submitting !== null}
          className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
        >
          {submitting === "approve" ? "Approving…" : "Approve"}
        </button>
        <button
          onClick={() => act("reject")}
          disabled={submitting !== null}
          className="rounded-lg border border-rose-300 bg-white px-5 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-60"
        >
          {submitting === "reject" ? "Rejecting…" : "Reject"}
        </button>
      </div>
    </div>
  );
}
