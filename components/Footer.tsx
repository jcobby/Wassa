import Link from "next/link";
import { site } from "@/lib/site";

const cols = [
  {
    title: "Who We Are",
    links: ["About WPN", "Executives", "Committees"],
  },
  {
    title: "What We Do",
    links: ["Projects", "Project Gallery", "Events Gallery"],
  },
  {
    title: "Membership",
    links: ["Requirements", "Dues Payment", "Member List"],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-green-950 text-cream/70">
      {/* top gold rule */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/40 bg-gradient-to-br from-green-700 to-green-900 text-gold-400">
              <span className="font-display text-xl font-semibold">W</span>
            </div>
            <div className="font-display text-lg font-semibold text-cream">
              {site.name}
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            A non-partisan network of professionals of Wassa descent, united to
            advance the development of Wassa and its people.
          </p>
          <p className="mt-5 font-display text-lg italic text-gold-400">
            &ldquo;{site.mantra}&rdquo;
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {site.socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="flex h-9 items-center rounded-full border border-cream/15 px-4 text-xs font-medium text-cream/70 transition-colors hover:border-gold-400 hover:text-gold-400"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-gold-400">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="text-sm transition-colors hover:text-gold-400"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact strip */}
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <span>{site.email}</span>
            {site.phones.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
          <span className="text-cream/50">
            {site.address.line1} · {site.address.line2}
          </span>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
