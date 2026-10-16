import type { ContactInput } from "@/lib/contact";
import { siteConfig } from "@/config/site";

// SERVER ONLY. Sends the "new enquiry" notification through Resend's HTTP API
// (https://resend.com/docs/api-reference/emails/send-email). No SDK needed.

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendContactNotification(
  data: ContactInput,
  meta: { pageUrl?: string; country?: string; submittedAt: string }
) {
  if (!isEmailConfigured()) throw new Error("Email is not configured: set RESEND_API_KEY");

  // Recipients: CONTACT_NOTIFY_TO if set (comma-separated), otherwise siteConfig.notifyEmail.
  const to = (process.env.CONTACT_NOTIFY_TO || siteConfig.notifyEmail)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_EMAIL_FROM || siteConfig.senderEmail;
  const service = data.service || "Not specified";

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Service", service],
    ["Submitted", meta.submittedAt],
    ...(meta.country ? ([["Country", meta.country]] as [string, string][]) : []),
    ...(meta.pageUrl ? ([["Page", meta.pageUrl]] as [string, string][]) : []),
  ];

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
    <h2 style="color:#B8960C;margin:0 0 16px">New enquiry from the website</h2>
    <table style="border-collapse:collapse;width:100%;font-size:14px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 12px 6px 0;color:#666;width:110px;vertical-align:top">${k}</td><td style="padding:6px 0">${escapeHtml(v)}</td></tr>`
        )
        .join("")}
    </table>
    <h3 style="margin:24px 0 8px;font-size:15px">Message</h3>
    <div style="white-space:pre-wrap;background:#f7f5ef;border-left:3px solid #D4AF37;padding:12px 16px;font-size:14px;line-height:1.5">${escapeHtml(data.message)}</div>
    <p style="margin-top:24px;font-size:12px;color:#888">Reply to this email to answer ${escapeHtml(data.name)} directly.</p>
  </div>`;

  const text = [
    "New enquiry from the website",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    data.message,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: data.email,
      subject: `New enquiry: ${service} — ${data.name}`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend error ${res.status}: ${await res.text()}`);
  }
}
