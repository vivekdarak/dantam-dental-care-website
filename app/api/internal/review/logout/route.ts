import { NextResponse } from "next/server";
import { clearInternalReviewSession } from "@/lib/internal-review-auth";

export async function POST() {
  await clearInternalReviewSession();
  return NextResponse.json({ ok: true });
}

