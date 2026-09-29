import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";
export const alt = "Tyler Lindow | Engineering Manager, Developer Fintech";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Read cropped profile photo as base64
  const avatarPath = path.join(process.cwd(), "public/profile-square.jpg");
  const avatarBase64 = fs.readFileSync(avatarPath).toString("base64");
  const avatarDataUrl = `data:image/jpeg;base64,${avatarBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FFFDF7",
          padding: "0 100px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Left Side: Favicon Logo + Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "32px",
            maxWidth: "640px",
          }}
        >

          {/* Title of the Site */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <h1
              style={{
                fontSize: "68px",
                fontWeight: "900",
                color: "#1F1D1A",
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                margin: 0,
              }}
            >
              Tyler Lindow
            </h1>
            <p
              style={{
                fontSize: "30px",
                fontWeight: "700",
                color: "#4F46E5",
                fontFamily: "monospace",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Engineering Manager, Developer Fintech
            </p>
          </div>
        </div>

        {/* Right Side: Profile Picture */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={avatarDataUrl}
            alt="Tyler Lindow"
            style={{
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              border: "8px solid #FFFFFF",
              boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
