import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Separate QA builds from an already running development server.
  distDir: process.env.LANDINGPOINT_BUILD_DIR || ".next",
};

export default nextConfig;
