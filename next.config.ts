import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Cache Components: the home page is cached and tagged "site-content"; admin saves call updateTag().
  cacheComponents: true,
  images: {
    // Default placeholder photos come from Unsplash. Remove this once no default photo in lib/site.ts uses it.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    // Uploaded photos are served by app/media/[...path]/route.ts. Only those local paths may be optimized.
    localPatterns: [{ pathname: "/media/**", search: "" }],
  },
  async redirects() {
    // Keep links from the old WordPress site working.
    return [
      { source: "/about-us", destination: "/#story", permanent: true },
      { source: "/facilityfeatures", destination: "/#features", permanent: true },
      { source: "/contact", destination: "/#visit", permanent: true },
      // Admin screens from before the panel followed the page (bookmarks, old links in the guide).
      { source: "/admin/home", destination: "/admin/hero", permanent: false },
      { source: "/admin/about", destination: "/admin/story", permanent: false },
    ];
  },
};

export default nextConfig;
