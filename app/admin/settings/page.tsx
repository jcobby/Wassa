import { adminFetch } from "@/lib/adminAuth";
import { FeeForm } from "./FeeForm";

type Settings = {
  membershipFee: { amount: number; currency: string };
};

async function loadSettings(): Promise<Settings> {
  try {
    return await adminFetch<Settings>("/settings");
  } catch {
    return { membershipFee: { amount: 0, currency: "GHS" } };
  }
}

export default async function SettingsPage() {
  const s = await loadSettings();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold">Settings</h1>
      <p className="mt-2 text-sm text-slate-600">
        Constitution-aligned configuration. Per Article 6.6.2, membership dues
        are set annually by the General Assembly &mdash; record the agreed
        amount here.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-xl font-semibold">Membership Fee</h2>
        <p className="mt-1 text-sm text-slate-600">
          Charged to new members during the activation flow after their
          application is approved.
        </p>
        <FeeForm
          initialAmount={s.membershipFee.amount}
          initialCurrency={s.membershipFee.currency}
        />
      </div>
    </div>
  );
}
