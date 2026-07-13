import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

type RevalidatePayload = {
  route_path?: string;
};

export async function POST(request: Request) {
  const expectedSecret = process.env.REVALIDATE_SECRET;
  const suppliedSecret = request.headers.get("x-revalidate-secret");

  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let payload: RevalidatePayload;

  try {
    payload = (await request.json()) as RevalidatePayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const routePath = payload.route_path?.trim();

  if (!routePath || !routePath.startsWith("/")) {
    return NextResponse.json({ ok: false, error: "route_path must start with /" }, { status: 400 });
  }

  revalidatePath(routePath);

  return NextResponse.json({
    ok: true,
    revalidated: routePath,
  });
}
