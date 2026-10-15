import Link from "next/link";
import { notFound } from "next/navigation";
import { adminFetch } from "@/lib/adminAuth";
import { formatDateTime } from "@/lib/format";
import { ReviewActions } from "./ReviewActions";
import { RectifyDecision } from "./RectifyDecision";
import { ResendVerification } from "./ResendVerification";
import { ExperienceBadge } from "../ExperienceBadge";

type Decision = {
  action: "approved" | "rejected" | "reopened";
  at: string | null;
  byName?: string;
  notes?: string;
  correction?: boolean;
};

type AppDetail = {
  _id: string;
  applicantId?: string | null;
  fullName: string;
  title: string;
  titleOther?: string;
  gender: string;
  dateOfBirth: string;
  mobileNumbers: string;
  email: string;
  emailVerified?: boolean;
  postalAddress: string;
  cityOfResidence: string;
  countryOfResidence: string;
  homeCountry: string;
  hometown: string;
  fathersHometown: string;
  fathersEthnicGroup?: string;
  mothersHometown?: string;
  mothersEthnicGroup?: string;
  occupation: string;
  currentPlaceOfWork: string;
  jobTitle: string;
  educationalBackground: string[];
  workExperience: string;
  // null on applications submitted before the question was added — shown as
  // "Not stated", never conflated with an answered "0 years".
  yearsOfExperience?: number | null;
  areasOfInterest: string[];
  nextOfKin: { fullName: string; relationship: string; contact: string };
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  decisionHistory?: Decision[];
  // The member record an approval created; tells the console whether the
  // applicant has paid (and so whether the approval can still be withdrawn).
  linkedMember?: { id: string; status: string } | null;
};

export default async function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let app: AppDetail;
  try {
    app = await adminFetch<AppDetail>(`/applications/${id}`);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/applications"
        className="text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        &larr; All applications
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          {app.applicantId && (
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-green-700">
              {app.applicantId}
            </div>
          )}
          <h1 className="mt-1 font-display text-3xl font-semibold">
            {app.fullName}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-sm text-slate-600">{app.email}</p>
            {app.emailVerified ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                Email verified
              </span>
            ) : (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                Email not verified
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card title="Personal">
          <Row k="Title" v={app.title === "Other" ? app.titleOther : app.title} />
          <Row k="Gender" v={app.gender} />
          <Row k="Date of Birth" v={app.dateOfBirth} />
        </Card>

        <Card title="Contact">
          <Row k="Mobile" v={app.mobileNumbers} />
          <Row k="Postal" v={app.postalAddress} />
          <Row
            k="Residence"
            v={`${app.cityOfResidence}, ${app.countryOfResidence}`}
          />
        </Card>

        <Card title="Origin">
          <Row k="Home Country" v={app.homeCountry} />
          <Row k="Hometown" v={app.hometown} />
          <Row k="Father's Hometown" v={app.fathersHometown} />
          <Row k="Father's Ethnic Group" v={app.fathersEthnicGroup} />
          <Row k="Mother's Hometown" v={app.mothersHometown} />
          <Row k="Mother's Ethnic Group" v={app.mothersEthnicGroup} />
        </Card>

        <Card title="Professional">
          <Row k="Occupation" v={app.occupation} />
          <Row k="Place of Work" v={app.currentPlaceOfWork} />
          <Row k="Job Title" v={app.jobTitle} />
          <Row k="Education" v={app.educationalBackground?.join(", ")} />
          <Row k="Areas of Interest" v={app.areasOfInterest?.join(", ")} />
        </Card>

        <Card title="Work Experience" className="md:col-span-2">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-3">
            <span className="text-xs uppercase tracking-wider text-slate-500">
              Years of experience
            </span>
            <ExperienceBadge years={app.yearsOfExperience} />
          </div>
          <p className="whitespace-pre-line pt-1 text-sm leading-relaxed text-slate-700">
            {app.workExperience}
          </p>
        </Card>

        <Card title="Next of Kin" className="md:col-span-2">
          <Row k="Name" v={app.nextOfKin.fullName} />
          <Row k="Relationship" v={app.nextOfKin.relationship} />
          <Row k="Contact" v={app.nextOfKin.contact} />
        </Card>
      </div>

      {app.status === "pending" && !app.emailVerified && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="text-sm font-semibold text-amber-900">
            Waiting on email confirmation
          </div>
          <p className="mt-1 text-sm text-amber-800/80">
            This applicant hasn&apos;t clicked the confirmation link we emailed
            them, so the application isn&apos;t in the review queue yet and
            can&apos;t be approved. Once they confirm, it moves to{" "}
            <span className="font-semibold">Pending</span> and you can review it.
            Resend the link if they didn&apos;t receive it.
          </p>
          <ResendVerification id={id} />
        </div>
      )}

      <DecisionHistory app={app} />

      {app.status === "pending" && app.emailVerified && (
        <ReviewActions id={id} />
      )}

      {app.status !== "pending" && (
        // Keyed on status so a correction that lands on another decided state
        // (approved → rejected) starts the panel fresh.
        <RectifyDecision
          key={app.status}
          id={id}
          status={app.status}
          applicantName={app.fullName}
          linkedMember={app.linkedMember ?? null}
        />
      )}
    </div>
  );
}

const ACTION_LABEL: Record<Decision["action"], string> = {
  approved: "Approved",
  rejected: "Rejected",
  reopened: "Returned to review",
};

const ACTION_DOT: Record<Decision["action"], string> = {
  approved: "bg-emerald-500",
  rejected: "bg-rose-500",
  reopened: "bg-amber-500",
};

function DecisionHistory({ app }: { app: AppDetail }) {
  // Applications decided before the log existed carry only their latest
  // decision, in reviewedAt/reviewNotes.
  const entries: Decision[] = app.decisionHistory?.length
    ? app.decisionHistory
    : app.status !== "pending"
      ? [
          {
            action: app.status,
            at: app.reviewedAt ?? null,
            notes: app.reviewNotes,
          },
        ]
      : [];
  if (entries.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Review history
      </div>
      <ol className="mt-4 space-y-4">
        {entries.map((d, i) => (
          <li key={i} className="flex gap-3">
            <span
              className={`mt-1.5 h-2.5 w-2.5 flex-none rounded-full ${ACTION_DOT[d.action]}`}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-800">
                <span className="font-semibold">{ACTION_LABEL[d.action]}</span>
                <span className="text-slate-600">
                  {formatDateTime(d.at)}
                  {d.byName ? ` · ${d.byName}` : ""}
                </span>
                {d.correction && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                    Correction
                  </span>
                )}
              </div>
              {d.notes && (
                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                  {d.notes}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 ${className}`}
    >
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </div>
      <div className="mt-3 space-y-2.5">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  if (!v) return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <span className="w-40 flex-none text-xs uppercase tracking-wider text-slate-500">
        {k}
      </span>
      <span className="text-sm text-slate-800">{v}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-rose-100 text-rose-800",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
        colors[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}
