import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";
import { DuesTable } from "./DuesTable";

type DuesRow = {
  memberId: string;
  fullName: string;
  email: string;
  year: number;
  paid: boolean;
  amountPaid: number;
  paidAt: string | null;
  method: string;
  reference: string;
};

async function loadDues(year: number, view: string): Promise<DuesRow[]> {
  const path = view === "arrears" ? "/dues/arrears" : "/dues";
  try {
    return await adminFetch<DuesRow[]>(`${path}?year=${year}`);
  } catch {
    return [];
  }
}

export default async function DuesPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; view?: string }>;
}) {
  const params = await searchParams;
  const currentYear = new Date().getFullYear();
  const year = Number(params.year) || currentYear;
  const view = params.view ?? "all";

  const rows = await loadDues(year, view);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-3xl font-semibold">Dues</h1>
      <p className="mt-2 text-sm text-slate-600">
        Track annual member dues. Per Article 6.6.2 of the Constitution, rates
        are set annually by the General Assembly.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <form action="/admin/dues" className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Year
          </label>
          <select
            name="year"
            defaultValue={year}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {view !== "all" && <input type="hidden" name="view" value={view} />}
          <button
            type="submit"
            className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-cream hover:bg-green-800"
          >
            Go
          </button>
        </form>

        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          {[
            { key: "all", label: "All Members" },
            { key: "arrears", label: "Arrears Only" },
          ].map((t) => {
            const isActive = view === t.key;
            return (
              <Link
                key={t.key}
                href={`/admin/dues?year=${year}&view=${t.key}`}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-900 text-cream"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      <DuesTable rows={rows} year={year} arrearsOnly={view === "arrears"} />
    </div>
  );
}
