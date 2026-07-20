import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const OLD_DOMAIN = "dantam.dental-care.co.in";
const NEW_HOME_URL = "https://dantamdentalcare.com/";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0];

  if (host === OLD_DOMAIN) {
    return NextResponse.redirect(NEW_HOME_URL, 301);
  }

  return NextResponse.next();
}
