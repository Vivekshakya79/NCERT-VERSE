import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Turbopack is the default in Next.js 16; no explicit turbo config needed
};

export default nextConfig;
