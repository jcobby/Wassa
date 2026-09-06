import { adminFetch } from "@/lib/adminAuth";
import { FeeForm } from "./FeeForm";
import { QuarterCollection } from "./QuarterCollection";
import {
  ContributionSettings,
  type ContributionConfig,
} from "./ContributionSettings";

type Fee = { amount: number; currency: string };
type DisabledQuarter = { year: number; quarter: number };
type Settings = {
  membershipFee: Fee;
  quarterlyDues: Fee;
  disabledDuesQuarters?: DisabledQuarter[];
  contributions?: Partial<ContributionConfig>;
};

// Matches the schema defaults, so the card still renders sensibly against a
// settings document written before contributions existed.
const CONTRIBUTION_DEFAULTS: ContributionConfig = {
  enabled: true,
  currency: "GHS",
  minAmount: 1,
  suggestedAmounts: [50, 100, 200, 500, 1000],
  causes: ["Where it's needed most"],
};

async function loadSettings(): Promise<Settings> {
  try {
    return await adminFetch<Settings>("/settings");
  } catch {
    return {
      membershipFee: { amount: 0, currency: "GHS" },
      quarterlyDues: { amount: 0, currency: "GHS" },
      disabledDuesQuarters: [],
    };
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
        <h2 className="font-display text-xl font-semibold">
          Registration Fee
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          One-time fee charged to new members during the activation flow after
          their application is approved.
        </p>
        <FeeForm
          initialAmount={s.membershipFee.amount}
          initialCurrency={s.membershipFee.currency}
          endpoint="/settings/membership-fee"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-xl font-semibold">Quarterly Dues</h2>
        <p className="mt-1 text-sm text-slate-600">
          Recurring dues charged every calendar quarter (Jan–Mar, Apr–Jun,
          Jul–Sep, Oct–Dec). Members pay this on the site to stay in good
          standing.
        </p>
        <FeeForm
          initialAmount={s.quarterlyDues.amount}
          initialCurrency={s.quarterlyDues.currency}
          endpoint="/settings/quarterly-dues"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-xl font-semibold">
          Dues Collection by Quarter
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Turn off dues for a whole quarter when the association decides not to
          collect (e.g. a hardship period or a levy-funded quarter). While a
          quarter is off, no member owes it and no one can pay it on the site.
          Quarters already paid are unaffected.
        </p>
        <QuarterCollection initialDisabled={s.disabledDuesQuarters ?? []} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-xl font-semibold">
          Voluntary Contributions
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Public giving through the Contribute page. Anyone may give &mdash;
          member or not &mdash; in any amount above the minimum you set here.
        </p>
        <ContributionSettings
          initial={{ ...CONTRIBUTION_DEFAULTS, ...(s.contributions ?? {}) }}
        />
      </div>
    </div>
  );
}
