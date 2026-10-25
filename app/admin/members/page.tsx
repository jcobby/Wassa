import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";
import { RemindAwaitingPayment } from "./RemindAwaitingPayment";
import { RemindDuesButton } from "./RemindDuesButton";

type MemberRow = {
  id: string;
  applicantId?: string | null;
  fullName: string;
  email: string;
  role: "member" | "admin";
  status: "active" | "suspended" | "terminated" | "pending_payment";
  joinedAt: string;
  occupation?: string;
  countryOfResidence?: string;
  duesReminderSentAt?: string | null;
};

// Overdue quarters this year per active member, by the same rule as the Dues
// page. Members missing from the map (not active, or the lookup failed) show
// no dues figure and no reminder button.
async function loadOwed(): Promise<Map<string, number>> {
  try {
    const o = await adminFetch<{ rows: { memberId: string; owed: number }[] }>(
      "/dues"
    );
    return new Map(o.rows.map((r) => [r.memberId, r.owed]));
  } catch {
    return new Map();
  }
}

async function loadAwaitingCount(): Promise<number> {
  try {
    const s = await adminFetch<{ pendingPayment?: number }>("/members/stats");
    return s.pendingPayment ?? 0;
  } catch {
    return 0;
  }
}

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
  { key: "pending_payment", label: "Awaiting payment" },
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
  const awaiting = status === "pending_payment";
  // Only active members owe dues, so other tabs skip the lookup.
  const showDues = status === "" || status === "active";
  const [rows, awaitingCount, owed] = await Promise.all([
    loadMembers(search, status),
    awaiting ? loadAwaitingCount() : Promise.resolve(0),
    showDues ? loadOwed() : Promise.resolve(new Map<string, number>()),
  ]);

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-3xl font-semibold">Members</h1>
      <p className="mt-2 text-sm text-slate-600">
        The WPN register. Search by name or email, filter by status.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-1">
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

        <form className="flex w-full gap-2 sm:w-auto" action="/admin/members">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by name or email"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20 sm:w-72 sm:flex-none"
          />
          {status && <input type="hidden" name="status" value={status} />}
          <button
            type="submit"
            className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-cream hover:bg-green-800"
          >
            Search
          </button>
        </form>
      </div>

      {awaiting && <RemindAwaitingPayment count={awaitingCount} />}

      {/* Scrolls sideways on narrow screens instead of cutting columns off. */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No members found.
          </div>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Member</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                {/* The record is created at approval, so for someone who
                    hasn't paid this date is when they were approved. */}
                <th className="px-5 py-3 font-semibold">
                  {awaiting ? "Approved" : "Joined"}
                </th>
                {showDues && (
                  <th className="px-5 py-3 font-semibold">
                    Dues {new Date().getFullYear()}
                  </th>
                )}
                <th className="px-5 py-3">
                  <span className="sr-only">Open</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => {
                const quartersOwed = owed.get(r.id);
                return (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/members/${r.id}`}
                          className="font-medium text-slate-900 hover:text-green-800"
                        >
                          {r.fullName}
                        </Link>
                        {r.role === "admin" && (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-slate-500">{r.email}</div>
                      {r.applicantId && (
                        <div className="mt-1 font-mono text-[11px] font-semibold tracking-wider text-green-700">
                          {r.applicantId}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(r.joinedAt)}
                    </td>
                    {showDues && (
                      <td className="px-5 py-4">
                        {quartersOwed === undefined ? (
                          <span className="text-slate-400">—</span>
                        ) : quartersOwed > 0 ? (
                          <div className="flex flex-col items-start gap-2">
                            <span className="whitespace-nowrap font-semibold text-amber-800">
                              {quartersOwed} {quartersOwed === 1 ? "quarter" : "quarters"} owed
                            </span>
                            <RemindDuesButton
                              id={r.id}
                              name={r.fullName}
                              lastSentAt={r.duesReminderSentAt}
                              align="left"
                            />
                          </div>
                        ) : (
                          <span className="whitespace-nowrap text-emerald-700">
                            Up to date
                          </span>
                        )}
                      </td>
                    )}
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <Link
                        href={`/admin/members/${r.id}`}
                        className="font-semibold text-green-800 hover:text-green-700"
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// "23 Oct 2026" — no day/month mix-ups.
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800",
    suspended: "bg-amber-100 text-amber-800",
    terminated: "bg-slate-200 text-slate-700",
    pending_payment: "bg-blue-100 text-blue-800",
  };
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
        colors[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {status === "pending_payment" ? "awaiting payment" : status}
    </span>
  );
}
