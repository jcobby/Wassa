import Link from "next/link";
import { notFound } from "next/navigation";
import { adminFetch } from "@/lib/adminAuth";
import { ReviewActions } from "./ReviewActions";

type AppDetail = {
  _id: string;
  fullName: string;
  title: string;
  titleOther?: string;
  gender: string;
  dateOfBirth: string;
  mobileNumbers: string;
  email: string;
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
  areasOfInterest: string[];
  nextOfKin: { fullName: string; relationship: string; contact: string };
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
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
          <h1 className="font-display text-3xl font-semibold">{app.fullName}</h1>
          <p className="mt-1 text-sm text-slate-600">{app.email}</p>
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
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {app.workExperience}
          </p>
        </Card>

        <Card title="Next of Kin" className="md:col-span-2">
          <Row k="Name" v={app.nextOfKin.fullName} />
          <Row k="Relationship" v={app.nextOfKin.relationship} />
          <Row k="Contact" v={app.nextOfKin.contact} />
        </Card>
      </div>

      {app.status === "pending" && <ReviewActions id={id} />}

      {app.status !== "pending" && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Review history
          </div>
          <div className="mt-2 text-sm text-slate-700">
            {app.status === "approved" ? "Approved" : "Rejected"} on{" "}
            {app.reviewedAt
              ? new Date(app.reviewedAt).toLocaleString()
              : "—"}
          </div>
          {app.reviewNotes && (
            <p className="mt-3 whitespace-pre-line text-sm text-slate-600">
              {app.reviewNotes}
            </p>
          )}
        </div>
      )}
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
