"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api, ApiError } from "@/lib/api";

const STEPS = [
  "Personal Details",
  "Contact Details",
  "Origin & Community",
  "Professional Profile",
  "Next of Kin",
  "Review",
];

const TITLES = ["Mr.", "Mrs.", "Dr.", "Professor", "Other"];
const GENDERS = ["Male", "Female"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const RELATIONSHIPS = [
  "Spouse", "Mother", "Father", "Son", "Daughter",
  "Brother", "Sister", "Aunt", "Uncle", "Cousin", "Friend", "Other",
];
const COUNTRIES = [
  "Ghana",
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahrain", "Bangladesh", "Belarus", "Belgium", "Belize", "Benin",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada",
  "Central African Republic", "Chad", "Chile", "China", "Colombia",
  "Comoros", "Congo (Republic of)", "Côte d'Ivoire", "Croatia", "Cuba",
  "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "DR Congo",
  "Ecuador", "Egypt", "Equatorial Guinea", "Eritrea", "Estonia",
  "Eswatini", "Ethiopia",
  "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Greece", "Guatemala",
  "Guinea", "Guinea-Bissau",
  "Honduras", "Hungary",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Mali", "Malta", "Mauritania",
  "Mauritius", "Mexico", "Moldova", "Mongolia", "Morocco", "Mozambique",
  "Myanmar",
  "Namibia", "Nepal", "Netherlands", "New Zealand", "Niger", "Nigeria",
  "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Panama", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia",
  "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain",
  "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tunisia",
  "Turkey", "Turkmenistan",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan",
  "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe",
  "Other",
];
const EDUCATION_OPTIONS = [
  "Certificate", "Degree", "Diploma", "Masters Degree", "Doctorate Degree",
  "Other",
];
const INTEREST_OPTIONS = [
  "Mentorship", "Business Networking", "Investment Opportunities",
  "Community Development", "Career Development",
  "Partnerships and Collaboration", "Training and Capacity Building", "Other",
];

type FormData = {
  fullName: string;
  title: string;
  titleOther: string;
  gender: string;
  dobDay: string;
  dobMonth: string;
  mobileNumbers: string;
  email: string;
  postalAddress: string;
  cityTown: string;
  countryOfResidence: string;
  homeCountry: string;
  hometown: string;
  fatherHometown: string;
  fatherEthnicGroup: string;
  motherHometown: string;
  motherEthnicGroup: string;
  occupation: string;
  currentWorkplace: string;
  jobTitle: string;
  educationalBackground: string[];
  educationalBackgroundOther: string;
  workExperience: string;
  areasOfInterest: string[];
  areasOfInterestOther: string;
  nextOfKinName: string;
  nextOfKinRelationship: string;
  nextOfKinContact: string;
};

const INITIAL: FormData = {
  fullName: "",
  title: "",
  titleOther: "",
  gender: "",
  dobDay: "",
  dobMonth: "",
  mobileNumbers: "",
  email: "",
  postalAddress: "",
  cityTown: "",
  countryOfResidence: "",
  homeCountry: "",
  hometown: "",
  fatherHometown: "",
  fatherEthnicGroup: "",
  motherHometown: "",
  motherEthnicGroup: "",
  occupation: "",
  currentWorkplace: "",
  jobTitle: "",
  educationalBackground: [],
  educationalBackgroundOther: "",
  workExperience: "",
  areasOfInterest: [],
  areasOfInterestOther: "",
  nextOfKinName: "",
  nextOfKinRelationship: "",
  nextOfKinContact: "",
};

function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s\-+().]/g, "");
  return /^\d{7,15}$/.test(digits);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(step: number, data: FormData): string[] {
  const errs: string[] = [];
  if (step === 0) {
    if (!data.fullName.trim()) errs.push("Full name is required.");
    if (!data.title) errs.push("Title is required.");
    if (data.title === "Other" && !data.titleOther.trim())
      errs.push("Please specify your title.");
  }
  if (step === 1) {
    if (!data.gender) errs.push("Gender is required.");
    if (!data.dobDay || !data.dobMonth) errs.push("Date of birth is required.");
    if (!data.mobileNumbers.trim()) {
      errs.push("Mobile number is required.");
    } else if (!isValidPhone(data.mobileNumbers)) {
      errs.push("Mobile number must contain 7–15 digits and may include +, spaces, or dashes.");
    }
    if (!data.email.trim()) {
      errs.push("Email address is required.");
    } else if (!isValidEmail(data.email)) {
      errs.push("Please enter a valid email address.");
    }
    if (!data.postalAddress.trim()) errs.push("Postal address is required.");
    if (!data.cityTown.trim()) errs.push("City/Town of residence is required.");
    if (!data.countryOfResidence) errs.push("Country of residence is required.");
  }
  if (step === 2) {
    if (!data.homeCountry) errs.push("Home country is required.");
    if (!data.hometown.trim()) errs.push("Hometown is required.");
    if (!data.fatherHometown.trim()) errs.push("Father's hometown is required.");
  }
  if (step === 3) {
    if (!data.occupation.trim()) errs.push("Occupation/Profession is required.");
    if (!data.currentWorkplace.trim()) errs.push("Current place of work is required.");
    if (!data.jobTitle.trim()) errs.push("Job title/position is required.");
    if (data.educationalBackground.length === 0)
      errs.push("Please select at least one educational background.");
    if (
      data.educationalBackground.includes("Other") &&
      !data.educationalBackgroundOther.trim()
    )
      errs.push("Please specify your “Other” qualification.");
    if (!data.workExperience.trim()) errs.push("Work experience is required.");
    if (data.areasOfInterest.length === 0)
      errs.push("Please select at least one area of interest.");
  }
  if (step === 4) {
    if (!data.nextOfKinName.trim()) errs.push("Next of kin's full name is required.");
    if (!data.nextOfKinRelationship) errs.push("Relationship is required.");
    if (!data.nextOfKinContact.trim()) {
      errs.push("Contact of next of kin is required.");
    } else if (!isValidPhone(data.nextOfKinContact)) {
      errs.push("Next of kin contact must contain 7–15 digits and may include +, spaces, or dashes.");
    }
  }
  return errs;
}

// ── Review helpers ──────────────────────────────────────────────
function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-green-900/10 overflow-hidden">
      <div className="flex items-center justify-between bg-green-900/5 px-5 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-green-900/70">
          {title}
        </span>
        <button
          onClick={onEdit}
          className="text-xs font-semibold text-gold-600 hover:text-gold-500 transition-colors"
        >
          Edit
        </button>
      </div>
      <div className="divide-y divide-green-900/5 px-5">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string | string[] }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-4">
      <span className="w-44 flex-none text-xs text-green-900/50">{label}</span>
      <span className="text-[15px] text-green-950">
        {Array.isArray(value) ? value.join(", ") : value}
      </span>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────
const inp =
  "w-full rounded-xl border border-green-900/15 bg-white px-4 py-3 text-[15px] text-green-950 placeholder-green-900/30 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";
const lbl = "block text-sm font-semibold text-green-950 mb-2";
const req = <span className="text-red-500 ml-0.5">*</span>;

// ── Page ────────────────────────────────────────────────────────
export default function Apply() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const set = (field: keyof FormData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const toggleArray = (
    field: "educationalBackground" | "areasOfInterest",
    value: string
  ) =>
    setData((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });

  const goToStep = (s: number) => {
    setErrors([]);
    setStep(s);
    scrollToForm();
  };

  const fillTestData = () => {
    const stamp = Date.now().toString(36);
    const rnd = Math.random().toString(36).slice(2, 8);
    setData({
      fullName: `Test Applicant ${rnd}`,
      title: "Mr.",
      titleOther: "",
      gender: "Male",
      dobDay: String(1 + Math.floor(Math.random() * 28)),
      dobMonth: MONTHS[Math.floor(Math.random() * 12)],
      mobileNumbers: "+233 20 000 0000",
      // Gmail "+" addressing — all variations deliver to justicecobbinah19@gmail.com,
      // so the approval/welcome emails actually arrive while still being unique
      // per submission. Change before deploying to production.
      email: `justicecobbinah19+wpn${stamp}${rnd}@gmail.com`,
      postalAddress: "P.O. Box 123, Tarkwa",
      cityTown: "Tarkwa",
      countryOfResidence: "Ghana",
      homeCountry: "Ghana",
      hometown: "Tarkwa",
      fatherHometown: "Tarkwa",
      fatherEthnicGroup: "Wassa",
      motherHometown: "Bogoso",
      motherEthnicGroup: "Wassa",
      occupation: "Software Engineer",
      currentWorkplace: "Acme Ghana Ltd.",
      jobTitle: "Senior Engineer",
      educationalBackground: ["Degree"],
      educationalBackgroundOther: "",
      workExperience:
        "5+ years building web applications. Previously at XYZ Corp as a developer.",
      areasOfInterest: ["Mentorship", "Business Networking"],
      areasOfInterestOther: "",
      nextOfKinName: "Jane Doe",
      nextOfKinRelationship: "Spouse",
      nextOfKinContact: "+233 24 111 1111",
    });
    setErrors([]);
    setSubmitted(false);
    setSubmittedId(null);
    setVerifyUrl(null);
    setEmailSent(false);
  };

  const submitToApi = async () => {
    setSubmitting(true);
    setErrors([]);
    try {
      const title = data.title === "Other" ? "Other" : data.title.replace(/\.$/, "");
      const interests = [
        ...data.areasOfInterest.filter((v) => v !== "Other"),
        ...(data.areasOfInterest.includes("Other") && data.areasOfInterestOther.trim()
          ? [`Other: ${data.areasOfInterestOther.trim()}`]
          : []),
      ];
      const education = [
        ...data.educationalBackground.filter((v) => v !== "Other"),
        ...(data.educationalBackground.includes("Other") &&
        data.educationalBackgroundOther.trim()
          ? [`Other: ${data.educationalBackgroundOther.trim()}`]
          : []),
      ];
      const payload = {
        fullName: data.fullName.trim(),
        title,
        titleOther: data.titleOther.trim(),
        gender: data.gender,
        dateOfBirth: `${data.dobDay} ${data.dobMonth}`,
        mobileNumbers: data.mobileNumbers.trim(),
        email: data.email.trim().toLowerCase(),
        postalAddress: data.postalAddress.trim(),
        cityOfResidence: data.cityTown.trim(),
        countryOfResidence: data.countryOfResidence,
        homeCountry: data.homeCountry,
        hometown: data.hometown.trim(),
        fathersHometown: data.fatherHometown.trim(),
        fathersEthnicGroup: data.fatherEthnicGroup.trim(),
        mothersHometown: data.motherHometown.trim(),
        mothersEthnicGroup: data.motherEthnicGroup.trim(),
        occupation: data.occupation.trim(),
        currentPlaceOfWork: data.currentWorkplace.trim(),
        jobTitle: data.jobTitle.trim(),
        educationalBackground: education,
        workExperience: data.workExperience.trim(),
        areasOfInterest: interests,
        nextOfKin: {
          fullName: data.nextOfKinName.trim(),
          relationship: data.nextOfKinRelationship,
          contact: data.nextOfKinContact.trim(),
        },
      };
      const out = await api.post<{
        id: string;
        emailSent?: boolean;
        verifyUrl?: string;
      }>("/applications", payload);
      setSubmittedId(out.id);
      setEmailSent(Boolean(out.emailSent));
      setVerifyUrl(out.verifyUrl ?? null);
      setSubmitted(true);
      scrollToForm();
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "We couldn't submit your application. Please try again.";
      setErrors([msg]);
      scrollToForm();
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    // Review step submits directly
    if (step === STEPS.length - 1) {
      submitToApi();
      return;
    }
    const errs = validate(step, data);
    if (errs.length) {
      setErrors(errs);
      scrollToForm();
      return;
    }
    setErrors([]);
    setStep((s) => s + 1);
    setSubmitted(false);
    scrollToForm();
  };

  const back = () => {
    setErrors([]);
    setStep((s) => s - 1);
    setSubmitted(false);
    scrollToForm();
  };

  const isDev = process.env.NODE_ENV !== "production";

  // Full success page after submit
  if (submitted) {
    const submitAnotherTest = () => {
      setSubmitted(false);
      setSubmittedId(null);
      fillTestData();
      setStep(STEPS.length - 1); // jump straight to Review so one more click submits
    };

    return (
      <main className="min-h-screen bg-cream">
        <Navbar />

        <section className="relative overflow-hidden bg-green-950 pt-28 pb-10 texture-grain">
          <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-green-700/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />

          <div className="mx-auto max-w-2xl px-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-green-950">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              Application Received
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-cream sm:text-4xl">
              Thank you &mdash; <span className="italic text-gold-400">one quick step left</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-cream/75">
              Confirm your email below to begin the review. The Executive Council
              responds within thirty (30) days (Article 6.3) &mdash; and if
              approved, sends a link to complete payment.
            </p>

            {submittedId && (
              <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-cream/15 bg-green-900/40 px-4 py-2 text-xs text-cream/70">
                <span className="uppercase tracking-wider">Reference</span>
                <span className="font-mono text-cream">{submittedId}</span>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-3xl space-y-6 px-6 pt-8 pb-16">
          {/* Confirm-email — the immediate next action, made prominent */}
          <div className="rounded-3xl border-2 border-gold-400/50 bg-white p-6 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-xl font-semibold text-green-950">
                  Confirm your email address
                </h2>
                {emailSent ? (
                  <p className="mt-2 text-[15px] leading-relaxed text-green-900/75">
                    We&apos;ve sent a confirmation link to{" "}
                    <span className="font-semibold break-words">{data.email}</span>.
                    Please open it &mdash; the Executive Council only begins
                    reviewing your application once your email is confirmed.
                    Check your spam folder if it doesn&apos;t arrive within a few
                    minutes.
                  </p>
                ) : (
                  <p className="mt-2 text-[15px] leading-relaxed text-green-900/75">
                    We tried to send a confirmation link to{" "}
                    <span className="font-semibold break-words">{data.email}</span>{" "}
                    but couldn&apos;t reach the mail server just now. You can still{" "}
                    <Link
                      href="/contact"
                      className="font-semibold text-green-800 underline hover:text-gold-600"
                    >
                      contact the General Secretary
                    </Link>{" "}
                    to confirm your details.
                  </p>
                )}

                {verifyUrl && (
                  <div className="mt-5 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Dev shortcut
                    </div>
                    <p className="mt-1 text-sm text-amber-900/80">
                      Skip the inbox and confirm directly (shown in development
                      only):
                    </p>
                    <a
                      href={verifyUrl}
                      className="mt-3 inline-flex rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-500"
                    >
                      Confirm email now →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-green-900/10 bg-white p-8 sm:p-10">
            <h2 className="font-display text-xl font-semibold text-green-950">
              What happens next
            </h2>
            <ol className="mt-5 space-y-4 text-[15px] leading-relaxed text-green-900/80">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-900 font-display text-xs font-semibold text-gold-400">
                  1
                </span>
                <span>
                  You confirm your email using the link above. Your application
                  only enters the review queue once it&apos;s confirmed.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-900 font-display text-xs font-semibold text-gold-400">
                  2
                </span>
                <span>
                  The Executive Council reviews your application against the
                  professional criteria in Article 6.1 of the Constitution.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-900 font-display text-xs font-semibold text-gold-400">
                  3
                </span>
                <span>
                  You receive an email with the outcome. If approved, the email
                  includes a secure link to pay the annual membership fee.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-900 font-display text-xs font-semibold text-gold-400">
                  4
                </span>
                <span>
                  Once payment is received, your account activates and you set
                  your own password via a secure link &mdash; shown on screen
                  and emailed &mdash; then sign in.
                </span>
              </li>
            </ol>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full bg-gold-500 px-7 py-3 text-sm font-semibold text-green-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
              >
                Back to Home
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-green-900/20 px-7 py-3 text-sm font-semibold text-green-900 transition-colors hover:border-green-700"
              >
                Learn About WPN
              </Link>
              {isDev && (
                <button
                  type="button"
                  onClick={submitAnotherTest}
                  className="ml-auto rounded-full border border-dashed border-amber-400 bg-amber-50 px-5 py-3 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                  title="Dev only — resets form with fresh random test data and jumps to Review"
                >
                  Dev · Submit Another Test
                </button>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="bg-green-950 pb-10 pt-32 texture-grain">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Membership Application
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold text-cream sm:text-5xl">
            Join the <span className="italic text-gold-400">Network</span>
          </h1>
        </div>
      </section>

      {/* Scroll target — clicking Next/Back scrolls here so the form is in view */}
      <div ref={formTopRef} aria-hidden className="scroll-mt-20" />

      {/* Progress bar */}
      <div className="sticky top-18 z-40 border-b border-green-900/10 bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-green-900/50">
                Step {step + 1} of {STEPS.length}
              </div>
              <div className="mt-0.5 truncate text-sm font-semibold text-green-950">
                {STEPS[step]}
              </div>
            </div>
            <div className="flex flex-none items-center gap-1.5">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                      i < step
                        ? "bg-green-900 text-gold-400"
                        : i === step
                        ? "bg-gold-500 text-green-950 ring-2 ring-gold-500/30 ring-offset-1"
                        : "bg-green-900/10 text-green-900/40"
                    }`}
                    aria-label={s}
                    title={s}
                  >
                    {i < step ? (
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-px w-3 flex-none sm:w-5 ${
                        i < step ? "bg-green-900" : "bg-green-900/15"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 h-1 rounded-full bg-green-900/10">
            <div
              className="h-1 rounded-full bg-gold-500 transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Dev-only autofill — never shipped to production */}
        {isDev && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm">
            <div className="flex items-center gap-2 text-amber-900">
              <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                Dev
              </span>
              <span>Fast-fill the form with random test data.</span>
            </div>
            <button
              type="button"
              onClick={fillTestData}
              className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500"
            >
              Fill Test Data
            </button>
          </div>
        )}

        {step < STEPS.length - 1 && (
          <p className="mb-8 text-sm text-green-900/60">
            <span className="text-red-500">*</span> Indicates required question
          </p>
        )}

        {errors.length > 0 && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <ul className="space-y-1">
              {errors.map((e) => (
                <li key={e} className="text-sm text-red-700">{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Section A ── */}
        {step === 0 && (
          <div className="rounded-2xl border border-green-900/10 bg-white p-6 sm:p-8">
            <div className="mb-6 rounded-xl bg-green-900 px-6 py-3 text-center font-semibold text-cream">
              Section A: Personal Details
            </div>
            <div className="space-y-6">
              <div>
                <label className={lbl}>Full Name {req}</label>
                <input
                  className={inp}
                  placeholder="Your answer"
                  value={data.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                />
              </div>
              <div>
                <label className={lbl}>Title {req}</label>
                <div className="space-y-3">
                  {TITLES.map((t) => (
                    <label key={t} className="flex cursor-pointer items-center gap-3">
                      <input
                        type="radio"
                        name="title"
                        value={t}
                        checked={data.title === t}
                        onChange={() => set("title", t)}
                        className="h-4 w-4 accent-green-900"
                      />
                      <span className="text-[15px] text-green-900/80">{t}</span>
                      {t === "Other" && data.title === "Other" && (
                        <input
                          className="ml-2 flex-1 border-b border-green-900/20 bg-transparent pb-1 text-[15px] text-green-950 outline-none focus:border-gold-500"
                          placeholder="Please specify"
                          value={data.titleOther}
                          onChange={(e) => set("titleOther", e.target.value)}
                        />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Section B ── */}
        {step === 1 && (
          <div className="rounded-2xl border border-green-900/10 bg-white p-6 sm:p-8">
            <div className="mb-6 rounded-xl bg-green-900 px-6 py-3 text-center font-semibold text-cream">
              Section B: Contact Details
            </div>
            <div className="space-y-6">
              <div>
                <label className={lbl}>Gender {req}</label>
                <select className={inp} value={data.gender} onChange={(e) => set("gender", e.target.value)}>
                  <option value="">Choose</option>
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className={lbl}>Date of Birth (day and month only) {req}</label>
                <div className="grid grid-cols-2 gap-3">
                  <select className={inp} value={data.dobDay} onChange={(e) => set("dobDay", e.target.value)}>
                    <option value="">Day</option>
                    {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select className={inp} value={data.dobMonth} onChange={(e) => set("dobMonth", e.target.value)}>
                    <option value="">Month</option>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={lbl}>Mobile Numbers {req}</label>
                <input
                  className={inp}
                  placeholder="+233 20 000 0000"
                  value={data.mobileNumbers}
                  onChange={(e) => set("mobileNumbers", e.target.value)}
                />
                <p className="mt-1.5 text-xs text-green-900/50">
                  Digits only — may include +, spaces, or dashes (e.g. +233 20 000 0000)
                </p>
              </div>

              <div>
                <label className={lbl}>Email Address {req}</label>
                <input
                  type="email"
                  className={inp}
                  placeholder="you@example.com"
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              <div>
                <label className={lbl}>Postal Address {req}</label>
                <input
                  className={inp}
                  placeholder="Your answer"
                  value={data.postalAddress}
                  onChange={(e) => set("postalAddress", e.target.value)}
                />
              </div>
              <div>
                <label className={lbl}>City/Town of Residence {req}</label>
                <input
                  className={inp}
                  placeholder="Your answer"
                  value={data.cityTown}
                  onChange={(e) => set("cityTown", e.target.value)}
                />
              </div>
              <div>
                <label className={lbl}>Country of Residence {req}</label>
                <select className={inp} value={data.countryOfResidence} onChange={(e) => set("countryOfResidence", e.target.value)}>
                  <option value="">Choose a country</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Section C ── */}
        {step === 2 && (
          <div className="rounded-2xl border border-green-900/10 bg-white p-6 sm:p-8">
            <div className="mb-6 rounded-xl bg-green-900 px-6 py-3 text-center font-semibold text-cream">
              Section C: Origin &amp; Community Affiliation
            </div>
            <div className="space-y-6">
              <div>
                <label className={lbl}>Home Country {req}</label>
                <select className={inp} value={data.homeCountry} onChange={(e) => set("homeCountry", e.target.value)}>
                  <option value="">Choose a country</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Hometown {req}</label>
                <input className={inp} placeholder="Your answer" value={data.hometown} onChange={(e) => set("hometown", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Father&apos;s Hometown {req}</label>
                <input className={inp} placeholder="Your answer" value={data.fatherHometown} onChange={(e) => set("fatherHometown", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Father&apos;s Ethnic Group / Tribe</label>
                <input className={inp} placeholder="Your answer" value={data.fatherEthnicGroup} onChange={(e) => set("fatherEthnicGroup", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Mother&apos;s Hometown</label>
                <input className={inp} placeholder="Your answer" value={data.motherHometown} onChange={(e) => set("motherHometown", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Mother&apos;s Ethnic Group / Tribe</label>
                <input className={inp} placeholder="Your answer" value={data.motherEthnicGroup} onChange={(e) => set("motherEthnicGroup", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ── Section D ── */}
        {step === 3 && (
          <div className="rounded-2xl border border-green-900/10 bg-white p-6 sm:p-8">
            <div className="mb-6 rounded-xl bg-green-900 px-6 py-3 text-center font-semibold text-cream">
              Section D: Professional Profile
            </div>
            <div className="space-y-6">
              <div>
                <label className={lbl}>Occupation / Profession {req}</label>
                <input className={inp} placeholder="Your answer" value={data.occupation} onChange={(e) => set("occupation", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Current Place of Work {req}</label>
                <input className={inp} placeholder="Your answer" value={data.currentWorkplace} onChange={(e) => set("currentWorkplace", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Job Title / Position {req}</label>
                <input className={inp} placeholder="Your answer" value={data.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Educational Background (tick all that apply) {req}</label>
                <div className="space-y-3">
                  {EDUCATION_OPTIONS.map((opt) => (
                    <label key={opt} className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={data.educationalBackground.includes(opt)}
                        onChange={() => toggleArray("educationalBackground", opt)}
                        className="h-4 w-4 accent-green-900"
                      />
                      <span className="text-[15px] text-green-900/80">{opt}</span>
                      {opt === "Other" &&
                        data.educationalBackground.includes("Other") && (
                          <input
                            className="ml-2 flex-1 border-b border-green-900/20 bg-transparent pb-1 text-[15px] text-green-950 outline-none focus:border-gold-500"
                            placeholder="e.g. ACCA, Chartered Accountant, PhD…"
                            value={data.educationalBackgroundOther}
                            onChange={(e) =>
                              set("educationalBackgroundOther", e.target.value)
                            }
                          />
                        )}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className={lbl}>
                  Work Experience (positions held, companies worked for and dates) {req}
                </label>
                <textarea
                  className={`${inp} min-h-30 resize-y`}
                  placeholder="Your answer"
                  value={data.workExperience}
                  onChange={(e) => set("workExperience", e.target.value)}
                />
              </div>
              <div>
                <label className={lbl}>Areas of Interest and Engagement (tick all that apply) {req}</label>
                <div className="space-y-3">
                  {INTEREST_OPTIONS.map((opt) => (
                    <label key={opt} className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={data.areasOfInterest.includes(opt)}
                        onChange={() => toggleArray("areasOfInterest", opt)}
                        className="h-4 w-4 accent-green-900"
                      />
                      <span className="text-[15px] text-green-900/80">{opt}</span>
                      {opt === "Other" && data.areasOfInterest.includes("Other") && (
                        <input
                          className="ml-2 flex-1 border-b border-green-900/20 bg-transparent pb-1 text-[15px] text-green-950 outline-none focus:border-gold-500"
                          placeholder="Please specify"
                          value={data.areasOfInterestOther}
                          onChange={(e) => set("areasOfInterestOther", e.target.value)}
                        />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Section E ── */}
        {step === 4 && (
          <div className="rounded-2xl border border-green-900/10 bg-white p-6 sm:p-8">
            <div className="mb-6 rounded-xl bg-green-900 px-6 py-3 text-center font-semibold text-cream">
              Section E: Next of Kin Information
            </div>
            <div className="space-y-6">
              <div>
                <label className={lbl}>Full Name {req}</label>
                <input className={inp} placeholder="Your answer" value={data.nextOfKinName} onChange={(e) => set("nextOfKinName", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Relationship {req}</label>
                <select className={inp} value={data.nextOfKinRelationship} onChange={(e) => set("nextOfKinRelationship", e.target.value)}>
                  <option value="">Choose</option>
                  {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Contact of Next of Kin {req}</label>
                <input
                  className={inp}
                  placeholder="+233 20 000 0000"
                  value={data.nextOfKinContact}
                  onChange={(e) => set("nextOfKinContact", e.target.value)}
                />
                <p className="mt-1.5 text-xs text-green-900/50">
                  Digits only — may include +, spaces, or dashes
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Review ── */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-green-900/10 bg-white p-6 sm:p-8">
              <div className="mb-2 rounded-xl bg-green-900 px-6 py-3 text-center font-semibold text-cream">
                Review Your Application
              </div>
              <p className="mt-4 text-center text-sm text-green-900/60">
                Please review everything carefully. Use <span className="font-semibold text-gold-600">Edit</span> to go back and change any section.
              </p>
            </div>

            <ReviewSection title="A — Personal Details" onEdit={() => goToStep(0)}>
              <ReviewRow label="Full Name" value={data.fullName} />
              <ReviewRow label="Title" value={data.title === "Other" ? data.titleOther : data.title} />
            </ReviewSection>

            <ReviewSection title="B — Contact Details" onEdit={() => goToStep(1)}>
              <ReviewRow label="Gender" value={data.gender} />
              <ReviewRow label="Date of Birth" value={data.dobDay && data.dobMonth ? `${data.dobDay} ${data.dobMonth}` : ""} />
              <ReviewRow label="Mobile Numbers" value={data.mobileNumbers} />
              <ReviewRow label="Email Address" value={data.email} />
              <ReviewRow label="Postal Address" value={data.postalAddress} />
              <ReviewRow label="City / Town" value={data.cityTown} />
              <ReviewRow label="Country of Residence" value={data.countryOfResidence} />
            </ReviewSection>

            <ReviewSection title="C — Origin & Community" onEdit={() => goToStep(2)}>
              <ReviewRow label="Home Country" value={data.homeCountry} />
              <ReviewRow label="Hometown" value={data.hometown} />
              <ReviewRow label="Father's Hometown" value={data.fatherHometown} />
              <ReviewRow label="Father's Ethnic Group" value={data.fatherEthnicGroup} />
              <ReviewRow label="Mother's Hometown" value={data.motherHometown} />
              <ReviewRow label="Mother's Ethnic Group" value={data.motherEthnicGroup} />
            </ReviewSection>

            <ReviewSection title="D — Professional Profile" onEdit={() => goToStep(3)}>
              <ReviewRow label="Occupation" value={data.occupation} />
              <ReviewRow label="Current Workplace" value={data.currentWorkplace} />
              <ReviewRow label="Job Title" value={data.jobTitle} />
              <ReviewRow
                label="Education"
                value={[
                  ...data.educationalBackground.filter((v) => v !== "Other"),
                  ...(data.educationalBackground.includes("Other") &&
                  data.educationalBackgroundOther
                    ? [`Other: ${data.educationalBackgroundOther}`]
                    : []),
                ]}
              />
              <ReviewRow label="Work Experience" value={data.workExperience} />
              <ReviewRow
                label="Areas of Interest"
                value={[
                  ...data.areasOfInterest.filter((v) => v !== "Other"),
                  ...(data.areasOfInterest.includes("Other") && data.areasOfInterestOther
                    ? [`Other: ${data.areasOfInterestOther}`]
                    : []),
                ]}
              />
            </ReviewSection>

            <ReviewSection title="E — Next of Kin" onEdit={() => goToStep(4)}>
              <ReviewRow label="Full Name" value={data.nextOfKinName} />
              <ReviewRow label="Relationship" value={data.nextOfKinRelationship} />
              <ReviewRow label="Contact" value={data.nextOfKinContact} />
            </ReviewSection>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={back}
              className="rounded-full border border-green-900/20 px-7 py-3 text-sm font-semibold text-green-900 transition-all hover:border-green-900/40 hover:bg-green-900/5"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={next}
            disabled={submitting}
            className="flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3 text-sm font-semibold text-green-950 shadow-lg shadow-gold-500/20 transition-all hover:-translate-y-0.5 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {step === STEPS.length - 1 ? (
              submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-950/30 border-t-green-950" />
                  Submitting…
                </>
              ) : (
                "Submit Application"
              )
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
