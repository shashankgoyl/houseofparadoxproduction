import { NextResponse } from "next/server";
import { validateContact, type ContactPayload } from "@/lib/contact";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase-server";
import { isEmailConfigured, sendContactNotification } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 2500; // humans take longer than this to fill the form

/** Netlify adds visitor geo info in a base64 JSON header. */
function countryFrom(req: Request): string | undefined {
  const raw = req.headers.get("x-nf-geo");
  if (!raw) return undefined;
  try {
    const geo = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    return [geo?.city, geo?.country?.name].filter(Boolean).join(", ") || undefined;
  } catch {
    return undefined;
  }
}

export async function POST(req: Request) {
  let payload: ContactPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Spam checks: pretend success so bots don't learn anything.
  if (payload.website || (typeof payload.elapsedMs === "number" && payload.elapsedMs < MIN_FILL_MS)) {
    return NextResponse.json({ ok: true });
  }

  const result = validateContact(payload);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  const data = result.data;

  const supabaseOn = isSupabaseConfigured();
  const emailOn = isEmailConfigured();
  if (!supabaseOn && !emailOn) {
    console.error("[contact] Neither Supabase nor email is configured — enquiry not saved:", data.email);
    return NextResponse.json({ ok: false, error: "The form is not set up yet." }, { status: 503 });
  }

  const submittedAt =
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) + " IST";
  const pageUrl = typeof payload.pageUrl === "string" ? payload.pageUrl.slice(0, 500) : undefined;
  const country = countryFrom(req);
  const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;

  // Run both side by side; succeed if at least one worked so no lead is lost.
  const [saved, emailed] = await Promise.allSettled([
    supabaseOn
      ? getSupabaseAdmin()
          .from("contact_submissions")
          .insert({
            name: data.name,
            email: data.email,
            service: data.service || null,
            message: data.message,
            page_url: pageUrl ?? null,
            country: country ?? null,
            user_agent: userAgent,
          })
          .then(({ error }) => {
            if (error) throw error;
          })
      : Promise.reject(new Error("skipped")),
    emailOn
      ? sendContactNotification(data, { pageUrl, country, submittedAt })
      : Promise.reject(new Error("skipped")),
  ]);

  if (supabaseOn && saved.status === "rejected") console.error("[contact] Supabase insert failed:", saved.reason);
  if (emailOn && emailed.status === "rejected") console.error("[contact] Email failed:", emailed.reason);

  if (saved.status === "fulfilled" || emailed.status === "fulfilled") {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json(
    { ok: false, error: "Sorry, something went wrong on our side." },
    { status: 500 }
  );
}
