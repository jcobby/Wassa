import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { fees } from "@/lib/site";

const categories = [
  {
    name: "Full Members",
    eligibility:
      "Wassa indigenes by birth or descent, and their spouses of any nationality, who satisfy the professional criteria.",
    rights: [
      "Attend and vote at General Assembly meetings",
      "Contest for elected office (subject to Article 9 eligibility)",
      "Access organisation resources and programmes",
      "Raise matters at General Assembly meetings",
    ],
    note:
      "Spousal restriction: spouses who are not Wassa indigenes by birth or descent are not eligible to contest for President, Vice President, or any position carrying a community representational mandate.",
  },
  {
    name: "Student & Youth Affiliates",
    eligibility:
      "Wassa indigenes enrolled in accredited tertiary or vocational programmes who are not yet professionally qualified.",
    rights: [
      "Participate in WPN events and programmes",
      "Access mentorship and youth development initiatives",
      "Engage through the Wassa Students Union (WASU) and Wassa Youth Association (WAYA)",
      "Invited to apply for Full Membership upon qualification",
    ],
    note: null,
  },
];

const professionalCriteria = [
  "Holds a recognised qualification from an accredited tertiary or vocational institution; or",
  "Is a registered practitioner with a recognised professional, trade, or regulatory body in Ghana or elsewhere; or",
  "Has demonstrated expertise through not less than five (5) years of sustained practice in a defined field.",
];

const qualifyingFields = [
  "Law",
  "Medicine",
  "Nursing",
  "Engineering",
  "Agriculture",
  "Education",
  "Finance",
  "Business",
  "Architecture",
  "Social Work",
  "Information Technology",
  "The Arts",
  "Public Administration",
];

const admissionSteps = [
  {
    title: "Submit Application",
    body: "Send a written application to the General Secretary, including evidence of professional qualification and of Wassa indigeneity (or spousal connection).",
  },
  {
    title: "Executive Council Review",
    body: "The Executive Council determines applications within thirty (30) days. Where the qualification is in doubt, the Council decides and an applicant may appeal to the General Assembly.",
  },
  {
    title: "Admission & Dues",
    body: "Successful applicants pay a one-time registration fee of GH₵100 to activate membership, then quarterly dues of GH₵300 (every 3 months) to remain in good standing.",
  },
];

const duties = [
  "Uphold and observe the Constitution and all lawful decisions of the organisation.",
  "Pay dues and levies as prescribed.",
  "Promote the objectives and good name of the organisation.",
  "Act with integrity and declare any conflict of interest promptly.",
];

export default function Membership() {
  return (
    <main className="bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-green-950 pt-40 pb-20 texture-grain">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-green-700/30 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Membership
          </div>
          <h1
            className="animate-fade-up mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight text-cream sm:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            Become part of the <span className="italic text-gold-400">Network</span>
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-2xl text-lg text-cream/70"
            style={{ animationDelay: "0.2s" }}
          >
            WPN does not discriminate on the basis of gender, age, religion,
            ethnicity within Wassa, disability, or political affiliation. We
            actively promote the participation of women and young professionals
            in all activities and in leadership.
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              Categories
            </span>
          </div>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-green-950 sm:text-4xl">
            Two pathways into the Network
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {categories.map((c, i) => (
            <Reveal key={c.name} delay={i * 120}>
              <div className="flex h-full flex-col rounded-3xl border border-green-900/10 bg-white p-8 transition-all hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-xl hover:shadow-green-900/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-900 text-gold-400">
                  <span className="font-display text-lg font-semibold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-green-950">
                  {c.name}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-green-900/70">
                  {c.eligibility}
                </p>

                <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-gold-600">
                  Rights & Participation
                </div>
                <ul className="mt-3 space-y-2.5">
                  {c.rights.map((r) => (
                    <li
                      key={r}
                      className="flex gap-3 text-[15px] leading-relaxed text-green-900/75"
                    >
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold-500" />
                      {r}
                    </li>
                  ))}
                </ul>

                {c.note && (
                  <div className="mt-6 rounded-xl border border-gold-400/30 bg-gold-500/10 px-4 py-3 text-sm leading-relaxed text-green-900/80">
                    <span className="font-semibold text-green-950">Note. </span>
                    {c.note}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHO IS A PROFESSIONAL */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-gold-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  Definition
                </span>
              </div>
              <h2 className="mt-3 font-display text-3xl font-semibold text-green-950 sm:text-4xl">
                Who counts as a professional?
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-green-900/75">
                For the purposes of WPN, a &ldquo;professional&rdquo; is a
                person who satisfies any one of the following criteria.
                Qualifying fields are broad and not limited to the list shown.
              </p>
            </Reveal>

            <div className="lg:col-span-7">
              <Reveal>
                <ul className="space-y-4">
                  {professionalCriteria.map((p, i) => (
                    <li
                      key={i}
                      className="flex gap-4 rounded-2xl border border-green-900/10 bg-cream p-5"
                    >
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-green-900 font-display text-sm font-semibold text-gold-400">
                        {String.fromCharCode(97 + i)}
                      </span>
                      <span className="text-[16px] leading-relaxed text-green-900/80">
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-6 rounded-2xl border border-green-900/10 bg-cream p-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                    Qualifying Fields
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {qualifyingFields.map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-green-900/15 bg-white px-3 py-1.5 text-sm text-green-900/80"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO APPLY */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              Admission
            </span>
          </div>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-green-950 sm:text-4xl">
            How to apply
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {admissionSteps.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div className="h-full rounded-3xl border border-green-900/10 bg-white p-8">
                <div className="font-display text-4xl font-semibold text-gold-500/60">
                  0{i + 1}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-green-950">
                  {s.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-green-900/70">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEES & DUES */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Fees &amp; Dues
              </span>
            </div>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-green-950 sm:text-4xl">
              What membership costs
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-green-900/70">
              Every member pays a one-time registration fee on admission, then
              quarterly dues thereafter to stay in good standing.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl border border-green-900/10 bg-white p-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  One-time
                </div>
                <h3 className="mt-2 font-display text-2xl font-semibold text-green-950">
                  Registration fee
                </h3>
                <div className="mt-4 font-display text-4xl font-semibold text-green-950">
                  {fees.currency}
                  {fees.registration}
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-green-900/70">
                  Paid once, after your application is approved, to activate your
                  membership.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="h-full rounded-3xl border-2 border-gold-400/40 bg-white p-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  Recurring
                </div>
                <h3 className="mt-2 font-display text-2xl font-semibold text-green-950">
                  Quarterly dues
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-semibold text-green-950">
                    {fees.currency}
                    {fees.dues}
                  </span>
                  <span className="text-sm text-green-900/60">every 3 months</span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-green-900/70">
                  {fees.currency}
                  {fees.dues} per quarter (4&times; a year &mdash; {fees.currency}
                  {fees.duesPerYear} annually), keeping your voting and
                  office-holding rights active.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DUTIES & GOOD STANDING */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Member Duties
              </span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-semibold text-green-950">
              What we ask of every member
            </h2>
            <ul className="mt-6 space-y-4">
              {duties.map((d, i) => (
                <li key={i} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-green-900 font-display text-sm font-semibold text-gold-400">
                    {i + 1}
                  </span>
                  <span className="text-[16px] leading-relaxed text-green-900/80">
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Good Standing
              </span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-semibold text-green-950">
              Staying in good standing
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-green-900/80">
              <p>
                A Full Member is in good standing if they have paid all
                membership dues within sixty (60) days of the due date, have
                not been suspended, and have not resigned.
              </p>
              <p>
                Where dues remain unpaid ninety (90) days after the due date, a
                written notice is issued. If dues are still unpaid thirty (30)
                days later, voting and office-holding rights are suspended
                until arrears are settled. The Executive Council may grant a
                deferral in cases of genuine hardship.
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
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-500/20 blur-2xl" />
              <h2 className="font-display text-3xl font-semibold text-cream sm:text-4xl">
                Ready to <span className="italic text-gold-400">join us?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-cream/70">
                Submit your application to the General Secretary, or get in
                touch if you have questions about eligibility or the process.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/membership/apply"
                  className="rounded-full bg-gold-500 px-8 py-3.5 font-semibold text-green-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
                >
                  Start an Application
                </Link>
                <Link
                  href="/about"
                  className="rounded-full border border-cream/25 px-8 py-3.5 font-semibold text-cream transition-colors hover:border-gold-400 hover:text-gold-400"
                >
                  Learn About WPN
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
