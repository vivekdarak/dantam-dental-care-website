import { type NextRequest, NextResponse } from "next/server";
import { clientIp, isValidPhone, normalizePhone, readVerificationCookie, whatsappNumber } from "@/lib/otp.server";
import { insertPedoRegistration } from "@/lib/pedo-registrations-db";

type RegistrationPayload = {
  campaign?: string;
  date?: string;
  selectedDateLabel?: string;
  parentName?: string;
  mobile?: string;
  childName?: string;
  childAge?: string;
  children?: Array<{
    name?: string;
    age?: string;
  }>;
  concern?: string;
  otherConcern?: string;
  childNotPresent?: boolean;
};

async function readN8nResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { body: text };
  }
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as RegistrationPayload;
  const phoneNumber = normalizePhone(payload.mobile);
  const children =
    payload.children?.length
      ? payload.children.map((child) => ({
          name: child.name?.trim() || "",
          age: child.age?.trim() || "",
        }))
      : [
          {
            name: payload.childName?.trim() || "",
            age: payload.childAge?.trim() || "",
          },
        ];
  const hasInvalidChild = children.some((child) => !child.name || !child.age);

  if (
    !payload.date ||
    !payload.parentName?.trim() ||
    !isValidPhone(phoneNumber) ||
    hasInvalidChild ||
    (payload.concern === "Other concern" && !payload.otherConcern?.trim())
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const verification = readVerificationCookie(request);
  if (!verification) {
    return NextResponse.json(
      { error: "Phone verification expired. Please verify your mobile number again." },
      { status: 401 },
    );
  }

  if (verification.phoneNumber !== phoneNumber) {
    return NextResponse.json({ error: "Please verify your mobile number again." }, { status: 401 });
  }

  const webhookUrl = process.env.N8N_PEDO_DENTIST_WEBHOOK_URL;
  const registration = {
    ...payload,
    mobile: phoneNumber,
    country_code: "91",
    phone_number: phoneNumber,
    mobile_e164: `+91${phoneNumber}`,
    whatsapp_number: whatsappNumber(phoneNumber),
    phone_verified: true,
    phone_verified_at: new Date(verification.verifiedAt).toISOString(),
    children,
    childName: children[0]?.name || "",
    childAge: children[0]?.age || "",
    source: "dantamdentalcare.com/pedo-dentist-free-consultation",
    submittedAt: new Date().toISOString(),
  };

  let n8nStatusCode: number | null = null;
  let n8nResponse: unknown = null;
  let forwarded = false;

  if (!webhookUrl) {
    n8nResponse = { skipped: "N8N_PEDO_DENTIST_WEBHOOK_URL is not configured." };
  } else {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registration),
      });

      n8nStatusCode = response.status;
      forwarded = response.ok;
      n8nResponse = await readN8nResponse(response);
    } catch (error) {
      console.error(error);
      n8nResponse = { error: error instanceof Error ? error.message : "Webhook request failed." };
    }
  }

  const registrationId = await insertPedoRegistration({
    campaign: payload.campaign?.trim() || "Pedo Dentist Free Consultation",
    preferredDate: payload.date,
    selectedDateLabel: payload.selectedDateLabel?.trim() || null,
    parentName: payload.parentName.trim(),
    phoneNumber,
    children,
    childName: children[0]?.name || "",
    childAge: children[0]?.age || "",
    concern: payload.concern?.trim() || null,
    otherConcern: payload.otherConcern?.trim() || null,
    childNotPresent: Boolean(payload.childNotPresent),
    phoneVerifiedAt: new Date(verification.verifiedAt),
    otpRequestId: verification.otpRequestId,
    n8nStatusCode,
    n8nResponse,
    requesterIp: clientIp(request),
    userAgent: request.headers.get("user-agent"),
  });

  if (!forwarded && webhookUrl) {
    return NextResponse.json(
      { error: "Registration was saved, but webhook delivery failed.", registrationId },
      { status: 502 },
    );
  }

  return NextResponse.json({ forwarded, registrationId, registration }, { status: forwarded ? 200 : 202 });
}
