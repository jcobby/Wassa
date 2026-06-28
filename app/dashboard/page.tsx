import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMe } from "@/lib/adminAuth";
import { SignOutButton } from "../admin/_components/SignOutButton";
import { executives, committees } from "@/lib/wpn-data";

export default async function MemberDashboard() {
  const me = await getMe();
  if (!me) redirect("/login?next=/dashboard");

  return (
    <main className="bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-green-950 pt-40 pb-20 texture-grain">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-green-700/30 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Member Dashboard
          </div>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-cream sm:text-6xl">
            Welcome, <span className="italic text-gold-400">{firstName(me.fullName)}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-cream/70">
            Your member area — view the Executive Council, standing committees, and quick links below.
          </p>
        </div>
      </section>

      {/* ACCOUNT + QUICK LINKS */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-green-900/10 bg-white p-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              Your Account
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-green-900/80">
              <div><span className="text-green-900/55">Name:</span> {me.fullName}</div>
              <div><span className="text-green-900/55">Email:</span> {me.email}</div>
              <div>
                <span className="text-green-900/55">Status:</span>{" "}
                <span className="capitalize">{me.status}</span>
              </div>
            </div>
            <div className="mt-5">
              <SignOutButton />
            </div>
          </div>
          <div className="rounded-3xl border border-green-900/10 bg-white p-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              Quick Links
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/committees" className="font-medium text-green-800 hover:text-green-700">
                  Standing Committees &rarr;
                </Link>
              </li>
              <li>
                <Link href="/executives" className="font-medium text-green-800 hover:text-green-700">
                  Executive Council &rarr;
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-medium text-green-800 hover:text-green-700">
                  Contact the General Secretary &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* EXECUTIVE COUNCIL */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="h-px w-10 bg-gold-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">Leadership</span>
        </div>
        <h2 className="font-display text-3xl font-semibold text-green-950 mb-10">
          Executive Council
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {executives.map((e, i) => (
            <div
              key={e.name}
              className="rounded-3xl border border-green-900/10 bg-white p-6 hover:border-gold-400/40 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-900 text-gold-400 text-sm font-semibold font-display">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span className="rounded-full border border-green-900/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-900/50">
                  {e.role}
                </span>
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-green-950">
                {e.name}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-green-900/65">
                {e.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STANDING COMMITTEES */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-10 bg-gold-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">Organisation</span>
          </div>
          <h2 className="font-display text-3xl font-semibold text-green-950 mb-10">
            Standing Committees
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {committees.map((c, i) => (
              <div
                key={c.name}
                className="rounded-3xl border border-green-900/10 bg-cream p-6 hover:border-gold-400/40 hover:shadow-lg transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-900 text-gold-400 text-sm font-semibold font-display">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-green-950">
                  {c.name}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-green-900/65">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function firstName(full: string): string {
  return full.split(" ")[0];
}
