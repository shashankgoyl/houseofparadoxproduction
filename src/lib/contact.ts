// Shared between the contact form (browser) and the API route (server).

export const SERVICES = [
  "Photography",
  "Video Production",
  "Podcast Production",
  "Event Coverage",
  "Creative Direction",
  "Content Creation",
] as const;

export const LIMITS = { name: 100, email: 200, message: 5000 } as const;

export type ContactInput = {
  name: string;
  email: string;
  service: string;
  message: string;
};

export type ContactPayload = ContactInput & {
  /** Honeypot: real people never see or fill this field. */
  website?: string;
  /** Milliseconds the visitor spent on the form before submitting. */
  elapsedMs?: number;
  /** Page the form was submitted from. */
  pageUrl?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns cleaned values, or an error message for the visitor. */
export function validateContact(
  raw: Partial<ContactInput>
): { ok: true; data: ContactInput } | { ok: false; error: string } {
  const name = String(raw.name ?? "").trim();
  const email = String(raw.email ?? "").trim().toLowerCase();
  const service = String(raw.service ?? "").trim();
  const message = String(raw.message ?? "").trim();

  if (!name || name.length > LIMITS.name) return { ok: false, error: "Please enter your name." };
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email)
    return { ok: false, error: "Please enter a valid email address." };
  if (service && !(SERVICES as readonly string[]).includes(service))
    return { ok: false, error: "Please choose a service from the list." };
  if (!message) return { ok: false, error: "Please tell us a little about your project." };
  if (message.length > LIMITS.message)
    return { ok: false, error: `Please keep your message under ${LIMITS.message} characters.` };

  return { ok: true, data: { name, email, service, message } };
}
