import { NextResponse } from "next/server";
import { hasInternalReviewSession } from "@/lib/internal-review-auth";
import { listReviewRequests } from "@/lib/review-requests-db";

export async function GET(request: Request) {
  if (!(await hasInternalReviewSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
  const search = url.searchParams.get("search") || "";

  try {
    const history = await listReviewRequests({
      page: Number.isFinite(page) ? page : 1,
      search,
    });

    return NextResponse.json({ ok: true, history });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Could not load review request history." }, { status: 500 });
  }
}

