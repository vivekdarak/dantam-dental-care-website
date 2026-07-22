import { NextResponse } from "next/server";
import { createInternalReviewSession } from "@/lib/internal-review-auth";

export async function POST(request: Request) {
  const expectedPassword = process.env.INTERNAL_REVIEW_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json({ ok: false, error: "Internal review password is not configured." }, { status: 500 });
  }

  let payload: { password?: string };

  try {
    payload = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (payload.password !== expectedPassword) {
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }

  await createInternalReviewSession();

  return NextResponse.json({ ok: true });
}

