import { formatDate } from "@/lib/format";

// Letterhead that appears only on paper / in a saved PDF, where the console's
// sidebar and page chrome are hidden.
export function PrintHeader({ title }: { title: string }) {
  return (
    <div className="mb-6 hidden border-b-2 border-green-900 pb-3 print:block">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-800">
        Wassa Professionals Network
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-4">
        <div className="font-display text-2xl font-semibold text-slate-900">
          {title}
        </div>
        <div className="text-xs text-slate-500">
          Generated {formatDate(new Date().toISOString())}
        </div>
      </div>
    </div>
  );
}
