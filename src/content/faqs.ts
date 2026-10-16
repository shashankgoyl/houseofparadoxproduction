import { siteConfig } from "@/config/site";

// Questions people (and AI assistants like ChatGPT, Perplexity, Gemini and
// Google AI Overviews) actually ask. Each answer is written to stand on its own
// in 2–4 sentences so it can be quoted directly.
//
// Used by the FAQ section, the FAQPage structured data and /llms.txt.
// Only state facts that are true. TODO: add questions with your real
// price ranges and typical turnaround times; answer engines favour concrete numbers.

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "What is House of Paradox?",
    a: `House of Paradox is a luxury creative production studio based in Delhi, India, founded by ${siteConfig.founderName}. It offers photography, video production, podcast production, event coverage, creative direction and content creation for brands, designers and creators.`,
  },
  {
    q: "Where is House of Paradox located?",
    a: `House of Paradox is based in Delhi, India. To check availability for a shoot or event in your city, call ${siteConfig.phone} or email ${siteConfig.email}.`,
  },
  {
    q: "What photography services does House of Paradox offer?",
    a: "House of Paradox shoots fashion, e-commerce, editorial, product and portfolio photography, from high-fashion editorials to commercial product catalogues for brands and labels.",
  },
  {
    q: "What kind of videos does House of Paradox produce?",
    a: "The studio produces brand films, commercials, reels, product videos and music videos, handling everything from concept to colour grade.",
  },
  {
    q: "Does House of Paradox offer podcast production in Delhi?",
    a: "Yes. House of Paradox provides full-service podcast production: recording, professional studio setup, editing, and short social media clips to grow the show's audience.",
  },
  {
    q: "Can House of Paradox cover fashion shows and brand events?",
    a: "Yes. The team covers fashion shows, product and brand launches, corporate events and live events, documenting them in photo and video.",
  },
  {
    q: "What does creative direction include?",
    a: "Creative direction at House of Paradox covers concept development, art direction, styling and complete production management, turning a brief into one cohesive visual campaign.",
  },
  {
    q: "Does House of Paradox create social media content and reels?",
    a: "Yes. House of Paradox creates platform-native social media content, reels, UGC-style content and campaigns designed to engage audiences and convert.",
  },
  {
    q: "Who is the founder of House of Paradox?",
    a: `House of Paradox was founded by ${siteConfig.founderName}, who leads the studio as ${siteConfig.founderRole}.`,
  },
  {
    q: "How do I book House of Paradox or get a quote?",
    a: `Fill in the enquiry form on houseofparadoxproduction.com, call ${siteConfig.phone}, or email ${siteConfig.email} with your project details, timeline and requirements. The team replies within 24 hours.`,
  },
];
