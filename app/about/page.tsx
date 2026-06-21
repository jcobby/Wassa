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
      "The Wassa Professionals Network (WPN) is a non-partisan, non-profit professional body uniting professionals and indigenes of Wassa — at home in Ghana and across the diaspora — around a shared commitment to the flourishing of our communities. WPN is registered as a company limited by guarantee under the Companies Act, 2019 (Act 992) of the Republic of Ghana.",
      "The Wassa traditional area is rich in natural endowments — gold, timber, water resources, and agricultural land — and has contributed immensely to Ghana's national wealth. Yet access to quality education, healthcare, infrastructure, and effective local governance remains uneven. WPN exists to turn the expertise of Wassa professionals into service, working in partnership with traditional authorities, local and national government, and other partners, to see Wassa rise.",
    ],
  },
  {
    id: "vision",
    label: "Vision & Mission",
    title: "Vision & Mission",
    paras: [
      "VISION — To be the foremost professional network driving sustainable, inclusive, and dignified development across the Wassa traditional area and its diaspora communities.",
      "MISSION — To mobilise, connect, and deploy the expertise of Wassa professionals to deliver technical guidance, advocate for equitable allocation of natural resources from Wassaland, and catalyse lasting socio-economic transformation in Wassa.",
    ],
  },
  {
    id: "composition",
    label: "Membership",
    title: "A Vibrant Membership",
    paras: [
      "WPN brings together accomplished career professionals spanning law, medicine, nursing, engineering, agriculture, education, finance, business, architecture, social work, information technology, the arts, and public administration — among other recognised fields.",
      "Full Membership is open to Wassa indigenes by birth or descent (and their spouses) who meet the professional criteria set out in the Constitution. Student & Youth Affiliate status is open to Wassa indigenes enrolled in accredited tertiary or vocational programmes, with a pathway into Full Membership upon qualification. WPN may establish regional, district, and international chapters wherever Wassa professionals reside in sufficient numbers.",
    ],
  },
  {
    id: "aims",
    label: "Objectives",
    title: "What We Set Out To Do",
    list: [
      "Provide professional advice and technical support to traditional authorities, district assemblies, and community leaders across the Wassa area.",
      "Promote sustainable development in the economic, financial, educational, health, and agricultural sectors across Wassa.",
      "Foster leadership development, mentorship, and the empowerment of Wassa youth and women.",
      "Advocate for Wassa's fair share of national development resources and engage with government and stakeholders on policy matters affecting the area.",
      "Promote unity, solidarity, and professional networking among Wassa professionals at home and abroad.",
      "Support sustainable and equitable management of Wassa's natural and human resources.",
      "Undertake and commission research, and engage in evidence-based policy advocacy for the benefit of Wassa communities.",
      "Create opportunities for partnerships, investment, and community projects for the benefit of Wassa communities.",
    ],
  },
  {
    id: "values",
    label: "Core Values",
    title: "What We Believe In",
    list: [
      "Integrity, professionalism, and respect for fellow members and Wassa communities.",
      "Strict non-partisanship — no organisation resource or platform is used to promote any political party or candidate.",
      "Equality and inclusion — no discrimination on the basis of gender, age, religion, ethnicity within Wassa, disability, or political affiliation.",
      "Active promotion of women and young professionals in all activities and in leadership.",
      "Transparency and accountability in the stewardship of funds and resources.",
      "Respect for the cultural authority of our chiefs, elders, and traditional institutions.",
      "Being each other's keeper — supporting and protecting members in every legitimate way within our means.",
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
                    <div className="mt-6 overflow-hidden rounded-3xl bg-linear-to-br from-green-800 to-green-950 p-10 sm:p-12">
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
