"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Message = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  submittedAt: string;
  readAt: string | null;
};

export function MessageItem({ message }: { message: Message }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [readAt, setReadAt] = useState(message.readAt);
  const isUnread = !readAt;

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && isUnread) {
      try {
        const out = await api.patch<{ readAt: string }>(
          `/messages/${message.id}/read`
        );
        setReadAt(out.readAt);
        router.refresh();
      } catch {
        // non-fatal
      }
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
        isUnread ? "border-amber-300" : "border-slate-200"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-start justify-between gap-4 px-6 py-4 text-left"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">
              {message.firstName} {message.lastName}
            </span>
            {isUnread && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                New
              </span>
            )}
          </div>
          <div className="mt-0.5 text-sm text-slate-500">{message.email}</div>
          {!open && (
            <p className="mt-1 truncate text-sm text-slate-600">
              {message.message}
            </p>
          )}
        </div>
        <div className="flex-none text-right text-xs text-slate-500">
          {new Date(message.submittedAt).toLocaleDateString()}
        </div>
      </button>
      {open && (
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800">
            {message.message}
          </p>
          <a
            href={`mailto:${message.email}`}
            className="mt-4 inline-flex text-sm font-semibold text-green-800 hover:text-green-700"
          >
            Reply via email &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
