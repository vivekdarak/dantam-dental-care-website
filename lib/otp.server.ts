import crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";

export const OTP_COUNTRY_CODE = "91";
export const OTP_PURPOSE = "pedo_consultation";
export const OTP_TTL_MINUTES = 10;
export const OTP_RESEND_SECONDS = 60;
export const OTP_DAILY_LIMIT = 4;
export const OTP_MAX_ATTEMPTS = 5;

const COOKIE_NAME = "dantam_pedo_phone_verified";
const COOKIE_TTL_SECONDS = 30 * 24 * 60 * 60;

type VerificationCookiePayload = {
  countryCode: string;
  phoneNumber: string;
  purpose: string;
  otpRequestId: number;
  verifiedAt: number;
  expiresAt: number;
};

function secret() {
  const value = process.env.INTERNAL_REVIEW_SESSION_SECRET;
  if (!value) {
    throw new Error("INTERNAL_REVIEW_SESSION_SECRET is not configured.");
  }
  return value;
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

function timingSafeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function normalizePhone(value: string | undefined | null) {
  return value?.replace(/\D/g, "").slice(-10) || "";
}

export function isValidPhone(phoneNumber: string) {
  return /^\d{10}$/.test(phoneNumber);
}

export function whatsappNumber(phoneNumber: string) {
  return `${OTP_COUNTRY_CODE}${phoneNumber}`;
}

export function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

export function hashOtp(phoneNumber: string, otp: string) {
  return crypto
    .createHmac("sha256", secret())
    .update(`${OTP_COUNTRY_CODE}:${phoneNumber}:${otp}`)
    .digest("hex");
}

export function hashForAudit(value: string | null) {
  if (!value) return null;
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function clientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || null;
}

export function createVerificationCookieValue(input: {
  phoneNumber: string;
  otpRequestId: number;
  verifiedAt?: number;
}) {
  const now = input.verifiedAt || Date.now();
  const payload: VerificationCookiePayload = {
    countryCode: OTP_COUNTRY_CODE,
    phoneNumber: input.phoneNumber,
    purpose: OTP_PURPOSE,
    otpRequestId: input.otpRequestId,
    verifiedAt: now,
    expiresAt: now + COOKIE_TTL_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function readVerificationCookie(request: NextRequest) {
  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookieValue) return null;

  const [encodedPayload, signature] = cookieValue.split(".");
  if (!encodedPayload || !signature || !timingSafeEqual(signature, sign(encodedPayload))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as VerificationCookiePayload;
    if (
      payload.countryCode !== OTP_COUNTRY_CODE ||
      payload.purpose !== OTP_PURPOSE ||
      !isValidPhone(payload.phoneNumber) ||
      !Number.isFinite(payload.otpRequestId) ||
      payload.expiresAt < Date.now()
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function setVerificationCookie(response: NextResponse, value: string) {
  response.cookies.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_TTL_SECONDS,
  });
}

export function clearVerificationCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

