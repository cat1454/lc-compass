/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  transpilePackages: ["lucide-react"],
  outputFileTracingIncludes: {
    "/*": [
      "./content/data/**/*.csv",
    ],
  },
};

export default nextConfig;
