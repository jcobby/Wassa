import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";

type PaymentRow = {
  id: string;
  member: { id: string; fullName: string; email: string } | null;
  reference: string;
  amount: number;
  currency: string;
  status: "initialized" | "success" | "failed" | "abandoned";
  purpose: "membership_initial" | "dues_renewal";
  year: number;
  createdAt: string;
  completedAt: string | null;
};

const TABS = [
  { key: "success", label: "Successful" },
  { key: "initialized", label: "In Progress" },
  { key: "failed", label: "Failed" },
  { key: "", label: "All" },
] as const;

async function loadPayments(status: string): Promise<PaymentRow[]> {
  try {
    const q = status ? `?status=${encodeURIComponent(status)}` : "";
    return await adminFetch<PaymentRow[]>(`/payments${q}`);
  } catch {
    return [];
  }
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const active = params.status ?? "success";
  const rows = await loadPayments(active);

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-3xl font-semibold">Payments</h1>
      <p className="mt-2 text-sm text-slate-600">
        Paystack transactions for membership activation and dues.
      </p>

      <div className="mt-6 inline-flex rounded-lg border border-slate-200 bg-white p-1">
        {TABS.map((t) => (
          <Link
            key={t.label}
            href={`/admin/payments${t.key ? `?status=${t.key}` : ""}`}
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

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No payments to show.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Member</th>
                <th className="px-6 py-3 font-semibold">Reference</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Purpose</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {r.member ? (
                      <>
                        <div>{r.member.fullName}</div>
                        <div className="text-xs text-slate-500">
                          {r.member.email}
                        </div>
                      </>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">
                    {r.reference}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {r.currency} {r.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {r.purpose === "membership_initial"
                      ? "Initial membership"
                      : `Dues renewal (${r.year})`}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(r.completedAt ?? r.createdAt).toLocaleString()}
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

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    success: "bg-emerald-100 text-emerald-800",
    initialized: "bg-amber-100 text-amber-800",
    failed: "bg-rose-100 text-rose-800",
    abandoned: "bg-slate-200 text-slate-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
        colors[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}
