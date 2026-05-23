"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const sections = [
  {
    id: "overview",
    label: "Overview",
    title: "Who We Are",
    paras: [
      "The Wassa Professionals Network (WPN) is a non-partisan group made up of professionals who hail from the Wassa area of the Western Region of the Republic of Ghana. Members have come together to pool their diverse skills, expertise, knowledge, and experience across many fields to advance their shared interest in developing Wassa.",
      "WPN also aims to protect Wassa's cultural heritage and promote its rich traditions and history. The network recognises the need to contribute to the socio-economic welfare and sustainable development of Wassa and Wassas in Ghana and worldwide, and works to achieve this through impactful projects, initiatives, and activities.",
    ],
  },
  {
    id: "history",
    label: "Brief History",
    title: "Our Story So Far",
    paras: [
      "[PLACEHOLDER] WPN was formally launched on [date] at a grand ceremony in [location]. Distinguished personalities and delegations graced the occasion.",
      "[PLACEHOLDER] The launch brought together representatives from the Wassa Traditional Council, various township associations, interest groups, and notable dignitaries — marking the beginning of a united professional movement for Wassa.",
    ],
  },
  {
    id: "composition",
    label: "Composition",
    title: "A Vibrant Membership",
    paras: [
      "Although relatively young, the network has built an admirable reputation and aggregated a strong and vibrant membership. The accomplished and astute career professionals who form the network span diverse fields — including engineering, medicine, law, architecture, public and civil service, health, and entrepreneurship, among others.",
      "[PLACEHOLDER] The network has, or plans to establish, international branches in [cities], extending the reach of the Wassa professional community across the globe.",
    ],
  },
  {
    id: "aims",
    label: "Aims & Objectives",
    title: "What We Set Out To Do",
    list: [
      "Create a common network that brings together professionals of Wassa descent to exchange ideas, work together, develop each other, and build a sense of communal bonding.",
      "Promote and facilitate the good ambition of younger generations to access higher education and decent vocational skills, becoming responsible future leaders.",
      "Encourage Wassa professionals to create opportunities for other Wassas.",
      "Pursue charity projects that provide opportunity and hope for the less privileged and marginalised, helping them maximise their human potential.",
      "Work assiduously to protect our cultural heritage through activities that promote and sustain the rich Wassa history and traditions.",
    ],
  },
  {
    id: "values",
    label: "Core Values",
    title: "What We Believe In",
    list: [
      "Patriotism and stewardship.",
      "Helping Wassas establish themselves in their various endeavours.",
      "Supporting and protecting our members.",
      "Development and service to our communities.",
      "High ethical and professional standards in all endeavours.",
      "Being each other's keeper — supporting and protecting members in every legitimate way within our means.",
      "Integrity, fairness, brotherliness, and service in all that we do.",
    ],
  },
  {
    id: "mantra",
    label: "Our Mantra",
    title: "Our Rallying Call",
    mantra: true,
  },
];

export default function About() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <main className="bg-cream">
      <Navbar />

      {/* PAGE HERO */}
      <section className="relative overflow-hidden bg-green-950 pt-40 pb-20 texture-grain">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-green-700/30 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Who We Are
          </div>
          <h1
            className="animate-fade-up mt-4 max-w-2xl font-display text-5xl font-semibold leading-tight text-cream sm:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            About <span className="italic text-gold-400">WPN</span>
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-xl text-lg text-cream/70"
            style={{ animationDelay: "0.2s" }}
          >
            Understanding the purpose, history, and values behind the Wassa
            Professionals Network.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Sticky side nav */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <div className="text-xs font-semibold uppercase tracking-wider text-green-600">
                On This Page
              </div>
              <ul className="mt-4 space-y-1 border-l border-green-900/15">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`-ml-px block border-l-2 py-2 pl-4 text-sm transition-colors ${
                        active === s.id
                          ? "border-gold-500 font-semibold text-green-900"
                          : "border-transparent text-green-900/55 hover:text-green-900"
                      }`}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Sections */}
          <div className="space-y-20 lg:col-span-9">
            {sections.map((s) => (
              <article key={s.id} id={s.id} className="scroll-mt-28">
                <Reveal>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-10 bg-gold-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                      {s.label}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-green-950 sm:text-4xl">
                    {s.title}
                  </h2>

                  {s.paras && (
                    <div className="mt-5 space-y-4">
                      {s.paras.map((p, i) => (
                        <p
                          key={i}
                          className="text-[17px] leading-relaxed text-green-900/75"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  )}

                  {s.list && (
                    <ul className="mt-6 space-y-4">
                      {s.list.map((item, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-green-900 font-display text-sm font-semibold text-gold-400">
                            {i + 1}
                          </span>
                          <span className="text-[17px] leading-relaxed text-green-900/75">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.mantra && (
                    <div className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-green-800 to-green-950 p-10 sm:p-12">
                      <div className="font-display text-4xl text-gold-400/40">
                        &ldquo;
                      </div>
                      <p className="font-display text-2xl italic leading-relaxed text-cream sm:text-3xl">
                        Help a Wassa to Help Wassa
                      </p>
                      <p className="mt-5 text-[17px] leading-relaxed text-cream/70">
                        Our mantra is a rallying call to all Wassa professionals
                        — no matter where they find themselves — to be vessels
                        of good tidings that unburden the shoulders of their
                        kinsmen and countrymen.
                      </p>
                    </div>
                  )}
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
