import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";

type AppRow = {
  id: string;
  fullName: string;
  email: string;
  emailVerified?: boolean;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  occupation?: string;
  countryOfResidence?: string;
};

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "unconfirmed", label: "Unconfirmed" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
] as const;

async function loadApps(status: string): Promise<AppRow[]> {
  try {
    return await adminFetch<AppRow[]>(
      `/applications?status=${encodeURIComponent(status)}`
    );
  } catch {
    return [];
  }
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const active = (params.status as (typeof TABS)[number]["key"]) ?? "pending";
  const rows = await loadApps(active);

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-3xl font-semibold">Applications</h1>
      <p className="mt-2 text-sm text-slate-600">
        Review membership applications submitted via the public site.
      </p>

      <div className="mt-6 inline-flex rounded-lg border border-slate-200 bg-white p-1">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/applications?status=${t.key}`}
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
            No {active} applications.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Occupation</th>
                <th className="px-6 py-3 font-semibold">Country</th>
                <th className="px-6 py-3 font-semibold">Submitted</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {r.fullName}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>{r.email}</span>
                      {r.emailVerified ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                          Unverified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {r.occupation ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {r.countryOfResidence ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(r.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/applications/${r.id}`}
                      className="font-semibold text-green-800 hover:text-green-700"
                    >
                      Open &rarr;
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
