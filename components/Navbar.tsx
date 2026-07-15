"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nav, site } from "@/lib/site";
import { api } from "@/lib/api";

type Me = {
  id: string;
  email: string;
  role: "member" | "admin";
  fullName: string;
  status: string;
};

// Links only members should see — hidden from the nav when logged out. (The
// pages themselves still redirect; this just keeps the menu honest.)
const GATED_HREFS = new Set(["/executives", "/committees", "/dashboard/dues"]);
// Links only non-members should see — hidden once you're signed in (you can't
// apply again if you're already a member).
const GUEST_ONLY_HREFS = new Set(["/membership/apply"]);

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || full;
}

function initials(full: string): string {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close an open dropdown when clicking/tapping elsewhere. This is what lets
  // the menus work on touch devices (which have no hover).
  useEffect(() => {
    if (!openMenu) return;
    const close = () => setOpenMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenu]);

  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [confirmOut, setConfirmOut] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get<Me>("/auth/me")
      .then((m) => active && setMe(m))
      .catch(() => active && setMe(null));
    return () => {
      active = false;
    };
  }, []);

  const signOut = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Clear local state regardless of the network result.
    }
    setMe(null);
    setOpen(false);
    setConfirmOut(false);
    router.push("/");
    router.refresh();
  };

  const dashboardHref = me?.role === "admin" ? "/admin" : "/dashboard";

  // Show members-only links only when signed in, and guest-only links only when
  // signed out.
  const visibleNav = nav.map((item) =>
    item.children
      ? {
          ...item,
          children: item.children.filter((c) => {
            if (GATED_HREFS.has(c.href)) return !!me;
            if (GUEST_ONLY_HREFS.has(c.href)) return !me;
            return true;
          }),
        }
      : item
  );

  return (
    <>
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
          <Image
            src="/logo.jpeg"
            alt={site.name}
            width={44}
            height={44}
            className="rounded-full transition-transform group-hover:scale-105"
          />
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
          {visibleNav.map((item) => (
            <li key={item.label} className="group relative">
              {item.children ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(
                        openMenu === item.label ? null : item.label
                      );
                    }}
                    className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-cream/85 transition-colors hover:text-gold-400"
                  >
                    {item.label}
                    <svg
                      className={`h-3 w-3 transition-transform group-hover:rotate-180 ${
                        openMenu === item.label ? "rotate-180" : ""
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
                  <div
                    className={`absolute left-0 top-full pt-3 transition-all duration-200 group-hover:visible group-hover:opacity-100 ${
                      openMenu === item.label
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                    }`}
                  >
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

        <div className="hidden items-center gap-3 lg:flex">
          {me ? (
            <>
              <Link
                href={dashboardHref}
                title={`Signed in as ${me.fullName} — go to your dashboard`}
                className="group flex items-center gap-2.5 rounded-full border border-cream/15 bg-green-900/40 py-1.5 pl-1.5 pr-4 transition-colors hover:border-gold-400/40"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-green-950">
                  {initials(me.fullName)}
                </span>
                <span className="text-sm font-medium text-cream/90 transition-colors group-hover:text-gold-400">
                  {firstName(me.fullName)}
                </span>
              </Link>
              <button
                onClick={() => setConfirmOut(true)}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-cream/80 transition-colors hover:text-gold-400"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-green-950 shadow-lg shadow-gold-500/20 transition-all hover:bg-gold-400 hover:shadow-gold-400/30"
            >
              Member Login
            </Link>
          )}
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
          {visibleNav.map((item) => (
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
          <li className="space-y-2 pt-3">
            {me ? (
              <>
                <div className="flex items-center gap-3 px-1 pb-2">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-green-950">
                    {initials(me.fullName)}
                  </span>
                  <div className="min-w-0 leading-tight">
                    <div className="truncate text-sm font-semibold text-cream">
                      {me.fullName}
                    </div>
                    <div className="truncate text-xs text-cream/60">
                      {me.email}
                    </div>
                  </div>
                </div>
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-gold-500 px-6 py-3 text-center font-semibold text-green-950"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    setConfirmOut(true);
                  }}
                  className="block w-full rounded-full border border-cream/25 px-6 py-3 text-center font-semibold text-cream"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-gold-500 px-6 py-3 text-center font-semibold text-green-950"
              >
                Member Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>

      {confirmOut && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setConfirmOut(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-cream p-6 shadow-2xl shadow-black/40">
            <h2 className="font-display text-xl font-semibold text-green-950">
              Sign out?
            </h2>
            <p className="mt-2 text-sm text-green-900/70">
              You&apos;ll need to sign in again to access your member area.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmOut(false)}
                className="rounded-full border border-green-900/20 px-5 py-2.5 text-sm font-semibold text-green-900 transition-colors hover:bg-green-900/5"
              >
                Cancel
              </button>
              <button
                onClick={signOut}
                className="rounded-full bg-green-900 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-green-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
