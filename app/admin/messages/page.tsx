import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";
import { MessageItem } from "./MessageItem";

type Message = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  submittedAt: string;
  readAt: string | null;
};

const TABS = [
  { key: "unread", label: "Unread" },
  { key: "all", label: "All" },
  { key: "read", label: "Read" },
] as const;

async function loadMessages(status: string): Promise<Message[]> {
  try {
    return await adminFetch<Message[]>(
      `/messages?status=${encodeURIComponent(status)}`
    );
  } catch {
    return [];
  }
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const active = (params.status as (typeof TABS)[number]["key"]) ?? "unread";
  const rows = await loadMessages(active);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-semibold">Messages</h1>
      <p className="mt-2 text-sm text-slate-600">
        Contact form submissions from the public site.
      </p>

      <div className="mt-6 inline-flex rounded-lg border border-slate-200 bg-white p-1">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/messages?status=${t.key}`}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              active === t.key
                ? "bg-green-900 text-cream"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
            No {active} messages.
          </div>
        ) : (
          rows.map((m) => <MessageItem key={m.id} message={m} />)
        )}
      </div>
    </div>
  );
}
