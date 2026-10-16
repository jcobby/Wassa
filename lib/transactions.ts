import { formatDate, formatDateTime, money } from "./format";

// Turns raw ledger records into receipts, statements and dated reports an
// admin can explain to a member — on screen or saved as a PDF.

export type TxnStatus = "initialized" | "success" | "failed" | "abandoned";

export type MemberContact = {
  id: string;
  fullName: string;
  email: string;
  applicantId: string | null;
};

export type PaymentView = {
  id: string;
  reference: string;
  batchReference: string | null;
  amount: number;
  currency: string;
  status: TxnStatus;
  purpose: "membership_initial" | "dues_renewal";
  year: number;
  quarter: number | null;
  // Paystack's channel code, or the method an admin typed for a hand-recorded
  // payment ("Cash").
  channel: string | null;
  // Recorded by an admin (cash, bank transfer, …) rather than paid on Paystack.
  manual: boolean;
  // The admin's receipt number for a hand-recorded payment.
  externalReference: string;
  createdAt: string | null;
  completedAt: string | null;
};

// A row of the admin Payments list.
export type PaymentListRow = PaymentView & {
  member: {
    id: string;
    fullName: string;
    email: string;
    applicantId: string | null;
  } | null;
};

export type PaymentDetail = PaymentView & {
  member: MemberContact | null;
  gatewayResponse: string | null;
  batch: PaymentView[];
};

export type ContributionView = {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  anonymous: boolean;
  amount: number;
  currency: string;
  cause: string;
  message: string;
  memberId: string | null;
  reference: string;
  status: TxnStatus;
  channel: string | null;
  createdAt: string | null;
  completedAt: string | null;
};

export type ContributionDetail = ContributionView & {
  member: MemberContact | null;
};

// A payment an admin entered by hand (cash, bank transfer, …).
export type ManualRecord = {
  id: string;
  year: number;
  amount: number;
  method: string;
  reference: string;
  notes: string;
  paidAt: string | null;
};

export type MemberTransactions = {
  member: MemberContact;
  payments: PaymentView[];
  contributions: ContributionView[];
  manual: ManualRecord[];
};

export type DuesQuarter = {
  quarter: number;
  paid: boolean;
  waived: boolean;
  disabled?: boolean;
  due: boolean;
};

export type DuesStatus = {
  year: number;
  quarters: DuesQuarter[];
};

const QUARTER_MONTHS = [
  "January – March",
  "April – June",
  "July – September",
  "October – December",
];
const QUARTER_MONTHS_SHORT = ["Jan – Mar", "Apr – Jun", "Jul – Sep", "Oct – Dec"];

export const STATUS_LABEL: Record<TxnStatus, string> = {
  success: "Paid",
  initialized: "Not completed",
  failed: "Failed",
  abandoned: "Abandoned",
};

const CHANNELS: Record<string, string> = {
  mobile_money: "Mobile money",
  card: "Card",
  bank: "Bank account",
  bank_transfer: "Bank transfer",
  ussd: "USSD",
  qr: "QR code",
  apple_pay: "Apple Pay",
  eft: "EFT",
};

export function channelLabel(channel: string | null): string | null {
  if (!channel) return null;
  const words = channel.replace(/_/g, " ");
  return CHANNELS[channel] ?? words.charAt(0).toUpperCase() + words.slice(1);
}

// "Q3 2026 (Jul – Sep)"
export function quarterShort(year: number, quarter: number): string {
  return `Q${quarter} ${year} (${QUARTER_MONTHS_SHORT[quarter - 1]})`;
}

type Purposed = Pick<PaymentView, "purpose" | "year" | "quarter">;

export function purposeLabel(p: Purposed): string {
  return p.purpose === "dues_renewal"
    ? "Quarterly dues"
    : "Membership registration fee";
}

// What a payment pays for, in time: the quarter for dues, or the joining year
// for the one-time registration fee.
export function periodLabel(p: Purposed): string {
  if (p.purpose === "membership_initial") return `One-time, on joining (${p.year})`;
  if (!p.quarter) return `Year ${p.year}`;
  return `Q${p.quarter} ${p.year} · ${QUARTER_MONTHS[p.quarter - 1]} ${p.year}`;
}

// One line for tables: "Quarterly dues · Q3 2026 (Jul – Sep)"
export function paymentDescription(p: Purposed): string {
  if (p.purpose === "membership_initial") return "Membership registration fee";
  return p.quarter
    ? `Quarterly dues · ${quarterShort(p.year, p.quarter)}`
    : `Dues · ${p.year}`;
}

// ---- Single-transaction receipts -------------------------------------------

export type ReceiptRow = { label: string; value: string; mono?: boolean };

export type Receipt = {
  kind: string;
  title: string;
  amount: string;
  status: TxnStatus;
  // The whole transaction in a sentence or two of plain language.
  summary: string;
  rows: ReceiptRow[];
  note?: string;
};

function coverage(p: Purposed): string {
  if (p.purpose === "membership_initial") {
    return "the one-time membership registration fee";
  }
  if (!p.quarter) return `dues for ${p.year}`;
  return `quarterly dues for ${QUARTER_MONTHS[p.quarter - 1]} ${p.year} (Q${p.quarter})`;
}

export function paymentReceipt(p: PaymentDetail): Receipt {
  const what = coverage(p);
  const when = formatDate(p.completedAt ?? p.createdAt);
  const summary = {
    success: p.manual
      ? `Payment received by the Secretariat on ${when} and recorded by an admin. It covers ${what}.`
      : `Payment received and confirmed on ${when}. It covers ${what}.`,
    initialized: `A checkout for ${what} was opened on ${when} but has not been completed. No money has been received for this transaction.`,
    failed: `This attempt to pay ${what} failed on ${when}, and no money was taken.${
      p.gatewayResponse ? ` Paystack's reason: “${p.gatewayResponse}”.` : ""
    } The member can try again from their dashboard.`,
    abandoned: `The checkout for ${what} was closed without paying. No money was received.`,
  }[p.status];

  const rows: ReceiptRow[] = [];
  if (p.member) {
    rows.push({ label: "Member", value: p.member.fullName });
    if (p.member.applicantId) {
      rows.push({ label: "WPN ID", value: p.member.applicantId, mono: true });
    }
  } else {
    rows.push({ label: "Member", value: "Member record no longer exists" });
  }
  rows.push({ label: "Purpose", value: purposeLabel(p) });
  rows.push({ label: "Period", value: periodLabel(p) });
  rows.push(
    p.status === "success"
      ? { label: "Date paid", value: formatDateTime(p.completedAt) }
      : { label: "Started", value: formatDateTime(p.createdAt) }
  );
  const method = channelLabel(p.channel);
  if (method) rows.push({ label: "Method", value: method });
  if (p.externalReference) {
    rows.push({ label: "Receipt no.", value: p.externalReference, mono: true });
  }
  // Paystack, and the member's MoMo or bank statement, only know a multi-quarter
  // checkout by its shared reference.
  rows.push({
    label: "Reference",
    value: p.batchReference ?? p.reference,
    mono: true,
  });

  let note: string | undefined;
  if (p.batch.length > 1) {
    const others = p.batch
      .filter((b) => b.id !== p.id && b.quarter)
      .map((b) => quarterShort(b.year, b.quarter!));
    const total = p.batch.reduce((sum, b) => sum + Math.round(b.amount * 100), 0) / 100;
    note = `${p.status === "success" ? "Paid in" : "Part of"} one checkout together with ${others.join(", ")} — ${money(p.currency, total)} in total for ${p.batch.length} quarters.`;
  }

  return {
    kind: "Payment receipt",
    title:
      p.purpose === "dues_renewal" && p.quarter
        ? `Quarterly dues — Q${p.quarter} ${p.year}`
        : purposeLabel(p),
    amount: money(p.currency, p.amount),
    status: p.status,
    summary,
    rows,
    note,
  };
}

export function contributionReceipt(c: ContributionDetail): Receipt {
  const when = formatDate(c.completedAt ?? c.createdAt);
  const toward = c.cause ? `, designated for “${c.cause}”` : "";
  const summary = {
    success: `Voluntary contribution received and confirmed on ${when}${toward}.`,
    initialized: `A contribution checkout was opened on ${when} but has not been completed. No money has been received for this transaction.`,
    failed: `This contribution attempt failed on ${when}, and no money was taken.`,
    abandoned: `The contribution checkout was closed without paying. No money was received.`,
  }[c.status];

  const rows: ReceiptRow[] = [
    {
      label: "Donor",
      value: c.anonymous ? `${c.donorName} (anonymous publicly)` : c.donorName,
    },
  ];
  if (c.member?.applicantId) {
    rows.push({ label: "WPN ID", value: c.member.applicantId, mono: true });
  }
  if (c.cause) rows.push({ label: "Designated for", value: c.cause });
  rows.push(
    c.status === "success"
      ? { label: "Date received", value: formatDateTime(c.completedAt) }
      : { label: "Started", value: formatDateTime(c.createdAt) }
  );
  const method = channelLabel(c.channel);
  if (method) rows.push({ label: "Method", value: method });
  rows.push({ label: "Reference", value: c.reference, mono: true });

  return {
    kind: "Contribution receipt",
    title: c.cause ? `Contribution — ${c.cause}` : "Voluntary contribution",
    amount: money(c.currency, c.amount),
    status: c.status,
    summary,
    rows,
  };
}

// ---- Member statements -----------------------------------------------------

export type StatementLine = {
  key: string;
  date: string | null;
  description: string;
  amount: number;
  currency: string;
  status: TxnStatus;
  method: string | null;
  reference: string;
  // The receipt page for this line, when there is one.
  href: string | null;
};

export function statementLines(t: MemberTransactions): StatementLine[] {
  const lines: StatementLine[] = [
    ...t.payments.map((p) => ({
      key: `p-${p.id}`,
      date: p.completedAt ?? p.createdAt,
      description: p.manual
        ? `${paymentDescription(p)} (recorded by admin)`
        : paymentDescription(p),
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      method: channelLabel(p.channel),
      reference: p.batchReference ?? p.reference,
      href: `/admin/payments/${p.id}`,
    })),
    ...t.contributions.map((c) => ({
      key: `c-${c.id}`,
      date: c.completedAt ?? c.createdAt,
      description: c.cause ? `Contribution · ${c.cause}` : "Contribution",
      amount: c.amount,
      currency: c.currency,
      status: c.status,
      method: channelLabel(c.channel),
      reference: c.reference,
      href: `/admin/contributions/${c.id}`,
    })),
    ...t.manual.map((d) => ({
      key: `m-${d.id}`,
      date: d.paidAt,
      description: `Dues · ${d.year} (recorded by admin)`,
      amount: d.amount,
      // Hand-entered records carry no currency; the Dues page takes them in GH₵.
      currency: "GHS",
      status: "success" as const,
      method: d.method || null,
      reference: d.reference,
      href: null,
    })),
  ];
  return lines.sort(
    (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
  );
}

// Totals per currency — in practice always one, but never add GHS to USD.
export function totalsByCurrency(
  lines: { currency: string; amount: number }[]
): string[] {
  const sums = new Map<string, number>();
  for (const l of lines) {
    sums.set(l.currency, (sums.get(l.currency) ?? 0) + Math.round(l.amount * 100));
  }
  return [...sums].map(([currency, pesewas]) => money(currency, pesewas / 100));
}

// "Dues 2026: Q1 paid · Q2 waived · Q3 due · Q4 upcoming"
export function duesSummary(d: DuesStatus): string {
  const parts = d.quarters.map((q) => {
    const state = q.paid
      ? "paid"
      : q.waived
        ? "waived"
        : q.disabled
          ? "no dues"
          : q.due
            ? "due"
            : "upcoming";
    return `Q${q.quarter} ${state}`;
  });
  return `Dues ${d.year}: ${parts.join(" · ")}`;
}

// ---- Dated reports ---------------------------------------------------------

// Mirrors RANGE_LIMIT in wpn-api/src/utils/dateRange.ts: a dated list stops
// there, so a report that reaches it may be missing rows.
export const REPORT_ROW_LIMIT = 2000;

export function rangeLabel(from?: string, to?: string): string {
  if (from && to) {
    return from === to ? formatDate(from) : `${formatDate(from)} – ${formatDate(to)}`;
  }
  if (from) return `From ${formatDate(from)}`;
  if (to) return `Up to ${formatDate(to)}`;
  return "All dates";
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export type ReportGroup = { label: string; countText: string; total: string };

export type ReportSummary = {
  stats: { label: string; value: string }[];
  groups: ReportGroup[];
  // Rows in view that brought in no money — left out of every total.
  unfinished: number;
};

function totalText(rows: { currency: string; amount: number }[]): string {
  return totalsByCurrency(rows).join(" + ") || money("GHS", 0);
}

export function summarizePayments(rows: PaymentListRow[]): ReportSummary {
  const paid = rows.filter((r) => r.status === "success");
  const fees = paid.filter((r) => r.purpose === "membership_initial");
  const dues = paid.filter((r) => r.purpose === "dues_renewal");
  const payers = new Set(paid.map((r) => r.member?.id ?? r.id)).size;
  const groups: ReportGroup[] = [];
  if (fees.length) {
    groups.push({
      label: "Registration fees",
      countText: plural(fees.length, "member"),
      total: totalText(fees),
    });
  }
  if (dues.length) {
    groups.push({
      label: "Quarterly dues",
      countText: plural(dues.length, "quarter"),
      total: totalText(dues),
    });
  }
  return {
    stats: [
      { label: "Total received", value: totalText(paid) },
      { label: "Members who paid", value: String(payers) },
      { label: "Payments", value: String(paid.length) },
    ],
    groups,
    unfinished: rows.length - paid.length,
  };
}

export function summarizeContributions(rows: ContributionView[]): ReportSummary {
  const paid = rows.filter((r) => r.status === "success");
  const byCause = new Map<string, ContributionView[]>();
  for (const r of paid) {
    const cause = r.cause || "Not designated";
    byCause.set(cause, [...(byCause.get(cause) ?? []), r]);
  }
  return {
    stats: [
      { label: "Total received", value: totalText(paid) },
      { label: "Gifts", value: String(paid.length) },
      {
        label: "Donors",
        value: String(new Set(paid.map((r) => r.donorEmail)).size),
      },
    ],
    groups: [...byCause].map(([label, gifts]) => ({
      label,
      countText: plural(gifts.length, "gift"),
      total: totalText(gifts),
    })),
    unfinished: rows.length - paid.length,
  };
}
