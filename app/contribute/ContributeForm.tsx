"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";

export type ContributeOptions = {
  enabled: boolean;
  currency: string;
  minAmount: number;
  suggestedAmounts: number[];
  causes: string[];
};

type InitializeResponse = {
  reference: string;
  authorizationUrl: string;
};

// GHS → GH₵ and so on, falling back to the plain code for anything exotic.
function symbolFor(currency: string): string {
  const map: Record<string, string> = {
    GHS: "GH₵",
    USD: "$",
    GBP: "£",
    EUR: "€",
    NGN: "₦",
  };
  return map[currency] ?? currency;
}

function formatAmount(value: number): string {
  return value.toLocaleString("en-GB", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

// Always offered last, whatever causes Settings lists. Choosing it asks the
// donor to say what the gift is for.
const OTHER = "Other";

export function ContributeForm({ options }: { options: ContributeOptions }) {
  const symbol = symbolFor(options.currency);
  const causes = options.causes.length
    ? [...options.causes.filter((c) => c.trim().toLowerCase() !== "other"), OTHER]
    : [];

  // `custom` is what the donor typed; `preset` is the chip they tapped. Only
  // one is ever active — tapping a chip clears the box and vice versa.
  const [preset, setPreset] = useState<number | null>(
    options.suggestedAmounts[1] ?? options.suggestedAmounts[0] ?? null
  );
  const [custom, setCustom] = useState("");
  const [cause, setCause] = useState(causes[0] ?? "");
  const isOther = cause === OTHER;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = custom.trim() ? Number(custom) : preset;
  const amountValid =
    amount !== null && Number.isFinite(amount) && amount >= options.minAmount;

  const field =
    "w-full rounded-xl border border-green-900/15 bg-white px-4 py-3 text-green-950 outline-none transition-colors placeholder:text-green-900/35 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

  const submit = async () => {
    setError(null);

    if (!amountValid) {
      setError(
        `Enter an amount of ${symbol} ${formatAmount(options.minAmount)} or more.`
      );
      return;
    }
    if (form.name.trim().length < 2) {
      setError("Please tell us your name so we can send you a receipt.");
      return;
    }
    if (!form.email.trim()) {
      setError("Please enter an email address for your receipt.");
      return;
    }
    if (isOther && form.message.trim().length < 3) {
      setError("Please tell us what you'd like your gift to go towards.");
      return;
    }

    setSubmitting(true);
    try {
      const out = await api.post<InitializeResponse>(
        "/contributions/initialize",
        {
          donorName: form.name.trim(),
          donorEmail: form.email.trim().toLowerCase(),
          donorPhone: form.phone.trim(),
          amount: Number(amount),
          cause,
          // Only sent with "Other" — text typed before switching to a listed
          // cause is hidden, so it isn't sent either.
          message: isOther ? form.message.trim() : "",
          anonymous,
        }
      );
      // Hand off to Paystack's hosted checkout — MoMo, card, and bank transfer
      // all live there. It redirects back to /contribute/success when done.
      window.location.href = out.authorizationUrl;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "We couldn't start your contribution. Please try again."
      );
      setSubmitting(false);
    }
  };

  if (!options.enabled) {
    return (
      <div className="rounded-3xl border border-green-900/10 bg-white p-8 text-center sm:p-10">
        <h2 className="font-display text-2xl font-semibold text-green-950">
          Online giving is paused
        </h2>
        <p className="mt-3 text-sm text-green-900/70">
          We aren&apos;t accepting contributions through the site at the moment.
          Please contact the Secretariat if you would like to give.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-green-900/10 bg-white p-8 sm:p-10">
      <h2 className="font-display text-3xl font-semibold text-green-950">
        Make a contribution
      </h2>
      <p className="mt-2 text-sm text-green-900/60">
        Give any amount you wish — one gift, no membership required.
      </p>

      {/* AMOUNT */}
      <div className="mt-8">
        <label className="mb-2 block text-sm font-medium text-green-900">
          Choose an amount
        </label>
        {options.suggestedAmounts.length > 0 && (
          <div className="flex flex-wrap gap-2.5">
            {options.suggestedAmounts.map((a) => {
              const active = !custom.trim() && preset === a;
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    setPreset(a);
                    setCustom("");
                  }}
                  className={`rounded-xl border px-5 py-3 text-sm font-semibold transition-all ${
                    active
                      ? "border-gold-500 bg-gold-500 text-green-950 shadow-md shadow-gold-500/25"
                      : "border-green-900/15 bg-white text-green-900 hover:border-gold-400 hover:bg-gold-400/5"
                  }`}
                >
                  {symbol} {formatAmount(a)}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-green-900">
            Or enter your own amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-semibold text-green-900/50">
              {symbol}
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={options.minAmount}
              step="0.01"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Any amount"
              className={`${field} pl-14`}
            />
          </div>
          <p className="mt-1.5 text-xs text-green-900/55">
            Minimum {symbol} {formatAmount(options.minAmount)}. There is no
            maximum — give what you are able.
          </p>
        </div>
      </div>

      {/* CAUSE */}
      {causes.length > 0 && (
        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium text-green-900">
            Direct my gift to
          </label>
          <select
            value={cause}
            onChange={(e) => setCause(e.target.value)}
            className={field}
          >
            {causes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {isOther && (
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-green-900">
                What should your gift go towards? *
              </label>
              <textarea
                rows={3}
                maxLength={1000}
                autoFocus
                className={`${field} resize-none`}
                placeholder="Tell us what you'd like your gift to support, or who it honours."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
          )}
        </div>
      )}

      {/* DONOR */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-green-900">
            Full Name *
          </label>
          <input
            className={field}
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-green-900">
            Email *
          </label>
          <input
            type="email"
            className={field}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-green-900">
          Phone (optional)
        </label>
        <input
          className={field}
          placeholder="055 000 0000"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-none accent-gold-500"
        />
        <span className="text-sm text-green-900/75">
          Give anonymously — keep my name out of any published acknowledgement.
          We still need it for your receipt.
        </span>
      </label>

      {error && (
        <div className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={submit}
        disabled={submitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-4 text-base font-semibold text-green-950 shadow-lg shadow-gold-500/25 transition-all hover:-translate-y-0.5 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {submitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-950/30 border-t-green-950" />
            Opening Paystack…
          </>
        ) : (
          <>
            Contribute
            {amountValid ? ` ${symbol} ${formatAmount(Number(amount))}` : ""}
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs text-green-900/55">
        Payment is handled securely by Paystack. A receipt is emailed to you as
        soon as your gift clears.
      </p>
    </div>
  );
}
