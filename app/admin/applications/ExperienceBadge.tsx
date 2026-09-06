// The applicant's self-declared years of work experience.
//
// Colour encodes the 5-year mark so a reviewer can scan the queue, but the
// number is always shown — the decision is theirs, not the badge's. `null`
// means the question was never put to the applicant (they applied before it
// existed) and must never render as "0 years", which would read as an answer
// they never gave.
export function ExperienceBadge({ years }: { years?: number | null }) {
  if (years === null || years === undefined) {
    return (
      <span
        title="This application was submitted before the question was asked."
        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
      >
        Not stated
      </span>
    );
  }

  const label = `${years} ${years === 1 ? "year" : "years"}`;
  const tone =
    years >= 5
      ? "bg-emerald-100 text-emerald-800"
      : "bg-amber-100 text-amber-800";

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone}`}
    >
      {label}
    </span>
  );
}
