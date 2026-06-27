"use client";

import { useState } from "react";

export function CredentialBox({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPw, setCopiedPw] = useState(false);

  const copy = async (text: string, kind: "email" | "pw") => {
    try {
      await navigator.clipboard.writeText(text);
      if (kind === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 1500);
      } else {
        setCopiedPw(true);
        setTimeout(() => setCopiedPw(false), 1500);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-green-900/10 bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-green-950">
        Your login details
      </h2>
      <p className="mt-1 text-sm text-green-900/65">
        Save these somewhere safe. We've also emailed them to you. You can
        change the password after signing in.
      </p>

      <div className="mt-5 space-y-4">
        <Row
          label="Email"
          value={email}
          copied={copiedEmail}
          onCopy={() => copy(email, "email")}
        />
        <Row
          label="Temporary Password"
          value={password}
          copied={copiedPw}
          onCopy={() => copy(password, "pw")}
          mono
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  copied,
  onCopy,
  mono = false,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl bg-cream p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-green-900/55">
        {label}
      </div>
      <div className="mt-1 flex items-center justify-between gap-3">
        <div
          className={`min-w-0 truncate text-base text-green-950 ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </div>
        <button
          onClick={onCopy}
          className="flex-none rounded-lg border border-green-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-green-900 hover:border-gold-500 hover:bg-gold-50"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
