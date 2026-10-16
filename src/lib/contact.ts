// Shared between the quote form (browser) and the API route (server).
import { BUDGETS, MAX_REFERENCE_LINKS } from "@/content/quote";

export const SERVICES = [
  "Photography",
  "Video Production",
  "Podcast Production",
  "Event Coverage",
  "Creative Direction",
  "Content Creation",
] as const;

export const LIMITS = {
  name: 100,
  email: 200,
  message: 5000,
  phone: 20,
  company: 100,
  city: 80,
  link: 500,
} as const;

export type ContactInput = {
  name: string;
  email: string;
  service: string;
  message: string;
  phone: string;
  company: string;
  /** YYYY-MM-DD, or "" when not decided */
  shootDate: string;
  dateFlexible: boolean;
  city: string;
  budget: string;
  referenceLinks: string[];
};

export type ContactPayload = Partial<Omit<ContactInput, "referenceLinks">> & {
  referenceLinks?: unknown;
  /** Honeypot: real people never see or fill this field. */
  website?: string;
  /** Milliseconds the visitor spent on the form before submitting. */
  elapsedMs?: number;
  /** Page the form was submitted from. */
  pageUrl?: string;
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Accepts http(s) URLs, and adds https:// to bare ones like "pinterest.com/board". */
export function normaliseLink(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  const withScheme = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(withScheme);
    if (!/^https?:$/.test(u.protocol) || !u.hostname.includes(".")) return null;
    return u.toString().slice(0, LIMITS.link);
  } catch {
    return null;
  }
}

/** Per-field checks, reused by the form for step-by-step validation. */
export const check = {
  service: (v: string) => ((SERVICES as readonly string[]).includes(v) ? "" : "Please choose what you need."),
  date: (v: string, flexible: boolean) => {
    if (flexible || !v) return flexible || v ? "" : "Pick a date, or tick “Dates are flexible”.";
    if (!DATE_RE.test(v) || Number.isNaN(Date.parse(v))) return "Please enter a valid date.";
    return "";
  },
  city: (v: string) => (v.trim() && v.trim().length <= LIMITS.city ? "" : "Please tell us the city."),
  budget: (v: string) => ((BUDGETS as readonly string[]).includes(v) ? "" : "Please choose a budget range."),
  message: (v: string) =>
    !v.trim()
      ? "Please tell us a little about your project."
      : v.length > LIMITS.message
        ? `Please keep it under ${LIMITS.message} characters.`
        : "",
  link: (v: string) => (!v.trim() || normaliseLink(v) ? "" : "That doesn't look like a valid link."),
  name: (v: string) => (v.trim() && v.trim().length <= LIMITS.name ? "" : "Please enter your name."),
  email: (v: string) =>
    EMAIL_RE.test(v.trim()) && v.trim().length <= LIMITS.email ? "" : "Please enter a valid email address.",
  phone: (v: string) => (!v.trim() || PHONE_RE.test(v.trim()) ? "" : "Please enter a valid phone number."),
  company: (v: string) => (v.trim().length <= LIMITS.company ? "" : "That's a bit long."),
};

/** Returns cleaned values, or the first error message for the visitor. */
export function validateContact(
  raw: ContactPayload
): { ok: true; data: ContactInput } | { ok: false; error: string } {
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const links = Array.isArray(raw.referenceLinks) ? raw.referenceLinks.map(str) : [];

  const data: ContactInput = {
    name: str(raw.name).trim(),
    email: str(raw.email).trim().toLowerCase(),
    service: str(raw.service).trim(),
    message: str(raw.message).trim(),
    phone: str(raw.phone).trim(),
    company: str(raw.company).trim(),
    shootDate: str(raw.shootDate).trim(),
    dateFlexible: raw.dateFlexible === true,
    city: str(raw.city).trim(),
    budget: str(raw.budget).trim(),
    referenceLinks: [],
  };
  if (data.dateFlexible) data.shootDate = "";

  if (links.length > MAX_REFERENCE_LINKS) return { ok: false, error: `Please add at most ${MAX_REFERENCE_LINKS} links.` };
  for (const l of links) {
    if (!l.trim()) continue;
    const n = normaliseLink(l);
    if (!n) return { ok: false, error: `This link isn't valid: ${l.slice(0, 60)}` };
    data.referenceLinks.push(n);
  }

  const errors = [
    check.service(data.service),
    check.date(data.shootDate, data.dateFlexible),
    check.city(data.city),
    check.budget(data.budget),
    check.message(data.message),
    check.name(data.name),
    check.email(data.email),
    check.phone(data.phone),
    check.company(data.company),
  ].filter(Boolean);
  if (errors.length) return { ok: false, error: errors[0] };

  return { ok: true, data };
}

/** "2026-11-20" → "20 Nov 2026" */
export function formatShootDate(d: ContactInput): string {
  if (d.dateFlexible || !d.shootDate) return "Flexible / not decided";
  const dt = new Date(`${d.shootDate}T00:00:00Z`);
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
