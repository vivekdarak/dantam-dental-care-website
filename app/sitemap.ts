import type { MetadataRoute } from "next";
import { locations, services } from "@/lib/site";

const siteUrl = "https://dantamdentalcare.com";

function route(url: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) {
  return {
    url: `${siteUrl}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    route("/", 1, "weekly"),
    route("/about", 0.7, "monthly"),
    route("/dentists", 0.8, "monthly"),
    route("/services", 0.9, "weekly"),
    route("/locations", 0.9, "weekly"),
    route("/gallery", 0.5, "monthly"),
    route("/testimonials", 0.5, "monthly"),
    route("/contact", 0.8, "monthly"),
    route("/patient-instructions", 0.4, "monthly"),
  ];

  const serviceRoutes = services.map((service) => route(`/services/${service.slug}`, 0.85, "monthly"));
  const locationRoutes = locations.map((location) => route(`/locations/${location.slug}`, 0.85, "monthly"));

  return [...staticRoutes, ...serviceRoutes, ...locationRoutes];
}
