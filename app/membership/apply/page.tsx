"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STEPS = [
  "Personal Details",
  "Contact Details",
  "Origin & Community",
  "Professional Profile",
  "Next of Kin",
  "Review",
];

const TITLES = ["Mr.", "Mrs.", "Dr.", "Professor", "Other"];
const GENDERS = ["Male", "Female", "Prefer not to say"];
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
  "United Kingdom", "United States", "Canada", "Australia", "Germany",
  "Netherlands", "Italy", "France", "Spain", "Belgium", "Sweden",
  "Norway", "Denmark", "Switzerland", "Austria",
  "Nigeria", "South Africa", "Kenya", "Côte d'Ivoire", "Senegal",
  "Togo", "Benin", "Cameroon", "Ethiopia", "Tanzania", "Uganda",
  "Rwanda", "Zambia", "Zimbabwe", "Mozambique", "Namibia", "Botswana",
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina",
  "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belize",
  "Bolivia", "Bosnia and Herzegovina", "Brazil", "Brunei", "Bulgaria",
  "Cambodia", "Chile", "China", "Colombia", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "DR Congo", "Ecuador", "Egypt", "Estonia",
  "Finland", "Georgia", "Greece", "Guatemala", "Honduras", "Hungary",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Japan",
  "Jordan", "Kazakhstan", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg", "Malaysia",
  "Malta", "Mexico", "Moldova", "Mongolia", "Morocco", "Myanmar",
  "Nepal", "New Zealand", "North Macedonia", "Oman", "Pakistan",
  "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Saudi Arabia", "Serbia", "Singapore",
  "Slovakia", "Slovenia", "Somalia", "South Korea", "Sri Lanka",
  "Sudan", "Syria", "Taiwan", "Tajikistan", "Thailand", "Tunisia",
  "Turkey", "Turkmenistan", "Ukraine", "United Arab Emirates", "Uruguay",
  "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Other",
];
const EDUCATION_OPTIONS = [
  "Certificate", "Degree", "Diploma", "Masters Degree", "Doctorate Degree",
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    // Review step submits directly
    if (step === STEPS.length - 1) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const errs = validate(step, data);
    if (errs.length) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors([]);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setErrors([]);
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-cream">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-6 pb-16 pt-32">
          <div className="w-full max-w-lg text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-900">
              <svg className="h-10 w-10 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-semibold text-green-950 sm:text-4xl">
              Application Submitted
            </h1>
            <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-green-900/70">
              Thank you for taking the time to complete this form. The WPN
              Executive Council will review your application within 30 days and
              be in touch.
            </p>
          </div>
        </div>
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

      {/* Progress bar */}
      <div className="sticky top-18 z-40 border-b border-green-900/10 bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-none items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    i < step
                      ? "bg-green-900 text-gold-400"
                      : i === step
                      ? "bg-gold-500 text-green-950"
                      : "bg-green-900/10 text-green-900/40"
                  }`}
                >
                  {i < step ? (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`whitespace-nowrap text-xs font-medium ${i === step ? "text-green-950" : "text-green-900/50"}`}>
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-6 flex-none ${i < step ? "bg-green-900" : "bg-green-900/15"}`} />
                )}
              </div>
            ))}
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
              <ReviewRow label="Education" value={data.educationalBackground} />
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
            className="rounded-full bg-gold-500 px-7 py-3 text-sm font-semibold text-green-950 shadow-lg shadow-gold-500/20 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
          >
            {step === STEPS.length - 1 ? "Submit Application" : "Next"}
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
