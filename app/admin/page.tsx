import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";

type AppStats = { pending: number; approved: number; rejected: number };
type MemberStats = { active: number; suspended: number; total: number };
type MessageStats = { unread: number; total: number };
type DuesStats = { year: number; paid: number; arrears: number };

async function safe<T>(path: string, fallback: T): Promise<T> {
  try {
    return await adminFetch<T>(path);
  } catch {
    return fallback;
  }
}

export default async function AdminDashboard() {
  const year = new Date().getFullYear();
  const [apps, members, messages, dues] = await Promise.all([
    safe<AppStats>("/applications/stats", {
      pending: 0,
      approved: 0,
      rejected: 0,
    }),
    safe<MemberStats>("/members/stats", { active: 0, suspended: 0, total: 0 }),
    safe<MessageStats>("/messages/stats", { unread: 0, total: 0 }),
    safe<DuesStats>(`/dues/stats?year=${year}`, { year, paid: 0, arrears: 0 }),
  ]);

  const cards = [
    {
      label: "Pending Applications",
      value: apps.pending,
      href: "/admin/applications",
      cta: "Review applications",
      accent: apps.pending > 0,
    },
    {
      label: "Active Members",
      value: members.active,
      href: "/admin/members?status=active",
      cta: "View register",
    },
    {
      label: "Unread Messages",
      value: messages.unread,
      href: "/admin/messages",
      cta: "Read inbox",
      accent: messages.unread > 0,
    },
    {
      label: `Dues Arrears (${year})`,
      value: dues.arrears,
      href: `/admin/dues?year=${year}&view=arrears`,
      cta: "View arrears",
      accent: dues.arrears > 0,
    },
  ];

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        At-a-glance view of activity across the network.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`block rounded-2xl border bg-white p-6 transition-shadow hover:shadow-md ${
              c.accent ? "border-amber-300" : "border-slate-200"
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {c.label}
            </div>
            <div className="mt-3 font-display text-4xl font-semibold text-slate-900">
              {c.value}
            </div>
            <div className="mt-4 text-sm font-medium text-green-800">
              {c.cta} &rarr;
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Stat label="Approved" value={apps.approved} />
        <Stat label="Rejected" value={apps.rejected} />
        <Stat label="Suspended Members" value={members.suspended} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="mt-2 font-display text-2xl font-semibold text-slate-800">
        {value}
      </div>
    </div>
  );
}
