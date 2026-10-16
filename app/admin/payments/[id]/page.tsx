import Link from "next/link";
import { notFound } from "next/navigation";
import { adminFetch } from "@/lib/adminAuth";
import { paymentReceipt, type PaymentDetail } from "@/lib/transactions";
import { ReceiptCard } from "../../_components/ReceiptCard";
import { SaveAsPdf } from "../../_components/SaveAsPdf";

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
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-display text-3xl font-semibold">
            Transaction details
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Everything about this payment in plain language. Save it as a PDF
            to send to the member.
          </p>
        </div>
        <SaveAsPdf
          fileName={`WPN receipt - ${p.member?.fullName ?? "payment"} - ${
            p.batchReference ?? p.reference
          }`}
          className="sm:text-right"
        />
      </div>

      <div className="mt-6 print:mt-0">
        <ReceiptCard receipt={receipt} />
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
