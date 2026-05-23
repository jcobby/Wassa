# Wassa Professionals Network (WPN)

A modern, beautifully designed website for the Wassa Professionals Network,
built with Next.js 16, TypeScript, and Tailwind CSS v4.

Inspired structurally by k-pn.org but fully redesigned with a refined
Green & Gold identity, custom typography, and smooth animations.

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Pages

- `/`         Homepage — hero, mission, focus areas, membership benefits, CTA
- `/about`    About WPN — Overview, History, Composition, Aims, Values, Mantra
- `/contact`  Contact — form, info cards, socials, map placeholder

## Project Structure

- `app/`              Routes (page.tsx per route) + layout + globals.css
- `app/fonts/`        Self-hosted Fraunces (display) + Outfit (body) fonts
- `components/`       Navbar, Footer, Reveal (scroll-animation helper)
- `lib/site.ts`       Central site data — all placeholders live here

## Editing Placeholders

Open `lib/site.ts` and replace anything marked `[PLACEHOLDER]`:
email, phone numbers, address, social links.

Other in-page placeholders to swap:
- Homepage: "Established [Year]", hero image card
- About page: Brief History section, branch cities
- Contact page: Google Map embed

## Design System

Colors are CSS variables in `app/globals.css` (--green-*, --gold-*, --cream).
Display font: Fraunces. Body font: Outfit. Both self-hosted, no network needed.

## Theme

Green & Gold — chosen for the Western Region identity.
