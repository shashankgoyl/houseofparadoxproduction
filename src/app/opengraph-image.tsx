import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

// Preview image used when the site is shared on WhatsApp, LinkedIn, X, etc.
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D0D0D",
          border: "2px solid rgba(212,175,55,0.35)",
          color: "#D4AF37",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 14, color: "rgba(212,175,55,0.7)", marginBottom: 36 }}>
          DELHI, INDIA
        </div>
        <div style={{ fontSize: 120, letterSpacing: 18, fontWeight: 700 }}>HOUSE</div>
        <div style={{ fontSize: 40, letterSpacing: 20, color: "rgba(247,245,239,0.5)", margin: "4px 0" }}>of</div>
        <div style={{ fontSize: 120, letterSpacing: 18, fontWeight: 700 }}>PARADOX</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 40 }}>
          <div style={{ width: 80, height: 2, background: "#D4AF37" }} />
          <div style={{ fontSize: 28, letterSpacing: 10, margin: "0 24px", color: "#F2C667" }}>
            WHERE STYLE BECOMES STORY
          </div>
          <div style={{ width: 80, height: 2, background: "#D4AF37" }} />
        </div>
      </div>
    ),
    size
  );
}
