import { NextResponse } from "next/server";
import { validateContact, type ContactPayload } from "@/lib/contact";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase-server";
import { isEmailConfigured, sendAutoReply, sendContactNotification } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 2500; // humans take longer than this to fill the form
const AUTO_REPLY_WINDOW_MIN = 15; // at most…
const AUTO_REPLY_MAX = 3; // …this many auto-replies per address in that window

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

  // 1) Save to Supabase (and count recent submissions from this address).
  const saveTask = (async () => {
    if (!supabaseOn) throw new Error("skipped");
    const db = getSupabaseAdmin();
    const since = new Date(Date.now() - AUTO_REPLY_WINDOW_MIN * 60_000).toISOString();
    const { count } = await db
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email)
      .gte("created_at", since);
    const { data: row, error } = await db
      .from("contact_submissions")
      .insert({
        name: data.name,
        email: data.email,
        service: data.service,
        message: data.message,
        phone: data.phone || null,
        company: data.company || null,
        shoot_date: data.shootDate || null,
        date_flexible: data.dateFlexible,
        city: data.city,
        budget: data.budget,
        reference_links: data.referenceLinks,
        page_url: pageUrl ?? null,
        country: country ?? null,
        user_agent: userAgent,
      })
      .select("id")
      .single();
    if (error) throw error;
    return { id: row?.id as string | undefined, recent: count ?? 0 };
  })();

  // 2) Notify Tushar (in parallel with the save).
  const notifyTask = emailOn
    ? sendContactNotification(data, { pageUrl, country, submittedAt })
    : Promise.reject(new Error("skipped"));

  const [saved, notified] = await Promise.allSettled([saveTask, notifyTask]);
  if (supabaseOn && saved.status === "rejected") console.error("[contact] Supabase insert failed:", saved.reason);
  if (emailOn && notified.status === "rejected") console.error("[contact] Notification email failed:", notified.reason);

  const captured = saved.status === "fulfilled" || notified.status === "fulfilled";
  if (!captured) {
    return NextResponse.json({ ok: false, error: "Sorry, something went wrong on our side." }, { status: 500 });
  }

  // 3) Thank-you email to the visitor (rate-limited per address).
  let autoReplied = false;
  const recent = saved.status === "fulfilled" ? saved.value.recent : 0;
  if (emailOn && recent < AUTO_REPLY_MAX) {
    try {
      await sendAutoReply(data);
      autoReplied = true;
    } catch (err) {
      console.error("[contact] Auto-reply failed:", err);
    }
  }
  if (autoReplied && saved.status === "fulfilled" && saved.value.id) {
    const { error } = await getSupabaseAdmin()
      .from("contact_submissions")
      .update({ auto_reply_sent: true })
      .eq("id", saved.value.id);
    if (error) console.error("[contact] Could not record auto-reply:", error);
  }

  return NextResponse.json({ ok: true, autoReplied });
}
