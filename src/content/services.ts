// Single source of truth for the services: used by the Services section,
// structured data for search/AI engines, and /llms.txt.

export type ServiceDetail = { title: string; subtitle: string; description: string; tags: string[] };

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    title: "Photography",
    subtitle: "Fashion, E-commerce, Editorial, Product & Portfolio Shoots",
    description:
      "We capture the essence of your brand through meticulously crafted imagery. From high-fashion editorials to commercial product photography, every frame tells your story.",
    tags: ["Fashion", "Editorial", "Commercial", "Portrait"],
  },
  {
    title: "Video Production",
    subtitle: "Brand Films, Commercials, Reels, Product & Music Videos",
    description:
      "Cinematic storytelling that moves audiences. We produce compelling video content — from concept to colour grade — that elevates your brand in motion.",
    tags: ["Brand Films", "Commercials", "Reels", "Music Video"],
  },
  {
    title: "Podcast Production",
    subtitle: "Podcast Recording, Editing, Studio Setup & Social Clips",
    description:
      "Full-service podcast production that makes your voice heard. Professional studio setup, expert editing, and strategic social content to grow your audience.",
    tags: ["Recording", "Editing", "Studio", "Social Clips"],
  },
  {
    title: "Event Coverage",
    subtitle: "Fashion Shows, Launches, Corporate & Live Events",
    description:
      "We document your most important moments with precision and artistry. From intimate brand launches to large-scale fashion shows, no detail escapes our lens.",
    tags: ["Fashion Shows", "Launches", "Corporate", "Live Events"],
  },
  {
    title: "Creative Direction",
    subtitle: "Concept Development, Art Direction, Styling & Production Management",
    description:
      "Our creative direction transforms ideas into cohesive visual narratives. We handle concept development, art direction, and complete production management.",
    tags: ["Concept", "Art Direction", "Styling", "Production"],
  },
  {
    title: "Content Creation",
    subtitle: "Social Media Content, Reels, UGC & Campaigns",
    description:
      "Strategic content that stops the scroll. We create platform-native content designed to engage, convert, and build lasting connections with your audience.",
    tags: ["Social Media", "Reels", "UGC", "Campaigns"],
  },
];
