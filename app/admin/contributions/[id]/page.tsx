import Link from "next/link";
import { notFound } from "next/navigation";
import { adminFetch } from "@/lib/adminAuth";
import {
  contributionReceipt,
  giftDesignation,
  type ContributionDetail,
} from "@/lib/transactions";
import { ReceiptCard } from "../../_components/ReceiptCard";
import { SaveAsPdf } from "@/components/SaveAsPdf";

export default async function ContributionReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let c: ContributionDetail;
  try {
    c = await adminFetch<ContributionDetail>(`/contributions/${id}`);
  } catch {
    notFound();
  }

  const receipt = contributionReceipt(c);

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/contributions"
        className="text-sm font-medium text-slate-500 hover:text-slate-900 print:hidden"
      >
        &larr; All contributions
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-display text-3xl font-semibold">
            Contribution details
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Everything about this gift in plain language. Save it as a PDF to
            send to the donor.
          </p>
        </div>
        <SaveAsPdf
          fileName={`WPN receipt - ${c.donorName} - ${c.reference}`}
          className="sm:text-right"
        />
      </div>

      <div className="mt-6 print:mt-0">
        <ReceiptCard receipt={receipt} />
      </div>

      {/* An "Other" gift's message is its purpose — already on the receipt. */}
      {c.message && giftDesignation(c) === c.cause && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 print:hidden">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Donor&apos;s message
          </div>
          <p className="mt-2 whitespace-pre-line text-sm italic text-slate-700">
            &ldquo;{c.message}&rdquo;
          </p>
        </div>
      )}

      {c.member && (
        <Link
          href={`/admin/members/${c.member.id}`}
          className="mt-6 inline-flex text-sm font-semibold text-green-800 hover:text-green-700 print:hidden"
        >
          View {c.member.fullName}&apos;s full statement &rarr;
        </Link>
      )}
    </div>
  );
}
