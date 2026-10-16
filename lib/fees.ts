import { fees as fallback } from "./site";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Fee figures for public pages, already formatted ("GH₵100", "GH₵300").
export type FeeDisplay = {
  registration: string;
  dues: string;
  duesPerYear: string;
};

// "GH₵" for cedis, as the site has always written it; any other currency by
// its code.
function symbol(currency: string): string {
  return currency === "GHS" ? "GH₵" : `${currency} `;
}

// Whole amounts stay whole ("GH₵100"); anything with pesewas shows two places.
function show(currency: string, amount: number): string {
  const n = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `${symbol(currency)}${n}`;
}

const FALLBACK: FeeDisplay = {
  registration: `${fallback.currency}${fallback.registration}`,
  dues: `${fallback.currency}${fallback.dues}`,
  duesPerYear: `${fallback.currency}${fallback.duesPerYear}`,
};

// The amounts actually charged, from admin Settings, so a change there reaches
// every public page within a few minutes. If the API can't be reached, the
// figures in site.ts are shown instead.
export async function getFees(): Promise<FeeDisplay> {
  try {
    const res = await fetch(`${API}/settings/fees`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return FALLBACK;
    const data = (await res.json()) as {
      registration: { amount: number; currency: string };
      quarterlyDues: { amount: number; currency: string };
    };
    const { registration: reg, quarterlyDues: dues } = data;
    return {
      registration: show(reg.currency, reg.amount),
      dues: show(dues.currency, dues.amount),
      duesPerYear: show(dues.currency, Math.round(dues.amount * 4 * 100) / 100),
    };
  } catch {
    return FALLBACK;
  }
}
