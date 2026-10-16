// Central place for the studio's details. Edit these values instead of
// hunting through components.
//
// Any social URL left as an empty string is hidden from the site, so no
// dead "#" links are ever shown.

export const siteConfig = {
  name: "House of Paradox",
  tagline: "Where Style Becomes Story",
  description:
    "House of Paradox is a luxury creative production studio in Delhi, India — fashion & product photography, brand films, podcast production, event coverage, creative direction and content creation.",
  url: "https://houseofparadoxproduction.com",

  founderName: "Tushar",
  founderRole: "Founder & Creative Director",

  email: "hello@houseofparadoxproduction.com",
  // Where new website enquiries are emailed (override with CONTACT_NOTIFY_TO).
  notifyEmail: "tushar@houseofparadoxproduction.com",
  // Sender for those emails (domain verified in Resend; override with CONTACT_EMAIL_FROM).
  senderEmail: "House of Paradox Website <website@houseofparadoxproduction.com>",
  phone: "+91 9718955997",
  location: "Delhi, India",
  city: "Delhi",
  regionCode: "IN-DL",
  countryCode: "IN",

  // TODO: paste the full profile URLs, e.g. "https://www.instagram.com/yourhandle"
  social: {
    instagram: "",
    youtube: "",
    linkedin: "",
    pinterest: "",
  },
} as const;

export type SocialKey = keyof typeof siteConfig.social;

export const socialMeta: Record<SocialKey, { label: string; short: string }> = {
  instagram: { label: "Instagram", short: "IG" },
  youtube: { label: "YouTube", short: "YT" },
  linkedin: { label: "LinkedIn", short: "LI" },
  pinterest: { label: "Pinterest", short: "PT" },
};

/** Social profiles that have a URL set, in display order. */
export const activeSocials = (Object.keys(siteConfig.social) as SocialKey[])
  .filter((key) => siteConfig.social[key].trim() !== "")
  .map((key) => ({ key, url: siteConfig.social[key], ...socialMeta[key] }));
