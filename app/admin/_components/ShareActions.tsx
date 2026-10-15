"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/transactions";

// Hands a pre-written message to WhatsApp (straight to the member's chat when
// their number is readable, or any chat or group the admin picks), the
// clipboard, or the printer. WhatsApp opens with the text typed out but unsent,
// so the admin always reviews it before it goes.
export function ShareActions({
  text,
  phone,
  recipientName,
  title = "Share with the member",
  showPrint = true,
}: {
  text: string;
  phone: string | null;
  recipientName?: string;
  title?: string;
  showPrint?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const firstName = recipientName?.trim().split(/\s+/)[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the preview below can still be selected by hand.
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 print:hidden">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">
        Opens WhatsApp with the details already typed out &mdash; check the
        message, then press send.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {phone && (
          <a
            href={whatsappUrl(text, phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
          >
            Send to {firstName ?? "member"} on WhatsApp
          </a>
        )}
        <a
          href={whatsappUrl(text)}
          target="_blank"
          rel="noopener noreferrer"
          className={
            phone
              ? "rounded-lg border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
              : "rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
          }
        >
          {phone ? "Share to another chat" : "Share on WhatsApp"}
        </a>
        <button
          type="button"
          onClick={copy}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          {copied ? "Copied" : "Copy text"}
        </button>
        {showPrint && (
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Print / save as PDF
          </button>
        )}
      </div>

      {!phone && firstName && (
        <p className="mt-3 text-xs text-slate-500">
          No WhatsApp number could be read from {firstName}&apos;s profile, so
          you&apos;ll choose the chat in WhatsApp.
        </p>
      )}

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900">
          Preview message
        </summary>
        <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 font-sans text-xs leading-relaxed text-slate-700">
          {text}
        </pre>
      </details>
    </div>
  );
}
