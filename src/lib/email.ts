import { formatShootDate, type ContactInput } from "@/lib/contact";
import { siteConfig, whatsappUrl } from "@/config/site";

// SERVER ONLY. Sends emails through Resend's HTTP API
// (https://resend.com/docs/api-reference/emails/send-email). No SDK needed.
//   1. sendContactNotification → the full brief, to Tushar
//   2. sendAutoReply           → a branded thank-you, to the visitor

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function sendViaResend(payload: Record<string, unknown>) {
  if (!isEmailConfigured()) throw new Error("Email is not configured: set RESEND_API_KEY");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`);
}

/** Email-safe table rows: [label, value, isHtml?] */
function rowsHtml(rows: [string, string, boolean?][]) {
  return rows
    .map(
      ([k, v, raw]) =>
        `<tr><td style="padding:7px 12px 7px 0;color:#777777;width:120px;vertical-align:top;font-size:13px;font-family:Arial,Helvetica,sans-serif">${k}</td>` +
        `<td style="padding:7px 0;color:#1a1a1a;font-size:14px;font-family:Arial,Helvetica,sans-serif">${raw ? v : esc(v)}</td></tr>`
    )
    .join("");
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Notification to Tushar
// ─────────────────────────────────────────────────────────────────────────────
export async function sendContactNotification(
  data: ContactInput,
  meta: { pageUrl?: string; country?: string; submittedAt: string }
) {
  const to = (process.env.CONTACT_NOTIFY_TO || siteConfig.notifyEmail)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_EMAIL_FROM || siteConfig.senderEmail;
  const when = formatShootDate(data);
  const phoneDigits = data.phone.replace(/[^\d+]/g, "");
  const waDigits = phoneDigits.replace(/^\+/, "").replace(/^0/, "91");

  const rows: [string, string, boolean?][] = [
    ["Name", data.name],
    ["Email", `<a href="mailto:${esc(data.email)}" style="color:#B8960C">${esc(data.email)}</a>`, true],
    ...(data.phone
      ? ([
          [
            "Phone",
            `<a href="tel:${esc(phoneDigits)}" style="color:#B8960C">${esc(data.phone)}</a>` +
              (waDigits.length >= 10 ? ` &nbsp;·&nbsp; <a href="https://wa.me/${esc(waDigits)}" style="color:#1e9e52">WhatsApp</a>` : ""),
            true,
          ],
        ] as [string, string, boolean][])
      : []),
    ...(data.company ? ([["Brand", data.company]] as [string, string][]) : []),
    ["Service", data.service],
    ["Date", when],
    ["City", data.city],
    ["Budget", data.budget],
    ["Submitted", meta.submittedAt],
    ...(meta.country ? ([["Visitor from", meta.country]] as [string, string][]) : []),
  ];

  const links = data.referenceLinks.length
    ? `<h3 style="margin:22px 0 8px;font-size:15px;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">References / mood board</h3>` +
      data.referenceLinks
        .map((l) => `<div style="margin:0 0 6px;font-size:14px;font-family:Arial,Helvetica,sans-serif"><a href="${esc(l)}" style="color:#B8960C;word-break:break-all">${esc(l)}</a></div>`)
        .join("")
    : "";

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f2ec">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f2ec"><tr><td align="center" style="padding:24px 12px">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e6dfc9">
<tr><td bgcolor="#0D0D0D" style="background-color:#0D0D0D;padding:18px 24px;font-family:Georgia,serif;color:#D4AF37;font-size:18px;letter-spacing:3px">NEW ENQUIRY &nbsp;·&nbsp; ${esc(data.service.toUpperCase())}</td></tr>
<tr><td style="padding:22px 24px">
<table width="100%" cellpadding="0" cellspacing="0" border="0">${rowsHtml(rows)}</table>
<h3 style="margin:22px 0 8px;font-size:15px;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">Brief</h3>
<div style="white-space:pre-wrap;background-color:#f7f5ef;border-left:3px solid #D4AF37;padding:12px 16px;font-size:14px;line-height:21px;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">${esc(data.message)}</div>
${links}
<p style="margin:24px 0 0;font-size:12px;line-height:18px;color:#888888;font-family:Arial,Helvetica,sans-serif">Reply to this email to answer ${esc(data.name)} directly. Saved in Supabase → contact_submissions.</p>
</td></tr></table></td></tr></table></body></html>`;

  const text = [
    `New enquiry: ${data.service}`,
    "",
    ...rows.map(([k, v, raw]) => `${k}: ${raw ? v.replace(/<[^>]+>/g, "").replace(/&nbsp;·&nbsp;/g, " · ") : v}`),
    "",
    "Brief:",
    data.message,
    ...(data.referenceLinks.length ? ["", "References:", ...data.referenceLinks] : []),
  ].join("\n");

  await sendViaResend({
    from,
    to,
    reply_to: data.email,
    subject: `New enquiry: ${data.service} · ${data.budget} · ${data.name}`,
    html,
    text,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Auto-reply to the visitor
// ─────────────────────────────────────────────────────────────────────────────

// Anyone can type any address into a form, so the auto-reply must never carry
// free text a stranger could use to spam someone. It only repeats the options
// picked from fixed lists, plus a cleaned-up first name and city.
const looksLikeLink = /(https?:|www\.|\.[a-z]{2,}\b|@|\/)/i;
function safeFirstName(name: string) {
  const first = name.trim().split(/\s+/)[0] ?? "";
  const clean = first.replace(/[^\p{L}\p{M}'-]/gu, "").slice(0, 30);
  return clean && !looksLikeLink.test(first) ? clean : "there";
}
function safeCity(city: string) {
  const c = city.trim().slice(0, 40);
  return c && !looksLikeLink.test(c) ? c.replace(/[^\p{L}\p{M}\s,.'-]/gu, "") : "";
}

export async function sendAutoReply(data: ContactInput) {
  const first = safeFirstName(data.name);
  const city = safeCity(data.city);
  const when = formatShootDate(data);
  const wa = whatsappUrl(`Hi House of Paradox! I just sent a ${data.service.toLowerCase()} brief on your website.`);

  const summary: [string, string][] = [
    ["Service", data.service],
    ["Date", when],
    ...(city ? ([["City", city]] as [string, string][]) : []),
    ["Budget", data.budget],
  ];

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>Thanks for your brief</title></head>
<body style="margin:0;padding:0;background-color:#f4f2ec">
<div style="display:none;max-height:0;overflow:hidden">We've received your ${esc(data.service.toLowerCase())} brief. We'll be in touch within 24 hours.</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f2ec"><tr><td align="center" style="padding:24px 12px">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e6dfc9">

<tr><td align="center" bgcolor="#0D0D0D" style="background-color:#0D0D0D;padding:34px 24px 28px">
  <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:30px;letter-spacing:6px;color:#D4AF37">HOUSE <span style="font-size:14px;letter-spacing:4px;color:#8c8c8c">of</span> PARADOX</div>
  <div style="margin-top:10px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:4px;color:#B8960C">WHERE STYLE BECOMES STORY</div>
</td></tr>
<tr><td height="3" bgcolor="#D4AF37" style="background-color:#D4AF37;font-size:0;line-height:0">&nbsp;</td></tr>

<tr><td style="padding:32px 32px 8px">
  <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:30px;font-weight:normal;color:#1a1a1a">Thanks, ${esc(first)} — we've got your brief.</h1>
  <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#444444">Every great story starts with a conversation. ${esc(siteConfig.founderName)} and the team are reviewing your project and will get back to you <b>within 24 hours</b> with ideas, availability and next steps.</p>
</td></tr>

<tr><td style="padding:8px 32px 4px">
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:3px;color:#B8960C;margin:0 0 6px">YOUR BRIEF</div>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #eee6cf;border-bottom:1px solid #eee6cf">${rowsHtml(summary)}</table>
</td></tr>

<tr><td style="padding:26px 32px 6px">
  <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#444444">Can't wait, or want to share more references? Message us directly:</p>
  <table cellpadding="0" cellspacing="0" border="0"><tr>
    <td bgcolor="#25D366" style="background-color:#25D366;border-radius:24px">
      <a href="${esc(wa)}" style="display:inline-block;padding:13px 26px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#0D0D0D;text-decoration:none">Chat on WhatsApp</a>
    </td>
  </tr></table>
</td></tr>

<tr><td style="padding:24px 32px 30px">
  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#444444">Warm regards,<br><b>${esc(siteConfig.founderName)}</b><br><span style="color:#777777">${esc(siteConfig.founderRole)}, ${esc(siteConfig.name)}</span></p>
</td></tr>

<tr><td bgcolor="#0D0D0D" style="background-color:#0D0D0D;padding:20px 32px">
  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:#a3a3a3">
    <a href="tel:${esc(siteConfig.phone.replace(/\s+/g, ""))}" style="color:#D4AF37;text-decoration:none">${esc(siteConfig.phone)}</a> &nbsp;·&nbsp;
    <a href="${esc(siteConfig.url)}" style="color:#D4AF37;text-decoration:none">houseofparadoxproduction.com</a> &nbsp;·&nbsp; ${esc(siteConfig.location)}
  </p>
  <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;color:#777777">You're receiving this one-time confirmation because this address was used on the enquiry form at houseofparadoxproduction.com. If that wasn't you, you can ignore this email.</p>
</td></tr>

</table></td></tr></table></body></html>`;

  const text = [
    `Thanks, ${first} — we've got your brief.`,
    "",
    `${siteConfig.founderName} and the team are reviewing your project and will get back to you within 24 hours with ideas, availability and next steps.`,
    "",
    "Your brief:",
    ...summary.map(([k, v]) => `  ${k}: ${v}`),
    "",
    `Chat on WhatsApp: ${wa}`,
    "",
    `Warm regards,`,
    `${siteConfig.founderName}, ${siteConfig.founderRole}`,
    `${siteConfig.name} · ${siteConfig.phone} · ${siteConfig.url}`,
    "",
    "You're receiving this one-time confirmation because this address was used on the enquiry form at houseofparadoxproduction.com. If that wasn't you, you can ignore this email.",
  ].join("\n");

  await sendViaResend({
    from: siteConfig.autoReplyFrom,
    to: [data.email],
    reply_to: process.env.CONTACT_NOTIFY_TO?.split(",")[0]?.trim() || siteConfig.notifyEmail,
    subject: `Thanks, ${first} — we've got your brief | ${siteConfig.name}`,
    html,
    text,
    headers: { "Auto-Submitted": "auto-replied" },
  });
}
