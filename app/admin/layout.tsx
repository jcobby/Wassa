import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { SignOutButton } from "./_components/SignOutButton";

const nav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Applications", href: "/admin/applications" },
  { label: "Members", href: "/admin/members" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Dues", href: "/admin/dues" },
  { label: "Payments", href: "/admin/payments" },
  { label: "Settings", href: "/admin/settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await requireAdmin("/admin");

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="hidden w-64 flex-none flex-col border-r border-slate-200 bg-white lg:flex">
        <Link href="/" className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-900 text-gold-400 font-display text-sm font-semibold">
            W
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold text-slate-900">WPN Admin</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Console</div>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-200 px-4 py-4">
          <div className="text-xs text-slate-500">Signed in as</div>
          <div className="mt-0.5 truncate text-sm font-medium text-slate-900">
            {me.fullName}
          </div>
          <div className="truncate text-xs text-slate-500">{me.email}</div>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 lg:hidden">
          <Link href="/admin" className="font-display text-sm font-semibold">
            WPN Admin
          </Link>
          <SignOutButton compact />
        </header>
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
