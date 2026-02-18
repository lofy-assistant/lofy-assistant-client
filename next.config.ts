import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed serverExternalPackages - Next.js will bundle @google-cloud/tasks
  // This ensures all JSON config files are included in the Vercel serverless bundle
};

export default nextConfig;
