import { openinaryUrl, OPENINARY_FOLDER } from "@/lib/openinary";

const siteUrl = "https://dantamdentalcare.com";
export const directusUrl = process.env.DIRECTUS_URL?.replace(/\/$/, "") ?? "";
const directusToken = process.env.DIRECTUS_TOKEN;

export type DirectusFile = {
  id: string;
  title?: string | null;
  filename_download?: string | null;
  type?: string | null;
  width?: number | null;
  height?: number | null;
  filesize?: string | number | null;
};

export type BlogMediaSync = {
  version: 1;
  featured_image?: BlogSyncedMedia | null;
  content_images: BlogSyncedMedia[];
  last_synced_at: string;
};

export type BlogSyncedMedia = {
  directus_file_id?: string | null;
  source: string;
  openinary_path: string;
  width?: number | null;
  height?: number | null;
  type?: string | null;
};

export type BlogAuthor = {
  name: string;
  slug: string;
  bio?: string | null;
  image?: DirectusFile | null;
};

export type BlogCategory = {
  title: string;
  slug: string;
  description?: string | null;
};

export type BlogPost = {
  id: string;
  status: string;
  title: string;
  slug: string;
  published_at?: string | null;
  excerpt?: string | null;
  content_html?: string | null;
  featured_image?: DirectusFile | null;
  author?: BlogAuthor | null;
  category?: BlogCategory | null;
  meta_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  faq_items?: { question: string; answer: string }[] | null;
  schema_type?: "BlogPosting" | "Article" | "MedicalWebPage" | null;
  media_sync?: BlogMediaSync | null;
  date_updated?: string | null;
  date_created?: string | null;
};

type DirectusListResponse<T> = {
  data?: T[];
};

type DirectusItemResponse<T> = {
  data?: T;
};

const postFields = [
  "id",
  "status",
  "title",
  "slug",
  "published_at",
  "excerpt",
  "content_html",
  "featured_image.id",
  "featured_image.title",
  "featured_image.filename_download",
  "featured_image.type",
  "featured_image.width",
  "featured_image.height",
  "featured_image.filesize",
  "author.name",
  "author.slug",
  "author.bio",
  "author.image.id",
  "author.image.filename_download",
  "author.image.type",
  "author.image.width",
  "author.image.height",
  "category.title",
  "category.slug",
  "category.description",
  "meta_title",
  "meta_description",
  "canonical_url",
  "faq_items",
  "schema_type",
  "media_sync",
  "date_updated",
  "date_created",
].join(",");

function directusHeaders() {
  return directusToken ? { Authorization: `Bearer ${directusToken}` } : undefined;
}

async function directusFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!directusUrl) return null;

  try {
    const response = await fetch(`${directusUrl}${path}`, {
      ...init,
      headers: {
        ...directusHeaders(),
        ...init?.headers,
      },
      next: init?.cache || (init?.method && init.method !== "GET") ? undefined : { revalidate: 3600 },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getPublishedBlogPosts(limit = 24) {
  const params = new URLSearchParams();
  params.set("filter[status][_eq]", "published");
  params.set("fields", postFields);
  params.set("sort", "-published_at,-date_created");
  params.set("limit", String(limit));

  const payload = await directusFetch<DirectusListResponse<BlogPost>>(`/items/dantam_blog_posts?${params}`);
  return payload?.data ?? [];
}

export async function getPublishedBlogPost(slug: string) {
  const params = new URLSearchParams();
  params.set("filter[status][_eq]", "published");
  params.set("filter[slug][_eq]", slug);
  params.set("fields", postFields);
  params.set("limit", "1");

  const payload = await directusFetch<DirectusListResponse<BlogPost>>(`/items/dantam_blog_posts?${params}`);
  return payload?.data?.[0] ?? null;
}

export async function getBlogPostForSync({ id, slug }: { id?: string; slug?: string }) {
  if (!id && !slug) return null;

  const params = new URLSearchParams();
  if (id) params.set("filter[id][_eq]", id);
  if (slug) params.set("filter[slug][_eq]", slug);
  params.set("fields", postFields);
  params.set("limit", "1");

  const payload = await directusFetch<DirectusListResponse<BlogPost>>(`/items/dantam_blog_posts?${params}`, {
    cache: "no-store",
  });
  return payload?.data?.[0] ?? null;
}

export async function getPublishedBlogSlugs() {
  const params = new URLSearchParams();
  params.set("filter[status][_eq]", "published");
  params.set("fields", "slug");
  params.set("limit", "100");

  const payload = await directusFetch<DirectusListResponse<{ slug: string }>>(`/items/dantam_blog_posts?${params}`);
  return payload?.data ?? [];
}

export async function updateBlogMediaSync(postId: string, mediaSync: BlogMediaSync) {
  if (!directusUrl) return false;

  const response = await fetch(`${directusUrl}/items/dantam_blog_posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...directusHeaders(),
    },
    body: JSON.stringify({ media_sync: mediaSync }),
  });

  return response.ok;
}

export async function getDirectusFile(fileId: string) {
  const params = new URLSearchParams();
  params.set("fields", "id,title,filename_download,type,width,height,filesize");

  const payload = await directusFetch<DirectusItemResponse<DirectusFile>>(`/files/${fileId}?${params}`, {
    cache: "no-store",
  });
  return payload?.data ?? null;
}

export function directusAssetUrl(fileId: string) {
  return `${directusUrl}/assets/${fileId}`;
}

export function blogFileOpeninaryPath(slug: string, file: DirectusFile) {
  const filename = safeFilename(file.filename_download || file.title || file.id, file.type);
  return `${OPENINARY_FOLDER}/blog/${slug}/${file.id}-${filename}`;
}

export function blogFeaturedImagePath(post: BlogPost) {
  return post.media_sync?.featured_image?.openinary_path ?? null;
}

export function blogFeaturedImageSrc(post: BlogPost) {
  const syncedPath = blogFeaturedImagePath(post);
  if (syncedPath) return syncedPath;
  if (post.featured_image) return directusAssetUrl(post.featured_image.id);
  return "/images/hero-clinic.jpg";
}

export function blogFeaturedImageUrl(post: BlogPost, transforms = "w_1200,h_630,c_fill,q_82,f_jpg") {
  const path = blogFeaturedImagePath(post);
  if (path) return openinaryUrl(path, transforms);
  if (post.featured_image) return directusAssetUrl(post.featured_image.id);
  return openinaryUrl("/images/hero-clinic.jpg", transforms);
}

export function transformBlogHtmlImages(html: string, mediaSync?: BlogMediaSync | null) {
  if (!html || !mediaSync?.content_images.length) return html;

  let transformed = html;

  for (const image of mediaSync.content_images) {
    const sources = uniqueStrings([
      image.source,
      image.directus_file_id ? directusAssetUrl(image.directus_file_id) : "",
      image.directus_file_id ? `/assets/${image.directus_file_id}` : "",
    ]);

    for (const source of sources) {
      const escaped = escapeRegExp(source);
      const url = openinaryUrl(image.openinary_path, "w_1200,q_82,f_webp");
      transformed = transformed.replace(new RegExp(`src=(["'])${escaped}\\1`, "g"), `src="${url}"`);
    }
  }

  return transformed;
}

export function extractHtmlImageSources(html?: string | null) {
  if (!html) return [];

  const sources = new Set<string>();
  const imageTagPattern = /<img\b[^>]*?\bsrc=(["'])(.*?)\1/gi;
  let match: RegExpExecArray | null;

  while ((match = imageTagPattern.exec(html))) {
    if (match[2]) sources.add(match[2]);
  }

  return Array.from(sources);
}

export function directusFileIdFromSource(source: string) {
  const match = source.match(/\/assets\/([0-9a-fA-F-]{36})(?:[/?#]|$)/);
  return match?.[1] ?? null;
}

export function blogPostUrl(slug: string) {
  return `${siteUrl}/blog/${slug}`;
}

export function blogDescription(post: BlogPost) {
  return post.meta_description || post.excerpt || "Dental care insights and clinical cases from Dantam Dental Care.";
}

function safeFilename(raw: string, type?: string | null) {
  const fallbackExtension = extensionFromMime(type);
  const trimmed = raw.trim().toLowerCase();
  const hasExtension = /\.[a-z0-9]{2,5}$/i.test(trimmed);
  const withExtension = hasExtension || !fallbackExtension ? trimmed : `${trimmed}.${fallbackExtension}`;
  const safe = withExtension
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return safe || `file.${fallbackExtension || "jpg"}`;
}

function extensionFromMime(type?: string | null) {
  if (!type) return null;
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("avif")) return "avif";
  if (type.includes("jpeg") || type.includes("jpg")) return "jpg";
  if (type.includes("gif")) return "gif";
  return null;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}
