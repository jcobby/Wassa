"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import { api, ApiError } from "@/lib/api";

const info = [
  {
    label: "Postal Address",
    lines: [site.address.line1],
  },
  {
    label: "Office Location",
    lines: [site.address.line2],
  },
  {
    label: "Email Us",
    lines: [site.email],
  },
  {
    label: "Call Us",
    lines: site.phones,
  },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    message: "",
  });

  const handleSubmit = async () => {
    setError(null);
    if (!form.first || !form.email || !form.message) {
      setError("Please fill in your first name, email, and message.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/contact", {
        firstName: form.first.trim(),
        lastName: form.last.trim(),
        email: form.email.trim().toLowerCase(),
        message: form.message.trim(),
      });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "We couldn't send your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "w-full rounded-xl border border-green-900/15 bg-white px-4 py-3 text-green-950 outline-none transition-colors placeholder:text-green-900/35 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

  return (
    <main className="bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-green-950 pt-40 pb-20 texture-grain">
        <div className="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-green-700/30 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Get In Touch
          </div>
          <h1
            className="animate-fade-up mt-4 max-w-2xl font-display text-5xl font-semibold leading-tight text-cream sm:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            Contact <span className="italic text-gold-400">Us</span>
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-xl text-lg text-cream/70"
            style={{ animationDelay: "0.2s" }}
          >
            Questions, partnership ideas, or interest in membership? We would
            love to hear from you.
          </p>
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {info.map((c, i) => (
            <Reveal key={c.label} delay={i * 90}>
              <div className="h-full rounded-2xl border border-green-900/10 bg-white p-6 transition-all hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-lg hover:shadow-green-900/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-900 text-gold-400">
                  <span className="font-display text-sm font-semibold">
                    0{i + 1}
                  </span>
                </div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold-600">
                  {c.label}
                </div>
                {c.lines.map((l) => (
                  <p
                    key={l}
                    className="mt-1 text-[15px] leading-relaxed text-green-900/75"
                  >
                    {l}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <Reveal>
            <div className="rounded-3xl border border-green-900/10 bg-white p-8 sm:p-10">
              <h2 className="font-display text-3xl font-semibold text-green-950">
                Send us a message
              </h2>
              <p className="mt-2 text-sm text-green-900/60">
                Fill in the form and a member of the team will respond shortly.
              </p>

              {sent ? (
                <div className="mt-8 rounded-2xl bg-green-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-700 text-cream">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-green-950">
                    Message sent
                  </h3>
                  <p className="mt-1 text-sm text-green-900/65">
                    Thank you for reaching out. We&apos;ll be in touch soon.
                  </p>
                </div>
              ) : (
                <div className="mt-7 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-green-900">
                        First Name *
                      </label>
                      <input
                        className={field}
                        placeholder="First name"
                        value={form.first}
                        onChange={(e) =>
                          setForm({ ...form, first: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-green-900">
                        Last Name
                      </label>
                      <input
                        className={field}
                        placeholder="Last name"
                        value={form.last}
                        onChange={(e) =>
                          setForm({ ...form, last: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-green-900">
                      Email *
                    </label>
                    <input
                      type="email"
                      className={field}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-green-900">
                      Comment or Message *
                    </label>
                    <textarea
                      rows={5}
                      className={`${field} resize-none`}
                      placeholder="How can we help?"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                    />
                  </div>
                  {error && (
                    <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-3.5 font-semibold text-green-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-950/30 border-t-green-950" />
                        Sending…
                      </>
                    ) : (
                      "Submit Message"
                    )}
                  </button>
                </div>
              )}
            </div>
          </Reveal>

          {/* Map + socials */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col gap-8">
              <div className="flex flex-1 items-center justify-center rounded-3xl border border-green-900/10 bg-linear-to-br from-green-800 to-green-950 p-10 text-center texture-grain">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/40 text-gold-400">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <circle
                        cx="12"
                        cy="10"
                        r="2.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </div>
                  <p className="mt-4 font-display text-xl text-cream">
                    Find Us in Wassa
                  </p>
                  <p className="mt-1 text-sm text-cream/55">
                    [ Embed Google Map here ]
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-green-900/10 bg-white p-8">
                <h3 className="font-display text-xl font-semibold text-green-950">
                  Connect with us
                </h3>
                <p className="mt-1 text-sm text-green-900/60">
                  Follow WPN across social media.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {site.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="rounded-full border border-green-900/15 px-5 py-2 text-sm font-medium text-green-900 transition-colors hover:border-gold-500 hover:bg-green-900 hover:text-gold-400"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
