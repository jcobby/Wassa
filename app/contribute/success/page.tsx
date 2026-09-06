import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

type FulfillResult = {
  status: "success" | "failed" | "pending";
  amount?: number;
  currency?: string;
  donorName?: string;
  donorEmail?: string;
  cause?: string;
  reference?: string;
  alreadyFulfilled?: boolean;
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function verify(
  reference: string
): Promise<{ ok: true; data: FulfillResult } | { ok: false; message: string }> {
  try {
    const res = await fetch(
      `${API}/contributions/verify/${encodeURIComponent(reference)}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      return {
        ok: false,
        message: body.error ?? `Verification failed (${res.status})`,
      };
    }
    return { ok: true, data: (await res.json()) as FulfillResult };
  } catch {
    return {
      ok: false,
      message: "Could not reach the server. Please refresh the page.",
    };
  }
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || full;
}

export default async function ContributionSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    reference?: string | string[];
    trxref?: string | string[];
  }>;
}) {
  const params = await searchParams;
  // Paystack appends both `reference` and `trxref` to the callback URL; either
  // may arrive duplicated, in which case Next hands us an array.
  const pickOne = (v: string | string[] | undefined): string | undefined =>
    Array.isArray(v) ? v[0] : v;
  const reference = pickOne(params.reference) ?? pickOne(params.trxref);

  if (!reference) {
    return (
      <Shell>
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-green-950">
            Missing payment reference
          </h1>
          <p className="mt-3 text-sm text-green-900/70">
            We couldn&apos;t find a reference for this contribution. If you have
            just given, check your email for the receipt.
          </p>
          <BackLink />
        </div>
      </Shell>
    );
  }

  const out = await verify(reference);

  if (!out.ok) {
    return (
      <Shell>
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-green-950">
            Verification failed
          </h1>
          <p className="mt-3 text-sm text-green-900/70">{out.message}</p>
          <BackLink />
        </div>
      </Shell>
    );
  }

  if (out.data.status === "pending") {
    return (
      <Shell>
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-green-950">
            Your contribution is still processing
          </h1>
          <p className="mt-3 text-sm text-green-900/70">
            This can take a moment with mobile money. Please refresh this page
            in about 30 seconds — your receipt will be emailed to you as soon as
            it clears.
          </p>
          <p className="mt-4 font-mono text-xs text-green-900/55">{reference}</p>
        </div>
      </Shell>
    );
  }

  if (out.data.status === "failed") {
    return (
      <Shell>
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-green-950">
            The payment didn&apos;t go through
          </h1>
          <p className="mt-3 text-sm text-green-900/70">
            Nothing was charged. You are welcome to try again — and thank you
            for wanting to give.
          </p>
          <BackLink label="Try again" />
        </div>
      </Shell>
    );
  }

  const money =
    out.data.amount !== undefined && out.data.currency
      ? `${out.data.currency} ${out.data.amount.toFixed(2)}`
      : null;

  return (
    <Shell>
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold text-green-950">
          Thank you
          {out.data.donorName ? (
            <>
              ,{" "}
              <span className="italic text-gold-600">
                {firstName(out.data.donorName)}
              </span>
            </>
          ) : null}
        </h1>
        <p className="mt-3 text-sm text-green-900/70">
          Your contribution has been received. It goes straight into the work of
          the Network.
        </p>
      </div>

      <div className="mt-8 rounded-2xl bg-green-950 px-6 py-6 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
          Amount received
        </div>
        <div className="mt-2 font-display text-3xl font-semibold text-cream">
          {money ?? "—"}
        </div>
        {out.data.cause && (
          <div className="mt-2 text-xs text-cream/60">
            Directed to {out.data.cause}
          </div>
        )}
        {out.data.reference && (
          <div className="mt-4 border-t border-cream/10 pt-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
              Receipt reference
            </div>
            <div className="mt-1 font-mono text-xs tracking-wide text-cream/80">
              {out.data.reference}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-green-900/10 bg-white p-6 text-center">
        <p className="text-sm text-green-900/70">
          A receipt has been emailed to{" "}
          <span className="font-semibold">
            {out.data.donorEmail ?? "your inbox"}
          </span>
          . Keep it — it carries the reference above.
        </p>
        {out.data.alreadyFulfilled && (
          <p className="mt-2 text-xs text-green-900/55">
            (This contribution was already confirmed earlier.)
          </p>
        )}
        <p className="mt-4 font-display text-lg italic text-gold-600">
          &ldquo;{site.mantra}&rdquo;
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex rounded-full bg-gold-500 px-8 py-3.5 font-semibold text-green-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
          >
            Back to Home
          </Link>
          <Link
            href="/projects"
            className="inline-flex rounded-full border border-green-900/20 px-8 py-3.5 font-semibold text-green-900 transition-colors hover:bg-green-900/5"
          >
            See Our Work
          </Link>
        </div>
      </div>
    </Shell>
  );
}

function BackLink({ label = "Back to Contribute" }: { label?: string }) {
  return (
    <Link
      href="/contribute"
      className="mt-6 inline-flex rounded-full bg-green-900 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-green-800"
    >
      {label}
    </Link>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-cream">
      <Navbar />
      <section className="relative min-h-screen overflow-hidden bg-green-950 pt-32 pb-20 texture-grain">
        <div className="pointer-events-none absolute -right-32 -top-24 h-112 w-md rounded-full bg-green-700/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-3xl border border-cream/10 bg-cream p-8 shadow-2xl shadow-black/20 sm:p-10">
            {children}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
