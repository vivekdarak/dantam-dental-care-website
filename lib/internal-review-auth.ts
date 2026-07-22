import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "dantam_internal_review_session";
const LAST_SEND_COOKIE = "dantam_internal_review_last_send";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const COOLDOWN_SECONDS = 30;

function getSecret() {
  const secret = process.env.INTERNAL_REVIEW_SESSION_SECRET;
  if (!secret) {
    throw new Error("INTERNAL_REVIEW_SESSION_SECRET is not configured.");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function verifySignedValue(rawValue?: string) {
  if (!rawValue) return null;
  const [value, signature] = rawValue.split(".");
  if (!value || !signature) return null;

  const expected = sign(value);
  const actualBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (actualBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(actualBuffer, expectedBuffer)) return null;

  return value;
}

function createSignedValue(value: string) {
  return `${value}.${sign(value)}`;
}

export async function hasInternalReviewSession() {
  const cookieStore = await cookies();
  const value = verifySignedValue(cookieStore.get(SESSION_COOKIE)?.value);
  if (!value) return false;

  const [expiresAt] = value.split(":");
  const expiresAtMs = Number.parseInt(expiresAt, 10);
  return Number.isFinite(expiresAtMs) && expiresAtMs > Date.now();
}

export async function createInternalReviewSession() {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const nonce = randomBytes(16).toString("hex");

  cookieStore.set(SESSION_COOKIE, createSignedValue(`${expiresAt}:${nonce}`), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearInternalReviewSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(LAST_SEND_COOKIE);
}

export async function getReviewSendCooldown() {
  const cookieStore = await cookies();
  const value = verifySignedValue(cookieStore.get(LAST_SEND_COOKIE)?.value);
  const lastSendMs = value ? Number.parseInt(value, 10) : 0;
  if (!Number.isFinite(lastSendMs)) return 0;

  const elapsedSeconds = Math.floor((Date.now() - lastSendMs) / 1000);
  return Math.max(0, COOLDOWN_SECONDS - elapsedSeconds);
}

export async function setReviewSendCooldown() {
  const cookieStore = await cookies();
  cookieStore.set(LAST_SEND_COOKIE, createSignedValue(String(Date.now())), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOLDOWN_SECONDS,
  });
}

