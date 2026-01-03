import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@google-cloud/tasks"],
  outputFileTracingIncludes: {
    "/api/**": ["node_modules/@google-cloud/tasks/build/esm/src/v2/**/*.json", "node_modules/@google-cloud/tasks/build/src/v2/**/*.json"],
  },
};

export default nextConfig;
