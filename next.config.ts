import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Pin the workspace root to this project directory. Without this, Next.js's
  // lockfile-based root inference can pick an unrelated parent directory that
  // happens to contain another lockfile, which breaks output file tracing.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
