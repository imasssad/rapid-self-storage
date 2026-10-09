import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Placeholder photos come from Unsplash. Remove this once real photos are in /public.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async redirects() {
    // Keep links from the old WordPress site working.
    return [
      { source: "/about-us", destination: "/#story", permanent: true },
      { source: "/facilityfeatures", destination: "/#features", permanent: true },
      { source: "/contact", destination: "/#visit", permanent: true },
    ];
  },
};

export default nextConfig;
