import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import { ContributeForm, type ContributeOptions } from "./ContributeForm";

export const metadata: Metadata = {
  title: "Contribute — Wassa Professionals Network",
  description:
    "Support the work of the Wassa Professionals Network with a voluntary contribution of any amount. Open to everyone — no membership required.",
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Sensible defaults so the page still renders (and still explains itself) if
// the API is briefly unreachable. Giving is only actually attempted through
// the API, which re-validates everything anyway.
const FALLBACK: ContributeOptions = {
  enabled: true,
  currency: "GHS",
  minAmount: 1,
  suggestedAmounts: [50, 100, 200, 500, 1000],
  causes: ["Where it's needed most"],
};

async function loadOptions(): Promise<ContributeOptions> {
  try {
    const res = await fetch(`${API}/contributions/options`, {
      cache: "no-store",
    });
    if (!res.ok) return FALLBACK;
    return (await res.json()) as ContributeOptions;
  } catch {
    return FALLBACK;
  }
}

const impact = [
  {
    title: "Education",
    body: "Scholarships, learning materials, and school infrastructure for Wassa children.",
  },
  {
    title: "Health & Wellbeing",
    body: "Outreach, screening, and support for clinics serving the traditional area.",
  },
  {
    title: "Youth & Mentorship",
    body: "Mentoring, skills training, and pathways into work for young people.",
  },
  {
    title: "Community Projects",
    body: "Water, sanitation, and development projects delivered with local partners.",
  },
];

export default async function ContributePage() {
  const options = await loadOptions();

  return (
    <main className="bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-green-950 pt-40 pb-20 texture-grain">
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-green-700/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Voluntary Contributions
          </div>
          <h1
            className="animate-fade-up mt-4 max-w-2xl font-display text-5xl font-semibold leading-tight text-cream sm:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            Give to see <span className="italic text-gold-400">Wassa rise</span>
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-xl text-lg text-cream/70"
            style={{ animationDelay: "0.2s" }}
          >
            Every contribution — of any size, from anyone — goes directly into
            the work of the Network. You do not need to be a member to give.
          </p>
          <p
            className="animate-fade-up mt-6 font-display text-xl italic text-gold-400"
            style={{ animationDelay: "0.3s" }}
          >
            &ldquo;{site.mantra}&rdquo;
          </p>
        </div>
      </section>

      {/* FORM + CONTEXT */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Reveal>
            <ContributeForm options={options} />
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col gap-6">
              <div className="rounded-3xl border border-green-900/10 bg-linear-to-br from-green-800 to-green-950 p-8 texture-grain">
                <h3 className="font-display text-xl font-semibold text-cream">
                  Where your gift goes
                </h3>
                <ul className="mt-5 space-y-4">
                  {impact.map((i) => (
                    <li key={i.title}>
                      <div className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                        {i.title}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-cream/70">
                        {i.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-green-900/10 bg-white p-8">
                <h3 className="font-display text-xl font-semibold text-green-950">
                  Ways to pay
                </h3>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-green-900/80">
                  {[
                    "MTN MoMo",
                    "Telecel Cash",
                    "AirtelTigo Money",
                    "Debit / Credit Card",
                    "Bank Transfer",
                  ].map((m) => (
                    <span
                      key={m}
                      className="rounded-full border border-green-900/15 bg-white px-3 py-1"
                    >
                      {m}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-green-900/65">
                  Prefer to give another way, or making a major gift? Email us at{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="font-medium text-green-800 underline decoration-gold-500 underline-offset-4"
                  >
                    {site.email}
                  </a>{" "}
                  and the Secretariat will arrange it with you.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
