import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMe } from "@/lib/adminAuth";
import { SignOutButton } from "../admin/_components/SignOutButton";

export default async function MemberDashboard() {
  const me = await getMe();
  if (!me) redirect("/login?next=/dashboard");

  return (
    <main className="bg-cream">
      <Navbar />
      <section className="relative overflow-hidden bg-green-950 pt-40 pb-20 texture-grain">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-green-700/30 blur-3xl" />
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Member Dashboard
          </div>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-cream sm:text-6xl">
            Welcome, <span className="italic text-gold-400">{firstName(me.fullName)}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-cream/70">
            Your member area is being built out. Soon you&rsquo;ll find your
            dues record, committee spaces, and AGM resources here.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-green-900/10 bg-white p-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              Your account
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-green-900/80">
              <div>
                <span className="text-green-900/55">Name:</span> {me.fullName}
              </div>
              <div>
                <span className="text-green-900/55">Email:</span> {me.email}
              </div>
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
              Quick links
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/committees"
                  className="font-medium text-green-800 hover:text-green-700"
                >
                  Standing committees &rarr;
                </Link>
              </li>
              <li>
                <Link
                  href="/executives"
                  className="font-medium text-green-800 hover:text-green-700"
                >
                  Executive Council &rarr;
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="font-medium text-green-800 hover:text-green-700"
                >
                  Contact the General Secretary &rarr;
                </Link>
              </li>
            </ul>
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
