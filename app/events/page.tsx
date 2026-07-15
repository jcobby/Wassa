import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

function EmptyState({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-green-900/20 bg-cream px-8 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-900 text-gold-400">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-green-950">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-green-900/65">
        {body}
      </p>
    </div>
  );
}

export default function Events() {
  return (
    <main className="bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-green-950 pt-40 pb-20 texture-grain">
        <div className="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-green-700/30 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Stay Updated
          </div>
          <h1
            className="animate-fade-up mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight text-cream sm:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            News &amp; <span className="italic text-gold-400">Events</span>
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-2xl text-lg text-cream/70"
            style={{ animationDelay: "0.2s" }}
          >
            Announcements, updates, and highlights from the Network — at home
            and across the diaspora.
          </p>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="scroll-mt-28 mx-auto max-w-7xl px-6 py-20">
        <Reveal className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              Latest News
            </span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold text-green-950 sm:text-4xl">
            Updates from WPN
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <EmptyState
            title="No news yet"
            body="Announcements and updates from the Network will be posted here. In the meantime, follow us on social media to stay in the loop."
            icon={
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 8h11v9H4zM15 11h3l2 2v4h-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle cx="7.5" cy="17.5" r="1.5" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17.5" cy="17.5" r="1.5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            }
          />
        </Reveal>

        {site.socials.some((s) => s.href !== "#") && (
          <Reveal delay={180}>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              {site.socials
                .filter((s) => s.href !== "#")
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="rounded-full border border-green-900/15 px-5 py-2 text-sm font-medium text-green-900 transition-colors hover:border-gold-500 hover:bg-green-900 hover:text-gold-400"
                  >
                    {s.label}
                  </a>
                ))}
            </div>
          </Reveal>
        )}
      </section>

      {/* EVENTS GALLERY */}
      <section id="gallery" className="scroll-mt-28 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Events Gallery
              </span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-semibold text-green-950 sm:text-4xl">
              Moments from our gatherings
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <EmptyState
              title="Photos coming soon"
              body="Photos from meetings, launches, and community events will appear here as they happen."
              icon={
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
              }
            />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-green-800 to-green-950 px-8 py-14 text-center sm:px-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-500/20 blur-2xl" />
            <h2 className="font-display text-3xl font-semibold text-cream sm:text-4xl">
              Don&apos;t miss what&apos;s next
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/70">
              Become a member to receive event invitations and Network updates
              directly.
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
