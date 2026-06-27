import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CredentialBox } from "./CredentialBox";

type FulfillResult = {
  status: "success" | "failed" | "pending";
  memberId?: string;
  email?: string;
  generatedPassword?: string;
  alreadyFulfilled?: boolean;
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function verify(
  reference: string
): Promise<{ ok: true; data: FulfillResult } | { ok: false; message: string }> {
  try {
    const res = await fetch(
      `${API}/payments/verify/${encodeURIComponent(reference)}`,
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

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    reference?: string | string[];
    trxref?: string | string[];
  }>;
}) {
  const params = await searchParams;
  // Paystack appends `reference` and `trxref` to the callback URL. If either
  // is duplicated for any reason, Next gives us an array — take the first.
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
            We couldn't find a payment reference. If you've just paid, please
            check your email for your credentials.
          </p>
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
        </div>
      </Shell>
    );
  }

  if (out.data.status === "pending") {
    return (
      <Shell>
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-green-950">
            Payment is still being processed
          </h1>
          <p className="mt-3 text-sm text-green-900/70">
            This can take a moment. Please refresh in 30 seconds.
          </p>
        </div>
      </Shell>
    );
  }

  if (out.data.status === "failed") {
    return (
      <Shell>
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-green-950">
            Payment didn't go through
          </h1>
          <p className="mt-3 text-sm text-green-900/70">
            Nothing was charged. You can return to the payment link in your
            approval email and try again.
          </p>
        </div>
      </Shell>
    );
  }

  // success
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
          Welcome to <span className="italic text-gold-600">WPN</span>
        </h1>
        <p className="mt-3 text-sm text-green-900/70">
          Payment received. Your member account is now active.
        </p>
      </div>

      {out.data.generatedPassword && out.data.email ? (
        <CredentialBox
          email={out.data.email}
          password={out.data.generatedPassword}
        />
      ) : (
        <div className="mt-8 rounded-2xl border border-green-900/10 bg-white p-6 text-center">
          <p className="text-sm text-green-900/70">
            We've emailed your login credentials to{" "}
            <span className="font-semibold">{out.data.email ?? "your inbox"}</span>.
          </p>
          {out.data.alreadyFulfilled && (
            <p className="mt-2 text-xs text-green-900/55">
              (This payment was already processed earlier.)
            </p>
          )}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex rounded-full bg-gold-500 px-8 py-3.5 font-semibold text-green-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
        >
          Sign In Now
        </Link>
      </div>
    </Shell>
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
