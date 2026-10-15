import Link from "next/link";
import { notFound } from "next/navigation";
import { adminFetch } from "@/lib/adminAuth";
import {
  paymentReceipt,
  receiptText,
  whatsappNumber,
  type PaymentDetail,
} from "@/lib/transactions";
import { ReceiptCard } from "../../_components/ReceiptCard";
import { ShareActions } from "../../_components/ShareActions";

export default async function PaymentReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let p: PaymentDetail;
  try {
    p = await adminFetch<PaymentDetail>(`/payments/${id}`);
  } catch {
    notFound();
  }

  const receipt = paymentReceipt(p);

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/payments"
        className="text-sm font-medium text-slate-500 hover:text-slate-900 print:hidden"
      >
        &larr; All payments
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold print:hidden">
        Transaction details
      </h1>
      <p className="mt-2 text-sm text-slate-600 print:hidden">
        Everything about this payment in plain language &mdash; share it with
        the member or print it as a receipt.
      </p>

      <div className="mt-6">
        <ReceiptCard receipt={receipt} />
      </div>

      <div className="mt-6">
        <ShareActions
          text={receiptText(receipt)}
          phone={
            p.member
              ? whatsappNumber(p.member.mobileNumbers, p.member.countryOfResidence)
              : null
          }
          recipientName={p.member?.fullName}
        />
      </div>

      {p.member && (
        <Link
          href={`/admin/members/${p.member.id}`}
          className="mt-6 inline-flex text-sm font-semibold text-green-800 hover:text-green-700 print:hidden"
        >
          View {p.member.fullName}&apos;s full statement &rarr;
        </Link>
      )}
    </div>
  );
}
