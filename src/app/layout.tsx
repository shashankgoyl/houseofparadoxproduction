import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "House of Paradox — Where Style Becomes Story",
  description:
    "House of Paradox is a luxury creative production studio based in Delhi, India. We craft timeless stories through photography, video production, podcast production, event coverage, creative direction, and content creation.",
  keywords: [
    "House of Paradox",
    "luxury photography Delhi",
    "fashion photography",
    "video production India",
    "creative direction",
    "brand storytelling",
    "content creation",
    "event coverage",
  ],
  authors: [{ name: "House of Paradox" }],
  creator: "House of Paradox",
  openGraph: {
    title: "House of Paradox — Where Style Becomes Story",
    description:
      "We don't just create visuals, we craft timeless stories that define brands, inspire audiences and leave a lasting impact.",
    url: "https://houseofparadoxproduction.com",
    siteName: "House of Paradox",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "House of Paradox — Where Style Becomes Story",
    description:
      "We don't just create visuals, we craft timeless stories that define brands.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0D0D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}
