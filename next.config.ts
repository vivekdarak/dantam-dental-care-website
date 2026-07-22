import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/openinary-loader.ts",
  },
  async redirects() {
    return [
      {
        source: "/review-us2",
        destination: "/review-us",
        permanent: true,
      },
      {
        source: "/reivew-us2",
        destination: "/review-us",
        permanent: true,
      },
      {
        source: "/services/pedodontics",
        destination: "/services/child-dental-care",
        permanent: true,
      },
      {
        source: "/services/dental-implant",
        destination: "/services/implants",
        permanent: true,
      },
      {
        source: "/services/wisdom-teeth-removal",
        destination: "/services/tooth-extraction",
        permanent: true,
      },
      {
        source: "/services/single-sitting-root-canal",
        destination: "/services/root-canal-treatments",
        permanent: true,
      },
      {
        source: "/services/dental-3d-scanner",
        destination: "/services/intraoral-scanner",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
