import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";
import { formatDateTime, money } from "@/lib/format";
import {
  channelLabel,
  paymentDescription,
  type PaymentView,
} from "@/lib/transactions";
import { TxnStatusPill } from "../_components/ReceiptCard";

type PaymentRow = PaymentView & {
  member: {
    id: string;
    fullName: string;
    email: string;
    applicantId: string | null;
  } | null;
};

const TABS = [
  { key: "success", label: "Successful" },
  { key: "initialized", label: "In Progress" },
  { key: "failed", label: "Failed" },
  { key: "", label: "All" },
] as const;

async function loadPayments(
  status: string,
  search: string
): Promise<PaymentRow[]> {
  try {
    const q = new URLSearchParams();
    if (status) q.set("status", status);
    if (search) q.set("search", search);
    const qs = q.toString();
    return await adminFetch<PaymentRow[]>(`/payments${qs ? `?${qs}` : ""}`);
  } catch {
    return [];
  }
}

function tabHref(status: string, search: string): string {
  const q = new URLSearchParams();
  if (status) q.set("status", status);
  if (search) q.set("search", search);
  const qs = q.toString();
  return `/admin/payments${qs ? `?${qs}` : ""}`;
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const active = params.status ?? "success";
  const search = params.search?.trim() ?? "";
  const rows = await loadPayments(active, search);

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-3xl font-semibold">Payments</h1>
      <p className="mt-2 text-sm text-slate-600">
        Paystack transactions for membership activation and dues. Open any
        payment for a plain-language receipt you can share on WhatsApp.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          {TABS.map((t) => (
            <Link
              key={t.label}
              href={tabHref(t.key, search)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                active === t.key
                  ? "bg-green-900 text-cream"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <form action="/admin/payments" className="flex flex-1 gap-2 sm:max-w-sm">
          <input type="hidden" name="status" value={active} />
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Name, email, WPN ID or reference"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
          />
          <button
            type="submit"
            className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-cream hover:bg-green-800"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            {search
              ? `No payments match “${search}”.`
              : "No payments to show."}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Member</th>
                <th className="px-6 py-3 font-semibold">Paid for</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="align-top hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {r.member ? (
                      <>
                        <div>{r.member.fullName}</div>
                        <div className="text-xs text-slate-500">
                          {r.member.email}
                        </div>
                        {r.member.applicantId && (
                          <div className="font-mono text-[11px] text-slate-500">
                            {r.member.applicantId}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div>{paymentDescription(r)}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-slate-400">
                      {r.batchReference ?? r.reference}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                    <div>{money(r.currency, r.amount)}</div>
                    {channelLabel(r.channel) && (
                      <div className="text-xs text-slate-500">
                        {channelLabel(r.channel)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <TxnStatusPill status={r.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {formatDateTime(r.completedAt ?? r.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <Link
                      href={`/admin/payments/${r.id}`}
                      className="font-semibold text-green-800 hover:text-green-700"
                    >
                      Details &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
