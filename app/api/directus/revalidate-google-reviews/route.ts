import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const reviewCacheTag = "dantam-google-reviews";
const reviewPaths = ["/", "/testimonials"] as const;

export async function POST(request: Request) {
  const expectedSecret = process.env.REVALIDATE_SECRET;
  const suppliedSecret = request.headers.get("x-revalidate-secret");

  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(reviewCacheTag, { expire: 0 });
  reviewPaths.forEach((path) => revalidatePath(path));

  return NextResponse.json({
    ok: true,
    revalidated: {
      tag: reviewCacheTag,
      paths: reviewPaths,
    },
  });
}
