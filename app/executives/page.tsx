import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const officers = [
  {
    role: "President",
    summary:
      "Head of the organisation. Provides strategic leadership, presides over all meetings, represents WPN at official functions, signs official documents, and serves as principal spokesperson.",
  },
  {
    role: "Vice President",
    summary:
      "Acts as President in their absence. Holds a defined portfolio assigned by the Executive Council — at minimum overseeing development programmes and committee coordination — and leads at least one standing committee.",
  },
  {
    role: "General Secretary",
    summary:
      "Responsible for all administration. Keeps and circulates minutes, handles official correspondence, maintains the membership register, gives notice of meetings, and oversees safe storage of WPN records.",
  },
  {
    role: "Assistant General Secretary",
    summary:
      "Supports and deputises for the General Secretary, taking responsibility for specific administrative portfolios as assigned by the Executive Council.",
  },
  {
    role: "Treasurer",
    summary:
      "Oversees financial management. Co-signatory on all WPN accounts, ensures proper custody of funds, and presents quarterly financial reports to the Executive Council and at each AGM.",
  },
  {
    role: "Financial Secretary",
    summary:
      "Collects and records all dues, levies, and income. Issues receipts, reconciles records with the Treasurer monthly, and reports arrears to the Executive Council.",
  },
  {
    role: "Organising Secretary",
    summary:
      "Coordinates and plans all WPN meetings, events, and programmes. Oversees logistics and mobilisation and maintains the organisation's activity calendar.",
  },
  {
    role: "Public Relations Officer",
    summary:
      "Manages all external and internal communications. Oversees social media and publications, handles media relations, and promotes the image of WPN.",
  },
  {
    role: "Women's Affairs Officer",
    summary:
      "Champions the interests and participation of women members. Coordinates programmes for economic empowerment and professional development of women in Wassa, and advises the Council on gender mainstreaming.",
  },
  {
    role: "Youth Affairs Officer",
    summary:
      "Champions the interests of young members and Student Affiliates. Coordinates mentorship, scholarship, and youth development programmes, and liaises with WASU and WAYA.",
  },
  {
    role: "Chapter Representatives (×2)",
    summary:
      "Two representatives elected by chapter delegates to bring the voice of regional, district, and international chapters into the Executive Council.",
  },
];

export default function Executives() {
  return (
    <main className="bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-green-950 pt-40 pb-20 texture-grain">
        <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-green-700/30 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Leadership
          </div>
          <h1
            className="animate-fade-up mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight text-cream sm:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            The <span className="italic text-gold-400">Executive Council</span>
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-2xl text-lg text-cream/70"
            style={{ animationDelay: "0.2s" }}
          >
            The Executive Council manages the affairs of WPN between General
            Assembly meetings and is collectively accountable to the
            membership.
          </p>
        </div>
      </section>

      {/* TERM STATS */}
      <section className="mx-auto max-w-7xl px-6 -mt-12">
        <Reveal>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-green-900/10 bg-green-900/10 sm:grid-cols-4">
            {[
              ["4", "Year Term"],
              ["2", "Term Limit"],
              ["11", "Council Positions"],
              ["≥2", "Women Officers"],
            ].map(([n, l]) => (
              <div
                key={l}
                className="bg-white px-6 py-7 text-center sm:text-left"
              >
                <div className="font-display text-3xl font-semibold text-green-950">
                  {n}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-green-900/55">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* OFFICERS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              The Officers
            </span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold text-green-950 sm:text-4xl">
            Roles & responsibilities
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-green-900/70">
            All officers take the Oath of Office, administered by the President
            of the Traditional Advisory Council, before assuming duties.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {officers.map((o, i) => (
            <Reveal key={o.role} delay={(i % 3) * 100}>
              <div className="group h-full rounded-3xl border border-green-900/10 bg-white p-7 transition-all hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-xl hover:shadow-green-900/5">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-900 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-green-950">
                    <span className="font-display text-sm font-semibold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-green-900/40">
                    Vacant
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-green-950">
                  {o.role}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-green-900/70">
                  {o.summary}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* GOVERNANCE NOTE */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Accountability
              </span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-semibold text-green-950">
              Bound by the General Assembly
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-green-900/75">
              The General Assembly is the supreme decision-making body of WPN.
              The Executive Council reports to each AGM, operates within the
              reserved powers of the Assembly, and meets at minimum once every
              three months.
            </p>
            <p className="mt-4 text-[17px] leading-relaxed text-green-900/75">
              Officers may be removed for gross misconduct, breach of the
              Constitution, prolonged inability to perform duties, or a vote of
              no confidence carried by two-thirds of Full Members at a General
              Assembly convened for that purpose.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-3xl bg-linear-to-br from-green-800 to-green-950 p-10 text-cream">
              <div className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                Oath of Office
              </div>
              <p className="mt-5 font-display text-2xl italic leading-relaxed text-cream/90">
                &ldquo;I will act at all times in the best interests of Wassa
                and its people, and not in my own personal interest…&rdquo;
              </p>
              <p className="mt-5 text-sm leading-relaxed text-cream/65">
                Drawn from Schedule 1 of the WPN Constitution, taken by every
                elected officer before assuming duties.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-green-800 to-green-950 px-8 py-16 text-center sm:px-16">
              <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-gold-500/20 blur-2xl" />
              <h2 className="font-display text-3xl font-semibold text-cream sm:text-4xl">
                Interested in serving?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-cream/70">
                Full Members of twelve months&rsquo; standing may contest for
                elected office. Get in touch to learn more about the nomination
                cycle and eligibility.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/membership"
                  className="rounded-full bg-gold-500 px-8 py-3.5 font-semibold text-green-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
                >
                  View Membership
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-cream/25 px-8 py-3.5 font-semibold text-cream transition-colors hover:border-gold-400 hover:text-gold-400"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
