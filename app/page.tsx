import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const benefits = [
  {
    title: "Employment & Scholarships",
    body: "Members gain access to opportunities sourced from an extensively networked community spanning every professional discipline.",
  },
  {
    title: "Meet Prominent Business Leaders",
    body: "Through our networking initiatives, members meet, connect with, and learn from Wassa's savviest business minds.",
  },
  {
    title: "Discounts on Products & Services",
    body: "Active membership entitles you to discounts at selected outlets and services partnered with the Network.",
  },
  {
    title: "Assistance from a Wassa Native",
    body: "No member navigates alone. A diverse collection of experts stands ready to lend a hand when the need arises.",
  },
  {
    title: "Conferences, Dinners & Programs",
    body: "Attend conferences and events that equip executives with knowledge while serving as excellent networking grounds.",
  },
  {
    title: "Be Honoured",
    body: "WPN celebrates exceptional accomplishments at the leadership, financial, and social levels. Our members' wins are ours.",
  },
];

const focus = [
  {
    tag: "WPN Gives Back",
    title: "Community Impact Projects",
    body: "Charity initiatives that bring opportunity and hope to the less privileged across Wassa.",
  },
  {
    tag: "Yenko Wassa",
    title: "Heritage & Homecoming",
    body: "Celebrating and protecting the rich traditions, history, and culture of the Wassa people.",
  },
  {
    tag: "WPN Inspires",
    title: "Mentorship & Education",
    body: "Guiding younger generations toward higher education, vocational skill, and responsible leadership.",
  },
];

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="relative flex min-h-screen items-center bg-green-950 texture-grain">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-green-700/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-80 w-80 rounded-full bg-gold-600/15 blur-3xl" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pt-32 pb-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-green-900/60 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold-400">
                Non-Partisan &middot; Professional &middot; United
              </span>
            </div>

            <h1
              className="animate-fade-up mt-6 font-display text-5xl font-semibold leading-[1.05] text-cream sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "0.1s" }}
            >
              Help a Wassa
              <br />
              to <span className="italic text-gold-400">Help Wassa</span>
            </h1>

            <p
              className="animate-fade-up mt-7 max-w-xl text-lg leading-relaxed text-cream/75"
              style={{ animationDelay: "0.2s" }}
            >
              The Wassa Professionals Network unites accomplished professionals
              of Wassa descent to pool their skills, expertise, and experience
              for the lasting development of Wassa and its people.
            </p>

            <div
              className="animate-fade-up mt-9 flex flex-wrap gap-4"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                href="#"
                className="rounded-full bg-gold-500 px-8 py-3.5 font-semibold text-green-950 shadow-xl shadow-gold-500/25 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
              >
                Join the Network
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-cream/25 px-8 py-3.5 font-semibold text-cream transition-all hover:border-gold-400 hover:text-gold-400"
              >
                Learn About WPN
              </Link>
            </div>

            <div
              className="animate-fade-up mt-12 flex gap-10 border-t border-cream/10 pt-7"
              style={{ animationDelay: "0.4s" }}
            >
              {[
                ["4+", "Global Branches"],
                ["12+", "Professional Fields"],
                ["100%", "Community Driven"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-3xl font-semibold text-gold-400">
                    {n}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-cream/55">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-in lg:col-span-5" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-green-800 via-green-900 to-green-950 shadow-2xl">
                <div className="flex h-full flex-col items-center justify-center p-10 text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold-400/50 bg-green-900">
                    <span className="font-display text-4xl font-semibold text-gold-400">
                      W
                    </span>
                  </div>
                  <p className="mt-6 font-display text-2xl italic text-cream">
                    One Wassa.
                  </p>
                  <p className="font-display text-2xl italic text-gold-400">
                    One Network.
                  </p>
                  <p className="mt-4 text-sm text-cream/50">
                    [ Replace with hero image ]
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-gold-400/20 bg-cream px-6 py-4 shadow-xl">
                <div className="text-xs uppercase tracking-wider text-green-600">
                  Established
                </div>
                <div className="font-display text-2xl font-semibold text-green-900">
                  [ Year ]
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="relative bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-green-600">
              Our Purpose
            </span>
            <h2 className="mt-4 font-display text-4xl font-semibold text-green-950 sm:text-5xl">
              A network built on shared roots and shared{" "}
              <span className="italic text-gold-600">ambition</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-green-900/70">
              WPN exists to create a common ground where professionals of Wassa
              descent exchange ideas, develop one another, protect our cultural
              heritage, and create opportunities for the next generation.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {focus.map((f, i) => (
              <Reveal key={f.tag} delay={i * 120}>
                <div className="group h-full overflow-hidden rounded-3xl border border-green-900/10 bg-white p-8 transition-all hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-xl hover:shadow-green-900/5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-900 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-green-950">
                    <span className="font-display text-lg font-semibold">
                      {i + 1}
                    </span>
                  </div>
                  <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-gold-600">
                    {f.tag}
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold text-green-950">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-green-900/65">
                    {f.body}
                  </p>
                  <div className="mt-6 text-sm font-semibold text-green-700">
                    View more &rarr;
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="relative overflow-hidden bg-green-950 py-24 texture-grain">
        <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-green-700/30 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              Membership
            </span>
            <h2 className="mt-4 font-display text-4xl font-semibold text-cream sm:text-5xl">
              Benefits of being an active member
            </h2>
            <p className="mt-5 text-lg text-cream/65">
              Active membership opens doors &mdash; to people, opportunities, and a
              community that genuinely has your back.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={(i % 3) * 100}>
                <div className="group h-full bg-green-950 p-8 transition-colors hover:bg-green-900">
                  <div className="font-display text-3xl text-gold-400/40 transition-colors group-hover:text-gold-400">
                    0{i + 1}
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-cream">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/60">
                    {b.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-800 to-green-950 px-8 py-16 text-center sm:px-16">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-500/20 blur-2xl" />
              <h2 className="font-display text-3xl font-semibold text-cream sm:text-4xl">
                Ready to help a Wassa,{" "}
                <span className="italic text-gold-400">help Wassa?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-cream/70">
                Become part of a growing network of professionals committed to
                lifting one another and the communities we come from.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="#"
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
        </div>
      </section>

      <Footer />
    </main>
  );
}
