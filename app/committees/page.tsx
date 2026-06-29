import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getMe } from "@/lib/adminAuth";

const committees = [
  {
    name: "Advisory Services, Programmes & Community Development",
    body: "Identifies, scopes, and delivers advisory programmes and community projects across Wassa — from infrastructure to welfare initiatives — in partnership with traditional authorities and local government.",
  },
  {
    name: "Membership, Chapters & Welfare",
    body: "Oversees member recruitment, onboarding, and retention. Coordinates regional, district, and international chapters, and ensures the welfare of WPN members at home and in the diaspora.",
  },
  {
    name: "Finance & Audit",
    body: "Stewards WPN's funds, signatories, and financial reporting. Works with the independent auditor and reviews the annual budget before it reaches the General Assembly.",
  },
  {
    name: "Legal, Compliance, Advocacy & Governance",
    body: "Ensures WPN operates within the Companies Act, 2019 (Act 992) and applicable law. Advises on contracts and risk, and advocates for Wassa's fair share of national development resources.",
  },
  {
    name: "Communication & Media Relations",
    body: "Manages all internal and external communications, social media, publications, and media relations. Promotes the image of WPN and keeps the membership and public informed.",
  },
  {
    name: "Partnership & Funding",
    body: "Builds strategic partnerships with government, donors, and development organisations. Identifies and secures funding streams that advance WPN's objectives and community impact.",
  },
];

export default async function Committees() {
  const me = await getMe();
  if (!me) redirect("/login?next=/committees");

  return (
    <main className="bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-green-950 pt-40 pb-20 texture-grain">
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-green-700/30 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Where the work happens
          </div>
          <h1
            className="animate-fade-up mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight text-cream sm:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            Standing <span className="italic text-gold-400">Committees</span>
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-2xl text-lg text-cream/70"
            style={{ animationDelay: "0.2s" }}
          >
            Six standing committees carry WPN's mandate from boardroom to
            community. Each is chaired by a Full Member appointed by the
            Executive Council and reports quarterly.
          </p>
        </div>
      </section>

      {/* COMMITTEE GRID */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              The Six
            </span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold text-green-950 sm:text-4xl">
            Specialised teams, one shared mandate
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-green-900/70">
            Membership of committees is open to all Full Members and, where
            relevant to their expertise, to Associate Members. Each committee
            reports quarterly to the Executive Council and annually to the
            General Assembly.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {committees.map((c, i) => (
            <Reveal key={c.name} delay={(i % 3) * 100}>
              <div className="group h-full overflow-hidden rounded-3xl border border-green-900/10 bg-white p-8 transition-all hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-xl hover:shadow-green-900/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-900 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-green-950">
                  <span className="font-display text-base font-semibold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-green-950">
                  {c.name}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-green-900/70">
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AD HOC NOTE */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                How They Work
              </span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-semibold text-green-950">
              Standing &amp; ad hoc
            </h2>
            <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-green-900/75">
              <p>
                The General Assembly may establish additional standing
                committees or dissolve existing ones by simple majority
                resolution.
              </p>
              <p>
                The Executive Council may also constitute ad hoc committees for
                specific time-bound tasks; these dissolve automatically once
                their mandate is delivered.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-3xl bg-linear-to-br from-green-800 to-green-950 p-10 text-cream">
              <div className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                Get Involved
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold">
                Lend your expertise
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-cream/70">
                Every committee thrives on the depth of its members'
                experience. If you are a Full Member with relevant expertise,
                reach out to indicate your interest in serving.
              </p>
              <Link
                href="/contact"
                className="mt-7 inline-flex rounded-full bg-gold-500 px-7 py-3 text-sm font-semibold text-green-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
              >
                Express Interest
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
