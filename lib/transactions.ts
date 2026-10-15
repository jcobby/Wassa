import { formatDate, formatDateTime, money } from "./format";

// Turns raw ledger records into receipts and statements an admin can explain
// to a member — on screen, on paper, or as a WhatsApp message. The page and the
// message are built from the same Receipt, so they can never disagree.

export type TxnStatus = "initialized" | "success" | "failed" | "abandoned";

export type MemberContact = {
  id: string;
  fullName: string;
  email: string;
  applicantId: string | null;
  mobileNumbers: string;
  countryOfResidence: string;
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
  channel: string | null;
  createdAt: string | null;
  completedAt: string | null;
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

const STATUS_MARK: Record<TxnStatus, string> = {
  success: "✅",
  initialized: "⏳",
  failed: "❌",
  abandoned: "⚪",
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
    success: `Payment received and confirmed on ${when}. It covers ${what}.`,
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

// WhatsApp formatting: *bold*, _italic_. Plain enough to read in any chat.
export function receiptText(r: Receipt): string {
  const lines = [
    "*Wassa Professionals Network*",
    r.kind,
    "",
    `*${r.title}*`,
    `Amount: *${r.amount}*`,
    `Status: ${STATUS_LABEL[r.status]} ${STATUS_MARK[r.status]}`,
    "",
    r.summary,
    "",
    ...r.rows.map((row) => `${row.label}: ${row.value}`),
  ];
  if (r.note) lines.push("", r.note);
  lines.push("", "_Help a Wassa to Help Wassa._");
  return lines.join("\n");
}

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
      description: paymentDescription(p),
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
export function totalsByCurrency(lines: StatementLine[]): string[] {
  const sums = new Map<string, number>();
  for (const l of lines) {
    sums.set(l.currency, (sums.get(l.currency) ?? 0) + Math.round(l.amount * 100));
  }
  return [...sums].map(([currency, pesewas]) => money(currency, pesewas / 100));
}

function duesLine(d: DuesStatus): string {
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

// A member's statement as one WhatsApp message: everything they've paid, the
// total, and where their dues stand this year.
export function statementText(
  member: MemberContact,
  paid: StatementLine[],
  dues: DuesStatus | null
): string {
  const lines = [
    "*Wassa Professionals Network*",
    "Payment statement",
    "",
    `Member: ${member.fullName}`,
  ];
  if (member.applicantId) lines.push(`WPN ID: ${member.applicantId}`);
  lines.push(`Statement date: ${formatDate(new Date().toISOString())}`, "");

  if (paid.length === 0) {
    lines.push("No payments on record yet.");
  } else {
    paid.forEach((l, i) => {
      lines.push(
        `${i + 1}. ${formatDate(l.date)} — ${l.description} — ${money(l.currency, l.amount)}`
      );
    });
    lines.push("", `*Total paid: ${totalsByCurrency(paid).join(" + ")}*`);
  }
  if (dues) lines.push("", duesLine(dues));
  lines.push("", "_Help a Wassa to Help Wassa._");
  return lines.join("\n");
}

// A wa.me-ready number (country code + digits, no "+"), or null when the
// profile's free-text phone field can't be read with confidence — the console
// then lets the admin pick the chat in WhatsApp instead.
export function whatsappNumber(
  raw: string | null | undefined,
  country?: string | null
): string | null {
  if (!raw) return null;
  // Members often list several numbers ("024 123 4567 / 020 765 4321").
  const first = raw.split(/[/,;]|\bor\b/i)[0]?.trim() ?? "";
  let digits = first.replace(/\D/g, "");
  if (first.startsWith("+")) {
    // already international
  } else if (digits.startsWith("00")) {
    digits = digits.slice(2);
  } else if (digits.length === 10 && digits.startsWith("0")) {
    // A local number is only safe to read as Ghanaian for members living there.
    if (!/ghana/i.test(country ?? "")) return null;
    digits = `233${digits.slice(1)}`;
  } else if (!(digits.startsWith("233") && digits.length === 12)) {
    return null;
  }
  // "+233 (0)24 …" keeps a trunk zero after the country code.
  if (digits.startsWith("2330") && digits.length === 13) {
    digits = `233${digits.slice(4)}`;
  }
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

export function whatsappUrl(text: string, phone?: string | null): string {
  return `https://wa.me/${phone ?? ""}?text=${encodeURIComponent(text)}`;
}
