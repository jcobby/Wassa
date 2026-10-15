import Link from "next/link";
import { notFound } from "next/navigation";
import { adminFetch } from "@/lib/adminAuth";
import {
  contributionReceipt,
  receiptText,
  whatsappNumber,
  type ContributionDetail,
} from "@/lib/transactions";
import { ReceiptCard } from "../../_components/ReceiptCard";
import { ShareActions } from "../../_components/ShareActions";

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
  // A member's profile number is the better bet; non-members gave one at checkout.
  const phone = c.member
    ? whatsappNumber(c.member.mobileNumbers, c.member.countryOfResidence)
    : whatsappNumber(c.donorPhone);

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/contributions"
        className="text-sm font-medium text-slate-500 hover:text-slate-900 print:hidden"
      >
        &larr; All contributions
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold print:hidden">
        Contribution details
      </h1>
      <p className="mt-2 text-sm text-slate-600 print:hidden">
        Everything about this gift in plain language &mdash; share it with the
        donor or print it as a receipt.
      </p>

      <div className="mt-6">
        <ReceiptCard receipt={receipt} />
      </div>

      {c.message && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 print:hidden">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Donor&apos;s message
          </div>
          <p className="mt-2 whitespace-pre-line text-sm italic text-slate-700">
            &ldquo;{c.message}&rdquo;
          </p>
        </div>
      )}

      <div className="mt-6">
        <ShareActions
          text={receiptText(receipt)}
          phone={phone}
          recipientName={c.donorName}
          title="Share with the donor"
        />
      </div>

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
