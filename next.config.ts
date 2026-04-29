import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: {
    buildActivityPosition: 'bottom-left',
  },
};

export default nextConfig;
