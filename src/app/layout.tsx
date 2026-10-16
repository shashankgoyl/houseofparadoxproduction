import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import MotionProvider from "@/components/ui/MotionProvider";
import Analytics from "@/components/Analytics";
import StructuredData from "@/components/StructuredData";
import { siteConfig } from "@/config/site";
import "./globals.css";

// Self-hosted variable fonts (SIL Open Font License): no request to Google,
// no render-blocking stylesheet, no layout shift.
const cinzel = localFont({
  src: "./fonts/cinzel-latin-wght-normal.woff2",
  variable: "--font-cinzel",
  weight: "400 900",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const montserrat = localFont({
  src: [
    { path: "./fonts/montserrat-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/montserrat-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-montserrat",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const seoTitle = `${siteConfig.name} | Luxury Photography & Video Production Studio in Delhi`;
const shareTitle = `${siteConfig.name} — ${siteConfig.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: seoTitle, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "House of Paradox",
    "production house Delhi",
    "luxury photography Delhi",
    "fashion photographer Delhi",
    "product photography Delhi",
    "e-commerce photography India",
    "video production company Delhi",
    "brand film production India",
    "podcast production Delhi",
    "event coverage Delhi",
    "creative direction agency",
    "content creation agency Delhi",
    "photoshoot studio Delhi NCR",
    "fashion shoot production house India",
    "reels production agency Delhi",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Photography & Video Production",
  alternates: { canonical: "/", types: { "text/plain": [{ url: "/llms.txt", title: "LLM summary" }] } },
  formatDetection: { telephone: true, email: true, address: false },
  // Local (geographic) signals
  other: {
    "geo.region": siteConfig.regionCode,
    "geo.placename": siteConfig.city,
  },
  openGraph: {
    title: shareTitle,
    description:
      "We don't just create visuals, we craft timeless stories that define brands, inspire audiences and leave a lasting impact.",
    url: "/",
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: "We don't just create visuals, we craft timeless stories that define brands.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  }),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0D0D",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${cinzel.variable} ${montserrat.variable}`}>
      <body className="grain">
        <StructuredData />
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
