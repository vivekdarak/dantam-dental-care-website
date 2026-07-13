import type { MetadataRoute } from "next";

const siteUrl = "https://dantamdentalcare.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/review-us"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
