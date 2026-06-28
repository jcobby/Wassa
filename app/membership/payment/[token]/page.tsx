import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PayButton } from "./PayButton";

type Access = {
  memberId: string;
  fullName: string;
  email: string;
  status: "pending_payment" | "active" | "suspended" | "terminated";
  fee: { amount: number; currency: string } | null;
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function loadAccess(token: string): Promise<{
  ok: true;
  data: Access;
} | { ok: false; status: number; message: string }> {
  try {
    const res = await fetch(`${API}/payments/access/${encodeURIComponent(token)}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      return {
        ok: false,
        status: res.status,
        message: body.error ?? `Request failed (${res.status})`,
      };
    }
    return { ok: true, data: (await res.json()) as Access };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Could not reach the server. Please try again.",
    };
  }
}

export default async function PaymentLanding({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await loadAccess(token);

  if (!result.ok) {
    return (
      <Shell>
        <div className="rounded-3xl border border-cream/10 bg-cream p-8 text-center sm:p-10">
          <h1 className="font-display text-2xl font-semibold text-green-950">
            Link not valid
          </h1>
          <p className="mt-3 text-sm text-green-900/70">{result.message}</p>
          <p className="mt-4 text-sm text-green-900/55">
            Please contact the General Secretary for a new link.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-green-900 px-6 py-3 text-sm font-semibold text-cream hover:bg-green-800"
          >
            Contact WPN
          </Link>
        </div>
      </Shell>
    );
  }

  const { data } = result;

  if (data.status === "active") {
    return (
      <Shell>
        <div className="rounded-3xl border border-cream/10 bg-cream p-8 text-center sm:p-10">
          <h1 className="font-display text-2xl font-semibold text-green-950">
            Your membership is already active
          </h1>
          <p className="mt-3 text-sm text-green-900/70">
            You can sign in any time.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-green-950 hover:bg-gold-400"
          >
            Sign In
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="rounded-3xl border border-cream/10 bg-cream p-8 shadow-2xl shadow-black/20 sm:p-10">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
          Complete Your Membership
        </div>
        <h1 className="mt-3 font-display text-3xl font-semibold text-green-950">
          Welcome, <span className="italic text-green-800">{firstName(data.fullName)}</span>
        </h1>
        <p className="mt-2 text-sm text-green-900/70">
          Your application has been approved. Pay the annual membership fee to
          activate your account.
        </p>

        <div className="mt-6 rounded-2xl bg-white p-6">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-green-900/50">
                Membership Fee
              </div>
              <div className="mt-1 font-display text-3xl font-semibold text-green-950">
                {data.fee
                  ? `${data.fee.currency} ${data.fee.amount.toFixed(2)}`
                  : "—"}
              </div>
            </div>
            <div className="text-right text-xs text-green-900/55">
              <div>{data.email}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-green-900/10 bg-white/60 p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-green-900/55">
            Payment methods accepted
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-green-900/80">
            {[
              "MTN MoMo",
              "Vodafone Cash",
              "AirtelTigo Money",
              "Debit / Credit Card",
              "Bank Transfer",
            ].map((m) => (
              <span
                key={m}
                className="rounded-full border border-green-900/15 bg-white px-3 py-1"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        <PayButton token={token} />

        <p className="mt-6 text-xs text-green-900/55">
          You'll be taken to Paystack to complete payment securely. After
          payment, your login credentials will be shown here and emailed to{" "}
          {data.email}.
        </p>
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
        <div className="mx-auto flex max-w-2xl px-6">
          <div className="w-full">{children}</div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function firstName(full: string): string {
  return full.split(" ")[0];
}
