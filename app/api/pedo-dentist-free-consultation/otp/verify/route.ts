import { NextResponse } from "next/server";
import {
  createVerificationCookieValue,
  hashOtp,
  isValidPhone,
  normalizePhone,
  setVerificationCookie,
} from "@/lib/otp.server";
import { getLatestOtpRequest, incrementOtpAttempt, markOtpVerified } from "@/lib/pedo-registrations-db";

type VerifyOtpPayload = {
  phone?: string;
  otp?: string;
};

export async function POST(request: Request) {
  let payload: VerifyOtpPayload;

  try {
    payload = (await request.json()) as VerifyOtpPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const phoneNumber = normalizePhone(payload.phone);
  const otp = payload.otp?.replace(/\D/g, "") || "";

  if (!isValidPhone(phoneNumber)) {
    return NextResponse.json({ ok: false, error: "Please enter a 10 digit mobile number." }, { status: 400 });
  }

  if (!/^\d{6}$/.test(otp)) {
    return NextResponse.json({ ok: false, error: "Please enter the 6 digit OTP." }, { status: 400 });
  }

  const requestRow = await getLatestOtpRequest(phoneNumber);
  if (!requestRow) {
    return NextResponse.json({ ok: false, error: "Please request an OTP first." }, { status: 400 });
  }

  if (requestRow.verified_at) {
    const response = NextResponse.json({ ok: true });
    setVerificationCookie(
      response,
      createVerificationCookieValue({
        phoneNumber,
        otpRequestId: Number(requestRow.id),
        verifiedAt: requestRow.verified_at.getTime(),
      }),
    );
    return response;
  }

  if (requestRow.expires_at.getTime() < Date.now()) {
    return NextResponse.json({ ok: false, error: "This OTP has expired. Please request a new OTP." }, { status: 400 });
  }

  if (requestRow.attempt_count >= requestRow.max_attempts) {
    return NextResponse.json(
      { ok: false, error: "Too many incorrect attempts. Please request a new OTP." },
      { status: 429 },
    );
  }

  if (hashOtp(phoneNumber, otp) !== requestRow.otp_hash) {
    await incrementOtpAttempt(Number(requestRow.id));
    return NextResponse.json({ ok: false, error: "Incorrect OTP. Please try again." }, { status: 400 });
  }

  const verifiedAt = await markOtpVerified(Number(requestRow.id));
  const response = NextResponse.json({ ok: true });
  setVerificationCookie(
    response,
    createVerificationCookieValue({
      phoneNumber,
      otpRequestId: Number(requestRow.id),
      verifiedAt: verifiedAt.getTime(),
    }),
  );

  return response;
}

