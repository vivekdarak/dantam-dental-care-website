import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
