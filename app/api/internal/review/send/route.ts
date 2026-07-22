import { NextResponse } from "next/server";
import { getReviewSendCooldown, hasInternalReviewSession, setReviewSendCooldown } from "@/lib/internal-review-auth";
import { findReviewRequestsByPhone, insertReviewRequest } from "@/lib/review-requests-db";
import { locations } from "@/lib/site";

const REVIEW_WEBHOOK_PATH = "/webhook/dantam-review-form";

type SendPayload = {
  branchSlug?: string;
  patientName?: string;
  phoneNumber?: string;
  confirmDuplicate?: boolean;
};

function n8nWebhookUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_N8N_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_N8N_BASE_URL is not configured.");
  }
  return `${baseUrl}${REVIEW_WEBHOOK_PATH}`;
}

function clientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || null;
}

function validatePayload(payload: SendPayload) {
  const patientName = payload.patientName?.trim().replace(/\s+/g, " ") || "";
  const phoneNumber = payload.phoneNumber?.replace(/\D/g, "") || "";
  const branch = locations.find((location) => location.slug === payload.branchSlug);

  if (!branch) {
    return { ok: false as const, error: "Please select a valid branch." };
  }

  if (patientName.length < 2) {
    return { ok: false as const, error: "Please enter the patient name." };
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    return { ok: false as const, error: "Please enter a 10 digit mobile number." };
  }

  return {
    ok: true as const,
    data: {
      patientName,
      phoneNumber,
      branchSlug: branch.slug,
      branchName: `${branch.name} - ${branch.area}`,
    },
  };
}

async function readN8nResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { body: text };
  }
}

export async function POST(request: Request) {
  if (!(await hasInternalReviewSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let payload: SendPayload;

  try {
    payload = (await request.json()) as SendPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const validated = validatePayload(payload);
  if (!validated.ok) {
    return NextResponse.json({ ok: false, error: validated.error }, { status: 400 });
  }

  const previousRequests = await findReviewRequestsByPhone(validated.data.phoneNumber);

  if (previousRequests.length > 0 && !payload.confirmDuplicate) {
    return NextResponse.json({
      ok: false,
      duplicate: true,
      previousRequests,
      message: "Previous review requests were found for this phone number.",
    });
  }

  const cooldownSeconds = await getReviewSendCooldown();
  if (cooldownSeconds > 0) {
    return NextResponse.json(
      {
        ok: false,
        cooldownSeconds,
        error: `Please wait ${cooldownSeconds} seconds before sending another request.`,
      },
      { status: 429 },
    );
  }

  let n8nStatusCode: number | null = null;
  let n8nResponse: unknown = null;
  let n8nOk = false;

  try {
    const response = await fetch(n8nWebhookUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        branchSlug: validated.data.branchSlug,
        branchName: validated.data.branchName,
        patientName: validated.data.patientName,
        phoneCountryCode: "+91",
        phoneNumber: validated.data.phoneNumber,
        fullPhoneNumber: `+91${validated.data.phoneNumber}`,
        source: "dantam-review-request",
        submittedAt: new Date().toISOString(),
      }),
    });

    n8nStatusCode = response.status;
    n8nOk = response.ok;
    n8nResponse = await readN8nResponse(response);
  } catch (error) {
    console.error(error);
    n8nResponse = { error: error instanceof Error ? error.message : "Webhook request failed." };
  }

  const log = await insertReviewRequest({
    ...validated.data,
    n8nStatusCode,
    n8nResponse,
    requesterIp: clientIp(request),
    userAgent: request.headers.get("user-agent"),
  });

  await setReviewSendCooldown();

  if (!n8nOk) {
    return NextResponse.json(
      {
        ok: false,
        error: "The request was logged, but the automation webhook did not confirm receipt.",
        log,
        cooldownSeconds: 30,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    log,
    cooldownSeconds: 30,
  });
}

