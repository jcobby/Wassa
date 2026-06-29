import Link from "next/link";
import { notFound } from "next/navigation";
import { adminFetch } from "@/lib/adminAuth";
import { MemberActions } from "./MemberActions";
import { ResendEmail } from "./ResendEmail";

type MemberDetail = {
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
  role: "member" | "admin";
  status: "active" | "suspended" | "terminated" | "pending_payment";
  hasPassword?: boolean;
  joinedAt: string;
  lastLoginAt?: string;
};

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let m: MemberDetail;
  try {
    m = await adminFetch<MemberDetail>(`/members/${id}`);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/members"
        className="text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        &larr; All members
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">{m.fullName}</h1>
          <p className="mt-1 text-sm text-slate-600">{m.email}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
            Joined {new Date(m.joinedAt).toLocaleDateString()}
            {m.lastLoginAt
              ? ` · Last login ${new Date(m.lastLoginAt).toLocaleDateString()}`
              : " · Never signed in"}
          </p>
        </div>
        <StatusBadge status={m.status} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card title="Personal">
          <Row k="Title" v={m.title === "Other" ? m.titleOther : m.title} />
          <Row k="Gender" v={m.gender} />
          <Row k="Date of Birth" v={m.dateOfBirth} />
          <Row k="Role" v={m.role} />
        </Card>
        <Card title="Contact">
          <Row k="Mobile" v={m.mobileNumbers} />
          <Row k="Postal" v={m.postalAddress} />
          <Row
            k="Residence"
            v={`${m.cityOfResidence}, ${m.countryOfResidence}`}
          />
        </Card>
        <Card title="Origin">
          <Row k="Home Country" v={m.homeCountry} />
          <Row k="Hometown" v={m.hometown} />
          <Row k="Father's Hometown" v={m.fathersHometown} />
          <Row k="Father's Ethnic Group" v={m.fathersEthnicGroup} />
          <Row k="Mother's Hometown" v={m.mothersHometown} />
          <Row k="Mother's Ethnic Group" v={m.mothersEthnicGroup} />
        </Card>
        <Card title="Professional">
          <Row k="Occupation" v={m.occupation} />
          <Row k="Place of Work" v={m.currentPlaceOfWork} />
          <Row k="Job Title" v={m.jobTitle} />
          <Row k="Education" v={m.educationalBackground?.join(", ")} />
          <Row k="Areas of Interest" v={m.areasOfInterest?.join(", ")} />
        </Card>
        <Card title="Next of Kin" className="md:col-span-2">
          <Row k="Name" v={m.nextOfKin.fullName} />
          <Row k="Relationship" v={m.nextOfKin.relationship} />
          <Row k="Contact" v={m.nextOfKin.contact} />
        </Card>
      </div>

      {m.role !== "admin" && m.status === "pending_payment" && (
        <ResendEmail id={id} mode="payment" />
      )}
      {m.role !== "admin" && m.status === "active" && !m.hasPassword && (
        <ResendEmail id={id} mode="set_password" />
      )}
      {m.role !== "admin" &&
        (m.status === "active" ||
          m.status === "suspended" ||
          m.status === "terminated") && (
          <MemberActions id={id} status={m.status} />
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
      <span className="text-sm text-slate-800 capitalize">{v}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800",
    suspended: "bg-amber-100 text-amber-800",
    terminated: "bg-slate-200 text-slate-700",
    pending_payment: "bg-blue-100 text-blue-800",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
        colors[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
