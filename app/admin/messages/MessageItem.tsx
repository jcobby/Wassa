"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";

export type Reply = {
  subject: string;
  body: string;
  sentAt: string | null;
  sentByName: string;
};

export type Message = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  submittedAt: string;
  readAt: string | null;
  replies: Reply[];
};

const DEFAULT_SUBJECT = "Re: Your message to the Wassa Professionals Network";

export function MessageItem({ message }: { message: Message }) {
  const [open, setOpen] = useState(false);
  const [readAt, setReadAt] = useState(message.readAt);
  const [replies, setReplies] = useState<Reply[]>(message.replies ?? []);
  const [composing, setComposing] = useState(false);
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSent, setJustSent] = useState(false);
  const isUnread = !readAt;

  // State is updated locally rather than via router.refresh(): on the Unread
  // tab a refresh would drop the message from the list the moment it's opened.
  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && isUnread) {
      try {
        const out = await api.patch<{ readAt: string }>(
          `/messages/${message.id}/read`
        );
        setReadAt(out.readAt);
      } catch {
        // non-fatal
      }
    }
  };

  const send = async () => {
    if (body.trim().length < 2) {
      setError("Write your reply first.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const out = await api.post<{ readAt: string; replies: Reply[] }>(
        `/messages/${message.id}/reply`,
        { subject, message: body }
      );
      setReplies(out.replies);
      setReadAt(out.readAt);
      setBody("");
      setSubject(DEFAULT_SUBJECT);
      setComposing(false);
      setJustSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't send the reply. Try again."
      );
    } finally {
      setSending(false);
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
            {replies.length > 0 && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                Replied
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

          {replies.length > 0 && (
            <div className="mt-5 space-y-3">
              {replies.map((r, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-emerald-200 bg-white px-4 py-3"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-slate-500">
                    <span>
                      Replied by{" "}
                      <span className="font-semibold text-slate-700">
                        {r.sentByName || "an admin"}
                      </span>
                    </span>
                    {r.sentAt && (
                      <span>{new Date(r.sentAt).toLocaleString()}</span>
                    )}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-700">
                    {r.subject}
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-800">
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          )}

          {justSent && !composing && (
            <p className="mt-4 text-sm font-medium text-emerald-700">
              Reply emailed to {message.email}.
            </p>
          )}

          {composing ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-500">
                To{" "}
                <span className="font-medium text-slate-800">
                  {message.firstName} {message.lastName} &lt;{message.email}&gt;
                </span>
              </div>
              <label className="mt-3 mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Subject
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={200}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
              />
              <label className="mt-3 mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Message
              </label>
              <textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={`Your reply to ${message.firstName}…`}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
              />
              <p className="mt-2 text-xs text-slate-500">
                Sent from the WPN email address, opening with &ldquo;Dear{" "}
                {message.firstName},&rdquo; and with their original message
                quoted underneath. They can reply straight back.
              </p>
              {error && (
                <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={send}
                  disabled={sending}
                  className="rounded-lg bg-green-900 px-5 py-2 text-sm font-semibold text-cream hover:bg-green-800 disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send reply"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setComposing(false);
                    setError(null);
                  }}
                  disabled={sending}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setComposing(true);
                  setJustSent(false);
                }}
                className="rounded-lg bg-green-900 px-5 py-2 text-sm font-semibold text-cream hover:bg-green-800"
              >
                {replies.length > 0 ? "Send another reply" : "Reply by email"}
              </button>
              <a
                href={`mailto:${message.email}`}
                className="text-sm font-semibold text-green-800 hover:text-green-700"
              >
                Open in my mail app &rarr;
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
