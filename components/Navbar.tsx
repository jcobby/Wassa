"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-green-950/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 bg-gradient-to-br from-green-700 to-green-900 text-gold-400 transition-transform group-hover:scale-105">
            <span className="font-display text-lg font-semibold">W</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold text-cream">
              {site.short}
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-gold-400/80">
              Professionals Network
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <li key={item.label} className="group relative">
              {item.children ? (
                <>
                  <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-cream/85 transition-colors hover:text-gold-400">
                    {item.label}
                    <svg
                      className="h-3 w-3 transition-transform group-hover:rotate-180"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2.5 4.5L6 8l3.5-3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[210px] overflow-hidden rounded-2xl border border-gold-400/15 bg-green-900 shadow-xl shadow-black/40">
                      {item.children.map((c) => (
                        <Link
                          key={c.label}
                          href={c.href}
                          className="block px-5 py-3 text-sm text-cream/80 transition-colors hover:bg-green-800 hover:text-gold-400"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href!}
                  className="rounded-full px-4 py-2 text-sm font-medium text-cream/85 transition-colors hover:text-gold-400"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link
            href="/login"
            className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-green-950 shadow-lg shadow-gold-500/20 transition-all hover:bg-gold-400 hover:shadow-gold-400/30"
          >
            Member Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center text-cream lg:hidden"
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 bg-current transition-all ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-all ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-all ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden bg-green-950 transition-all duration-500 lg:hidden ${
          open ? "max-h-[80vh]" : "max-h-0"
        }`}
      >
        <ul className="space-y-1 px-6 pb-8 pt-2">
          {nav.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setMobileSub(mobileSub === item.label ? null : item.label)
                    }
                    className="flex w-full items-center justify-between py-3 text-left text-cream"
                  >
                    {item.label}
                    <svg
                      className={`h-4 w-4 transition-transform ${
                        mobileSub === item.label ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2.5 4.5L6 8l3.5-3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  {mobileSub === item.label && (
                    <div className="space-y-1 pb-2 pl-4">
                      {item.children.map((c) => (
                        <Link
                          key={c.label}
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-sm text-cream/70"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-cream"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
          <li className="pt-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-gold-500 px-6 py-3 text-center font-semibold text-green-950"
            >
              Member Login
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
