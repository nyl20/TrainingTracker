import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TrainingTracker",
    short_name: "TrainingTracker",
    description: "Track student training progress across clubs",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#000000",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
