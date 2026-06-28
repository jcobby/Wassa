import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";

type MemberRow = {
  id: string;
  fullName: string;
  email: string;
  role: "member" | "admin";
  status: "active" | "suspended" | "terminated";
  joinedAt: string;
  occupation?: string;
  countryOfResidence?: string;
};

async function loadMembers(search: string, status: string): Promise<MemberRow[]> {
  try {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (status) q.set("status", status);
    return await adminFetch<MemberRow[]>(`/members?${q.toString()}`);
  } catch {
    return [];
  }
}

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
  { key: "terminated", label: "Terminated" },
] as const;

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const status = params.status ?? "";
  const rows = await loadMembers(search, status);

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-3xl font-semibold">Members</h1>
      <p className="mt-2 text-sm text-slate-600">
        The WPN register. Search by name or email, filter by status.
      </p>

      <form className="mt-6 flex flex-wrap gap-2" action="/admin/members">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by name or email"
          className="flex-1 min-w-[220px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
        />
        {status && <input type="hidden" name="status" value={status} />}
        <button
          type="submit"
          className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-cream hover:bg-green-800"
        >
          Search
        </button>
      </form>

      <div className="mt-4 inline-flex rounded-lg border border-slate-200 bg-white p-1">
        {STATUS_TABS.map((t) => {
          const q = new URLSearchParams();
          if (search) q.set("search", search);
          if (t.key) q.set("status", t.key);
          const isActive = status === t.key;
          return (
            <Link
              key={t.label}
              href={`/admin/members${q.toString() ? `?${q}` : ""}`}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-green-900 text-cream"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No members found.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Joined</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {r.fullName}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{r.email}</td>
                  <td className="px-6 py-4 text-slate-600 capitalize">
                    {r.role}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(r.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/members/${r.id}`}
                      className="font-semibold text-green-800 hover:text-green-700"
                    >
                      View &rarr;
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

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800",
    suspended: "bg-amber-100 text-amber-800",
    terminated: "bg-slate-200 text-slate-700",
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
