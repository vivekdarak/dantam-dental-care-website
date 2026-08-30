import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  blogFileOpeninaryPath,
  directusAssetUrl,
  directusFileIdFromSource,
  extractHtmlImageSources,
  getBlogPostForSync,
  getDirectusFile,
  type BlogMediaSync,
  type BlogPost,
  type BlogSyncedMedia,
  type DirectusFile,
  updateBlogMediaSync,
} from "@/lib/directus-blog";

type SyncPayload = {
  id?: string;
  slug?: string;
  old_slug?: string;
  deleted_slug?: string;
};

const openinaryBaseUrl = process.env.NEXT_PUBLIC_OPENINARY_BASE_URL?.replace(/\/$/, "") ?? "";
const openinaryApiKey = process.env.OPENINARY_API_KEY;
const directusToken = process.env.DIRECTUS_TOKEN;

export async function POST(request: Request) {
  const expectedSecret = process.env.REVALIDATE_SECRET;
  const suppliedSecret = request.headers.get("x-revalidate-secret");

  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let payload: SyncPayload;

  try {
    payload = (await request.json()) as SyncPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (payload.deleted_slug) {
    revalidateBlogPaths(payload.deleted_slug);
    return NextResponse.json({ ok: true, deleted: payload.deleted_slug });
  }

  const post = await getBlogPostForSync({ id: payload.id, slug: payload.slug });

  if (!post) {
    return NextResponse.json({ ok: false, error: "Blog post not found" }, { status: 404 });
  }

  let mediaSync: BlogMediaSync;

  try {
    mediaSync = await buildMediaSync(post);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to sync blog media",
      },
      { status: 502 },
    );
  }

  const shouldUpdate = JSON.stringify(stripVolatile(post.media_sync)) !== JSON.stringify(stripVolatile(mediaSync));

  if (shouldUpdate) {
    const updated = await updateBlogMediaSync(post.id, mediaSync);

    if (!updated) {
      return NextResponse.json({ ok: false, error: "Failed to update Directus media_sync" }, { status: 502 });
    }
  }

  revalidateBlogPaths(post.slug);
  if (payload.old_slug && payload.old_slug !== post.slug) revalidateBlogPaths(payload.old_slug);

  return NextResponse.json({
    ok: true,
    post: {
      id: post.id,
      slug: post.slug,
      status: post.status,
    },
    media: {
      featured_image: mediaSync.featured_image?.openinary_path ?? null,
      content_images: mediaSync.content_images.length,
      updated: shouldUpdate,
    },
  });
}

async function buildMediaSync(post: BlogPost): Promise<BlogMediaSync> {
  const featuredImage = post.featured_image ? await syncDirectusFile(post.slug, post.featured_image, directusAssetUrl(post.featured_image.id)) : null;
  const contentImages = await syncContentImages(post);

  return {
    version: 1,
    featured_image: featuredImage,
    content_images: contentImages,
    last_synced_at: new Date().toISOString(),
  };
}

async function syncContentImages(post: BlogPost) {
  const images: BlogSyncedMedia[] = [];

  for (const source of extractHtmlImageSources(post.content_html)) {
    const directusFileId = directusFileIdFromSource(source);
    if (!directusFileId) continue;

    const file = await getDirectusFile(directusFileId);
    if (!file) continue;

    images.push(await syncDirectusFile(post.slug, file, source));
  }

  return images;
}

async function syncDirectusFile(slug: string, file: DirectusFile, source: string): Promise<BlogSyncedMedia> {
  const openinaryPath = blogFileOpeninaryPath(slug, file);
  await uploadDirectusFileToOpeninary(file, openinaryPath);

  return {
    directus_file_id: file.id,
    source,
    openinary_path: openinaryPath,
    width: file.width ?? null,
    height: file.height ?? null,
    type: file.type ?? null,
  };
}

async function uploadDirectusFileToOpeninary(file: DirectusFile, openinaryPath: string) {
  if (!openinaryBaseUrl || !openinaryApiKey) {
    throw new Error("Openinary is not configured");
  }

  const assetResponse = await fetch(directusAssetUrl(file.id), {
    headers: directusToken ? { Authorization: `Bearer ${directusToken}` } : undefined,
    cache: "no-store",
  });

  if (!assetResponse.ok) {
    throw new Error(`Failed to fetch Directus asset ${file.id}`);
  }

  const formData = new FormData();
  formData.set("file", await assetResponse.blob(), file.filename_download || `${file.id}.jpg`);
  formData.set("path", openinaryPath);
  formData.set("overwrite", "true");

  const uploadResponse = await fetch(`${openinaryBaseUrl}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openinaryApiKey}`,
    },
    body: formData,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text().catch(() => "");
    throw new Error(`Openinary upload failed for ${openinaryPath}: ${uploadResponse.status} ${errorText}`);
  }
}

function revalidateBlogPaths(slug: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}

function stripVolatile(mediaSync?: BlogMediaSync | null) {
  if (!mediaSync) return null;

  return {
    version: mediaSync.version,
    featured_image: mediaSync.featured_image ?? null,
    content_images: mediaSync.content_images,
  };
}
