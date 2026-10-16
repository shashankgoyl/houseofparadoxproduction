import { siteConfig, activeSocials } from "@/config/site";
import { SERVICE_DETAILS } from "@/content/services";
import { FAQS } from "@/content/faqs";

// /llms.txt: a plain-language summary of the studio for AI assistants and
// answer engines (see https://llmstxt.org). Generated from the same data as the
// website, so it never drifts out of date. Built once at deploy time.
export const dynamic = "force-static";

export function GET() {
  const s = siteConfig;
  const lines = [
    `# ${s.name}`,
    "",
    `> ${s.description}`,
    "",
    `${s.name} ("${s.tagline}") is a creative production studio based in ${s.location}, founded by ${s.founderName} (${s.founderRole}).`,
    "",
    "## Contact",
    "",
    `- Website: ${s.url}`,
    `- Email: ${s.email}`,
    `- Phone: ${s.phone}`,
    `- Location: ${s.location}`,
    `- Enquiries: ${s.url}/#contact (replies within 24 hours)`,
    ...activeSocials.map((x) => `- ${x.label}: ${x.url}`),
    "",
    "## Services",
    "",
    ...SERVICE_DETAILS.map((x) => `- **${x.title}** (${x.subtitle}): ${x.description}`),
    "",
    "## Frequently asked questions",
    "",
    ...FAQS.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Pages",
    "",
    `- [Home](${s.url}/): services, about, portfolio, FAQ and contact form`,
    `- [Sitemap](${s.url}/sitemap.xml)`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
