import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dead Man's Proof",
    short_name: "DMP",
    description:
      "Privacy-preserving attestations on Base. Seal data, verify claims, reveal nothing.",
    start_url: "/",
    display: "standalone",
    background_color: "#050507",
    theme_color: "#C41E3A",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
