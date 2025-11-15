import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dua-insan-story-g8bpeagbdec3evd2.indonesiacentral-01.azurewebsites.net",
        port: "",
        pathname: "/**",   // allow all paths
      },
    ],
  },
};

export default nextConfig;
