import { NextResponse } from "next/server";
import {
  clientIp,
  generateOtp,
  hashForAudit,
  hashOtp,
  isValidPhone,
  normalizePhone,
  OTP_COUNTRY_CODE,
  OTP_DAILY_LIMIT,
  OTP_PURPOSE,
  OTP_RESEND_SECONDS,
  OTP_TTL_MINUTES,
  whatsappNumber,
} from "@/lib/otp.server";
import { getOtpRequestStats, insertOtpRequest } from "@/lib/pedo-registrations-db";

type SendOtpPayload = {
  phone?: string;
};

function otpWebhookUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_N8N_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_N8N_BASE_URL is not configured.");
  }
  return `${baseUrl}/webhook/dantam-otp`;
}

function otpWebhookHeaders() {
  const secret = process.env.INTERNAL_REVIEW_SESSION_SECRET;
  if (!secret) {
    throw new Error("INTERNAL_REVIEW_SESSION_SECRET is not configured.");
  }

  return {
    "Content-Type": "application/json",
    [process.env.N8N_OTP_AUTH_HEADER_NAME || "x-dantam-internal-secret"]: secret,
  };
}

export async function POST(request: Request) {
  let payload: SendOtpPayload;

  try {
    payload = (await request.json()) as SendOtpPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const phoneNumber = normalizePhone(payload.phone);
  if (!isValidPhone(phoneNumber)) {
    return NextResponse.json({ ok: false, error: "Please enter a 10 digit mobile number." }, { status: 400 });
  }

  const stats = await getOtpRequestStats(phoneNumber);
  if (stats.requestCount >= OTP_DAILY_LIMIT) {
    return NextResponse.json(
      { ok: false, error: "You have reached today's OTP limit. Please try again later." },
      { status: 429 },
    );
  }

  if (stats.latestCreatedAt) {
    const elapsedSeconds = Math.floor((Date.now() - stats.latestCreatedAt.getTime()) / 1000);
    const cooldownSeconds = Math.max(0, OTP_RESEND_SECONDS - elapsedSeconds);
    if (cooldownSeconds > 0) {
      return NextResponse.json(
        {
          ok: false,
          cooldownSeconds,
          error: `Please wait ${cooldownSeconds}s before requesting another OTP.`,
        },
        { status: 429 },
      );
    }
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  const requestId = await insertOtpRequest({
    phoneNumber,
    otpHash: hashOtp(phoneNumber, otp),
    expiresAt,
    requestIpHash: hashForAudit(clientIp(request)),
    userAgent: request.headers.get("user-agent"),
  });

  const response = await fetch(otpWebhookUrl(), {
    method: "POST",
    headers: otpWebhookHeaders(),
    body: JSON.stringify({
      event: "pedo_consultation_otp",
      otp_request_id: requestId,
      purpose: OTP_PURPOSE,
      country_code: OTP_COUNTRY_CODE,
      phone_number: phoneNumber,
      whatsapp_number: whatsappNumber(phoneNumber),
      otp,
      expires_at: expiresAt.toISOString(),
      source: "dantamdentalcare.com/pedo-dentist-free-consultation",
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ ok: false, error: "OTP delivery failed. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, cooldownSeconds: OTP_RESEND_SECONDS });
}

