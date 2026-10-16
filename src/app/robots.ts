import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Search engines and AI answer engines are explicitly welcome, so the studio
// can be found and cited in Google, Bing, ChatGPT, Perplexity, Gemini, Claude, etc.
const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Google-Extended", // Gemini / AI Overviews grounding
  "Bingbot", // also powers ChatGPT search and Copilot
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Applebot",
  "Applebot-Extended",
  "DuckDuckBot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/", disallow: "/api/" },
      { userAgent: "*", allow: "/", disallow: "/api/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
