"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { ApprovalResult, type ApproveResponse } from "./ReviewActions";

type CorrectionResponse = {
  id: string;
  status: string;
  notified: boolean;
  notifyError?: string;
};

type Action = "approve" | "reject" | "reopen";

// Corrects a decision made in error. A rejection can be turned into an
// approval; an approval can be withdrawn while the applicant hasn't paid. Either
// can be sent back to the review queue. Every correction needs a reason, which
// is kept in the review history.
export function RectifyDecision({
  id,
  status,
  applicantName,
  linkedMember,
}: {
  id: string;
  status: "approved" | "rejected";
  applicantName: string;
  linkedMember: { id: string; status: string } | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [notify, setNotify] = useState(true);
  const [submitting, setSubmitting] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [approved, setApproved] = useState<ApproveResponse | null>(null);
  const [emailFailed, setEmailFailed] = useState<string | null>(null);

  const firstName = applicantName.trim().split(/\s+/)[0];
  const wasApproved = status === "approved";
  const hasPaid =
    wasApproved &&
    linkedMember !== null &&
    linkedMember.status !== "pending_payment";

  const act = async (action: Action) => {
    if (notes.trim().length < 3) {
      setError("Give a reason for the correction — it's kept on the record.");
      return;
    }
    if (
      wasApproved &&
      !window.confirm(
        action === "reject"
          ? `Withdraw ${firstName}'s approval and reject the application? Their payment link will stop working.`
          : `Withdraw ${firstName}'s approval and send the application back for review? Their payment link will stop working.`
      )
    ) {
      return;
    }
    setSubmitting(action);
    setError(null);
    try {
      if (action === "approve") {
        const out = await api.patch<ApproveResponse>(
          `/applications/${id}/approve`,
          { notes }
        );
        // As in ReviewActions: no refresh, so the result (and any fallback
        // payment link) stays on screen.
        setApproved(out);
        return;
      }
      const out = await api.patch<CorrectionResponse>(
        `/applications/${id}/${action}`,
        { notes, notifyApplicant: notify }
      );
      if (wasApproved && notify && !out.notified) {
        // Hold the page here — the admin needs to tell the applicant directly.
        setEmailFailed(out.notifyError ?? "We couldn't send the email.");
      } else {
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

  if (approved) return <ApprovalResult approved={approved} />;

  if (emailFailed !== null) {
    return (
      <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-6">
        <h2 className="font-display text-xl font-semibold text-amber-900">
          Decision corrected &mdash; but the email failed
        </h2>
        <p className="mt-2 text-sm text-amber-900/80">
          {emailFailed} {firstName} hasn&apos;t been told the approval was
          withdrawn. Their payment link no longer works, so let them know
          directly before they try to pay.
        </p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-4 rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
        >
          Continue
        </button>
      </div>
    );
  }

  if (hasPaid) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-xl font-semibold">
          Correct this decision
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {firstName} has already paid the membership fee and is now a member,
          so this approval can&apos;t be reversed here. If they were admitted in
          error, suspend them from their member page and arrange any refund
          with the Treasurer.
        </p>
        <Link
          href={`/admin/members/${linkedMember!.id}`}
          className="mt-4 inline-flex text-sm font-semibold text-green-800 hover:text-green-700"
        >
          Open member page &rarr;
        </Link>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="max-w-xl">
          <h2 className="font-display text-xl font-semibold">
            Was this decision a mistake?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {wasApproved
              ? `${firstName} hasn't paid yet, so the approval can still be withdrawn. Their payment link stops working straight away.`
              : `You can approve ${firstName} instead, or send the application back to the review queue.`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Correct decision
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-amber-300 bg-white p-6">
      <h2 className="font-display text-xl font-semibold">
        Correct this decision
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        {wasApproved
          ? "Withdrawing the approval deletes the unpaid member record it created, which cancels the payment link. Reject the application outright, or send it back to the queue for a fresh review."
          : "Approve the application instead — the applicant is emailed their membership ID and payment link as usual — or send it back to the queue for a fresh review."}
      </p>

      <label className="mt-4 mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        Reason for the correction
      </label>
      <textarea
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={
          wasApproved
            ? "e.g. Approved the wrong applicant by mistake"
            : "e.g. Rejected in error — references have since been confirmed"
        }
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
      />
      <p className="mt-1 text-xs text-slate-500">
        Required. Kept in the review history under your name &mdash; it
        isn&apos;t sent to the applicant.
      </p>

      {wasApproved && (
        <label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={notify}
            onChange={(e) => setNotify(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-green-800"
          />
          <span>
            Email {firstName} that the approval was withdrawn and not to pay.
            Recommended &mdash; they already have the approval email.
          </span>
        </label>
      )}

      {error && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {wasApproved ? (
          <button
            type="button"
            onClick={() => act("reject")}
            disabled={submitting !== null}
            className="rounded-lg bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:opacity-60"
          >
            {submitting === "reject" ? "Withdrawing…" : "Withdraw approval & reject"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => act("approve")}
            disabled={submitting !== null}
            className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
          >
            {submitting === "approve" ? "Approving…" : "Approve instead"}
          </button>
        )}
        <button
          type="button"
          onClick={() => act("reopen")}
          disabled={submitting !== null}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
        >
          {submitting === "reopen" ? "Returning…" : "Return to review queue"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          disabled={submitting !== null}
          className="px-2 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
