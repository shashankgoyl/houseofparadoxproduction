import { siteConfig, activeSocials, whatsappUrl } from "@/config/site";
import { SERVICE_DETAILS } from "@/content/services";
import { FAQS } from "@/content/faqs";

// One connected schema.org graph describing the business, its founder, the
// website, this page, its services and FAQs. Search engines use it for rich
// results and the knowledge panel; AI answer engines (ChatGPT, Perplexity,
// Gemini, Google AI Overviews, Claude) use it to understand and cite the
// studio accurately.
export default function StructuredData() {
  const url = siteConfig.url;
  const id = (frag: string) => `${url}/#${frag}`;
  const sameAs = activeSocials.map((s) => s.url);
  const builtAt = new Date().toISOString();

  const graph = [
    {
      "@type": ["ProfessionalService", "LocalBusiness"],
      "@id": id("business"),
      name: siteConfig.name,
      alternateName: "HoP",
      slogan: siteConfig.tagline,
      description: siteConfig.description,
      url,
      logo: { "@type": "ImageObject", url: `${url}/icon.svg` },
      image: `${url}/opengraph-image`,
      email: siteConfig.email,
      telephone: siteConfig.phone.replace(/\s+/g, ""),
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.city,
        addressRegion: "Delhi",
        addressCountry: siteConfig.countryCode,
      },
      areaServed: [
        { "@type": "City", name: siteConfig.city },
        { "@type": "Country", name: "India" },
      ],
      knowsAbout: [
        "Fashion photography",
        "E-commerce photography",
        "Product photography",
        "Brand films",
        "Video production",
        "Podcast production",
        "Event coverage",
        "Creative direction",
        "Social media content creation",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: siteConfig.phone.replace(/\s+/g, ""),
        email: siteConfig.email,
        areaServed: siteConfig.countryCode,
        availableLanguage: ["English", "Hindi"],
        url: whatsappUrl(),
      },
      founder: { "@id": id("founder") },
      ...(sameAs.length > 0 && { sameAs }),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Creative production services",
        itemListElement: SERVICE_DETAILS.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.title,
            serviceType: s.title,
            description: `${s.subtitle}. ${s.description}`,
            provider: { "@id": id("business") },
            areaServed: { "@type": "Country", name: "India" },
          },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": id("founder"),
      name: siteConfig.founderName,
      jobTitle: siteConfig.founderRole,
      worksFor: { "@id": id("business") },
    },
    {
      "@type": "WebSite",
      "@id": id("website"),
      url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: { "@id": id("business") },
      inLanguage: "en-IN",
    },
    {
      "@type": "WebPage",
      "@id": id("webpage"),
      url,
      name: `${siteConfig.name} | Luxury Photography & Video Production Studio in Delhi`,
      description: siteConfig.description,
      isPartOf: { "@id": id("website") },
      about: { "@id": id("business") },
      mainEntity: { "@id": id("faq") },
      primaryImageOfPage: `${url}/opengraph-image`,
      inLanguage: "en-IN",
      dateModified: builtAt,
    },
    {
      "@type": "FAQPage",
      "@id": id("faq"),
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      // "<" is escaped so the JSON can never close the <script> tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
