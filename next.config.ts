import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/jpeg-to-png",
        destination: "/jpg-to-png",
        permanent: true
      },
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
