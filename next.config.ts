import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/pdf-to-jpeg",
        destination: "/pdf-to-jpg",
        permanent: true
      },
      {
        source: "/pdf-to-picture",
        destination: "/pdf-to-image",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
