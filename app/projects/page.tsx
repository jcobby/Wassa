import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const focusAreas = [
  {
    title: "Education & Scholarship",
    body: "Supporting Wassa students and schools — mentorship, learning resources, and pathways from the classroom to the professions.",
  },
  {
    title: "Health & Wellbeing",
    body: "Community health outreach and initiatives that improve access to care across the Wassa traditional area.",
  },
  {
    title: "Agriculture & Livelihoods",
    body: "Practical support for farmers and agribusiness — the backbone of the local economy — toward sustainable livelihoods.",
  },
  {
    title: "Business & Investment",
    body: "Connecting Wassa entrepreneurs to expertise, networks, and opportunities that grow enterprise at home.",
  },
  {
    title: "Research & Policy",
    body: "Evidence-based research and advocacy for Wassa's fair share of national development resources.",
  },
  {
    title: "Youth & Women",
    body: "Leadership, skills, and mentorship for the next generation — including oversight of WASU and WAYA.",
  },
];

export default function Projects() {
  return (
    <main className="bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-green-950 pt-40 pb-20 texture-grain">
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-green-700/30 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            What We Do
          </div>
          <h1
            className="animate-fade-up mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight text-cream sm:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            Projects &amp; <span className="italic text-gold-400">Impact</span>
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-2xl text-lg text-cream/70"
            style={{ animationDelay: "0.2s" }}
          >
            WPN mobilises the expertise of Wassa professionals to deliver
            practical, lasting change across the Wassa traditional area — from
            education and health to agriculture, enterprise, and policy.
          </p>
        </div>
      </section>

      {/* FOCUS AREAS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              Where We Focus
            </span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold text-green-950 sm:text-4xl">
            The areas our work touches
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-green-900/70">
            Our projects are driven by the standing committees and shaped in
            partnership with traditional authorities and district assemblies.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 100}>
              <div className="group h-full overflow-hidden rounded-3xl border border-green-900/10 bg-white p-8 transition-all hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-xl hover:shadow-green-900/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-900 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-green-950">
                  <span className="font-display text-base font-semibold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-green-950">
                  {f.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-green-900/70">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="scroll-mt-28 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Project Gallery
              </span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-semibold text-green-950 sm:text-4xl">
              Moments from the work
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-green-900/20 bg-cream px-8 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-900 text-gold-400">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
                  <path
                    d="M21 16l-5-5-9 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-green-950">
                Photos coming soon
              </h3>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-green-900/65">
                As our projects roll out, photos and highlights from the
                community will be published here.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-green-800 to-green-950 px-8 py-14 text-center sm:px-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-500/20 blur-2xl" />
            <h2 className="font-display text-3xl font-semibold text-cream sm:text-4xl">
              Want to bring a project to your community?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/70">
              Whether you have expertise to offer or an initiative to propose,
              we would love to hear from you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/membership/apply"
                className="rounded-full bg-gold-500 px-8 py-3.5 font-semibold text-green-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
              >
                Become a Member
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
      </section>

      <Footer />
    </main>
  );
}
