import type { Metadata } from "next";
import { socialImage } from "@/lib/social-metadata";
import { site } from "@/lib/site";

const siteUrl = "https://dantamdentalcare.com";
const directusUrl = process.env.DIRECTUS_URL?.replace(/\/$/, "");
const directusToken = process.env.DIRECTUS_TOKEN;

type SeoPage = {
  meta_title: string;
  meta_description: string;
  canonical_url?: string | null;
  robots_index?: boolean | null;
  robots_follow?: boolean | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
};

type SeoFallback = {
  title: string;
  description: string;
  path: string;
  image: string;
  imageAlt: string;
};

async function getDirectusSeoPage(routePath: string): Promise<SeoPage | null> {
  if (!directusUrl) return null;

  const params = new URLSearchParams();
  params.set("filter[route_path][_eq]", routePath);
  params.set("filter[status][_eq]", "published");
  params.set(
    "fields",
    "meta_title,meta_description,canonical_url,robots_index,robots_follow,og_title,og_description,og_image_url",
  );
  params.set("limit", "1");

  try {
    const response = await fetch(`${directusUrl}/items/dantam_seo_pages?${params.toString()}`, {
      headers: directusToken ? { Authorization: `Bearer ${directusToken}` } : undefined,
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as { data?: SeoPage[] };
    return payload.data?.[0] ?? null;
  } catch {
    return null;
  }
}

function metadataFromSeo(seo: SeoPage | null, fallback: SeoFallback): Metadata {
  const title = seo?.meta_title || fallback.title;
  const description = seo?.meta_description || fallback.description;
  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;
  const imageUrl = seo?.og_image_url
    ? seo.og_image_url.startsWith("http")
      ? seo.og_image_url
      : `${siteUrl}${seo.og_image_url}`
    : socialImage(fallback.image);
  const canonical = seo?.canonical_url || `${siteUrl}${fallback.path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: seo?.robots_index ?? true,
      follow: seo?.robots_follow ?? true,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `${siteUrl}${fallback.path}`,
      siteName: site.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fallback.imageAlt,
          type: "image/jpeg",
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [imageUrl],
    },
  };
}

export async function seoMetadata(fallback: SeoFallback): Promise<Metadata> {
  const seo = await getDirectusSeoPage(fallback.path || "/");
  return metadataFromSeo(seo, fallback);
}
