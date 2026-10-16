# House of Paradox — setup guide

Next.js 16 · React 19 · Tailwind CSS 3 · Framer Motion · Supabase · Resend · Netlify

## Run it on your computer

Requires Node.js 20.9 or newer (`node -v`).

```powershell
npm install
npm run dev        # http://localhost:3000
npm run build      # production build check
npm run lint
```

Credentials go in `.env.local` (never committed). Create it once with `Copy-Item .env.example .env.local`, then fill it in. `.env.example` explains every variable.

## 1. Supabase: store every enquiry

1. ✅ Already done: the `contact_submissions` table exists in the **HOP** project (`supabase/contact_submissions.sql` is kept for reference).
2. Project Settings → **API Keys**: copy the **Project URL** into `SUPABASE_URL`, and the **secret** key (`sb_secret_…`, or the legacy `service_role` key) into `SUPABASE_SECRET_KEY`.
3. Enquiries appear in **Table Editor → contact_submissions**. Use the `status` column (`new`, `contacted`, `won`, `lost`, `spam`) and `notes` to track leads.

The table has row-level security on and no public policies, so only the website's server can write to it and nobody can read it from the browser.

## 2. Email notification for every enquiry (Resend)

Already set up in Resend:
- Domain **houseofparadoxproduction.com** added (region ap-northeast-1, no tracking).
- Send-only API key **houseofparadox-website-contact-form**, restricted to that domain → put it in `RESEND_API_KEY`.
- Emails go **to** tushar@houseofparadoxproduction.com and come **from** `website@houseofparadoxproduction.com` (both set in `src/config/site.ts`).

DNS is on Namecheap (BasicDNS, Mail Settings = Custom MX). ✅ All records added:
- Mailbox (Private Email): MX `@` → mx1/mx2.privateemail.com, SPF TXT `@` `v=spf1 include:spf.privateemail.com ~all`, DKIM `privateemail._domainkey`.
- Resend: DKIM `resend._domainkey`, MX + SPF TXT on `send`, CNAME `rsend`.
- DMARC `_dmarc` `v=DMARC1; p=none;` (monitoring only).

Full list for reference:

| Type | Name / Host | Value | Priority |
|---|---|---|---|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDRUnJ3HuMzAOhnKtE0cfed/DK6EqnUvfkBwvjnR+s8DLqoKPRiDLFQTFdMRXu1E2HG90mvI9cd8icfH94OFB1UEOSk571oDQX8vDidsdtFpTsup30R9X/61imnqLDMkR4NNFlTSy+wWD0p1HeaL6ZEFAGgrnkAEGfobz7LaP506wIDAQAB` | |
| MX | `send` | `feedback-smtp.ap-northeast-1.amazonses.com` | 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | |
| CNAME | `rsend` | `send.forge.rmta.net` | |
| TXT (recommended) | `_dmarc` | `v=DMARC1; p=none;` | |

These records live on the `send` / `rsend` / `resend._domainkey` subdomains, so they don't affect your normal mailbox for @houseofparadoxproduction.com.
Until the domain shows **Verified**, emails can't send; enquiries are still saved in Supabase.

Hitting **Reply** on a notification replies straight to the visitor.

If Supabase or email fails, the other one still captures the lead. The visitor only sees an error if both fail.

## 3. Netlify (live site)

✅ `SUPABASE_URL`, `SUPABASE_SECRET_KEY` and `RESEND_API_KEY` are set on the Netlify project (keys marked secret).
Netlify builds from GitHub (`shashankgoyl/houseofparadoxproduction`, branch `main`), so publish changes with:

```powershell
git add -A
git commit -m "Update site"
git push
```
`.env.local` is not uploaded, so the live site only sees what you add in Netlify.

## 4. Analytics (optional, all free)

| Tool | What you get | Variable |
|---|---|---|
| Google Analytics 4 | Visitors, cities and countries, devices, traffic sources, pages, and form enquiries as conversions (`generate_lead`) | `NEXT_PUBLIC_GA_ID` (G-XXXXXXX) |
| Microsoft Clarity | Heatmaps, session recordings, rage clicks, scroll depth | `NEXT_PUBLIC_CLARITY_ID` |
| Google Search Console | Google searches that show your site, rankings, indexing problems | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (or verify by DNS) |

Each one stays off until its variable is set. After adding Search Console, submit `https://houseofparadoxproduction.com/sitemap.xml` there.

## Things to fill in

- `src/config/site.ts` → social profile URLs (icons stay hidden until set).
- Real portfolio images (Work section) and real testimonials/stats.

## 5. AEO / GEO: being found and quoted by Google and AI assistants

Already built into the site:
- **FAQ section** (`src/content/faqs.ts`) with self-contained answers, also published as FAQPage data.
- **Connected schema.org graph**: business, founder (Tushar), website, page, 6 services and FAQs.
- **`/llms.txt`**: a plain-text summary for AI assistants, generated from the same data.
- **robots.txt** explicitly allows Google, Bing, ChatGPT, Perplexity, Claude, Gemini, Apple and Meta crawlers.
- Local signals: Delhi / IN-DL geo tags, local keywords, areaServed.

Off-site steps that matter most (only you can do these):
1. **Google Business Profile** (business.google.com): the biggest factor for "photographer near me" and Maps. Use the exact same name, phone and website as the site.
2. **Bing Webmaster Tools** (bing.com/webmasters): import from Search Console and submit the sitemap. ChatGPT search and Copilot draw on Bing's index.
3. **Google Search Console**: submit `/sitemap.xml`.
4. Fill in the social URLs in `src/config/site.ts`. They become `sameAs` links that tie your profiles to one entity.
5. Collect **real Google reviews**, and get listed on directories (Justdial, WedMeGood, Sulekha) with identical name, phone and website.
6. Add FAQs with your **real price ranges and turnaround times**. AI answers favour concrete numbers.
