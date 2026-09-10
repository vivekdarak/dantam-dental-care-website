import { Pool, type QueryResultRow } from "pg";
import { OTP_COUNTRY_CODE, OTP_MAX_ATTEMPTS, OTP_PURPOSE, whatsappNumber } from "@/lib/otp.server";

declare global {
  // eslint-disable-next-line no-var
  var dantamPedoPool: Pool | undefined;
}

export type OtpRequestRow = QueryResultRow & {
  id: string;
  phone_number: string;
  otp_hash: string;
  attempt_count: number;
  max_attempts: number;
  expires_at: Date;
  verified_at: Date | null;
  created_at: Date;
};

export type PedoRegistrationChild = {
  name: string;
  age: string;
};

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!global.dantamPedoPool) {
    global.dantamPedoPool = new Pool({
      connectionString,
      ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
    });
  }

  return global.dantamPedoPool;
}

export async function getOtpRequestStats(phoneNumber: string) {
  const result = await getPool().query<{
    request_count: string;
    latest_created_at: Date | null;
  }>(
    `
      SELECT
        COUNT(*)::text AS request_count,
        MAX(created_at) AS latest_created_at
      FROM phone_otp_requests
      WHERE country_code = $1
      AND phone_number = $2
      AND purpose = $3
      AND created_at > now() - interval '24 hours'
    `,
    [OTP_COUNTRY_CODE, phoneNumber, OTP_PURPOSE],
  );

  return {
    requestCount: Number(result.rows[0]?.request_count || 0),
    latestCreatedAt: result.rows[0]?.latest_created_at || null,
  };
}

export async function insertOtpRequest(input: {
  phoneNumber: string;
  otpHash: string;
  expiresAt: Date;
  requestIpHash: string | null;
  userAgent: string | null;
}) {
  const result = await getPool().query<{ id: string }>(
    `
      INSERT INTO phone_otp_requests (
        country_code,
        phone_number,
        whatsapp_number,
        purpose,
        otp_hash,
        max_attempts,
        expires_at,
        request_ip_hash,
        user_agent
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `,
    [
      OTP_COUNTRY_CODE,
      input.phoneNumber,
      whatsappNumber(input.phoneNumber),
      OTP_PURPOSE,
      input.otpHash,
      OTP_MAX_ATTEMPTS,
      input.expiresAt,
      input.requestIpHash,
      input.userAgent,
    ],
  );

  return Number(result.rows[0].id);
}

export async function getLatestOtpRequest(phoneNumber: string) {
  const result = await getPool().query<OtpRequestRow>(
    `
      SELECT id, phone_number, otp_hash, attempt_count, max_attempts, expires_at, verified_at, created_at
      FROM phone_otp_requests
      WHERE country_code = $1
      AND phone_number = $2
      AND purpose = $3
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [OTP_COUNTRY_CODE, phoneNumber, OTP_PURPOSE],
  );

  return result.rows[0] || null;
}

export async function incrementOtpAttempt(id: number) {
  await getPool().query(
    `
      UPDATE phone_otp_requests
      SET attempt_count = attempt_count + 1
      WHERE id = $1
    `,
    [id],
  );
}

export async function markOtpVerified(id: number) {
  const result = await getPool().query<{ verified_at: Date }>(
    `
      UPDATE phone_otp_requests
      SET verified_at = COALESCE(verified_at, now())
      WHERE id = $1
      RETURNING verified_at
    `,
    [id],
  );

  return result.rows[0]?.verified_at || new Date();
}

export async function insertPedoRegistration(input: {
  campaign: string;
  preferredDate: string;
  selectedDateLabel: string | null;
  parentName: string;
  phoneNumber: string;
  children: PedoRegistrationChild[];
  childName: string;
  childAge: string;
  concern: string | null;
  otherConcern: string | null;
  childNotPresent: boolean;
  phoneVerifiedAt: Date | null;
  otpRequestId: number | null;
  n8nStatusCode: number | null;
  n8nResponse: unknown;
  requesterIp: string | null;
  userAgent: string | null;
}) {
  const result = await getPool().query<{ id: string }>(
    `
      INSERT INTO pedo_consultation_registrations (
        campaign,
        preferred_date,
        selected_date_label,
        parent_name,
        phone_country_code,
        phone_number,
        whatsapp_number,
        children,
        child_name,
        child_age,
        concern,
        other_concern,
        child_not_present,
        phone_verified,
        phone_verified_at,
        otp_request_id,
        n8n_status_code,
        n8n_response,
        requester_ip,
        user_agent
      )
      VALUES (
        $1, $2::date, $3, $4, $5, $6, $7, $8::jsonb, $9, $10,
        $11, $12, $13, true, $14, $15, $16, $17::jsonb, NULLIF($18, '')::inet, $19
      )
      RETURNING id
    `,
    [
      input.campaign,
      input.preferredDate,
      input.selectedDateLabel,
      input.parentName,
      OTP_COUNTRY_CODE,
      input.phoneNumber,
      whatsappNumber(input.phoneNumber),
      JSON.stringify(input.children),
      input.childName,
      input.childAge,
      input.concern,
      input.otherConcern,
      input.childNotPresent,
      input.phoneVerifiedAt,
      input.otpRequestId,
      input.n8nStatusCode,
      JSON.stringify(input.n8nResponse ?? null),
      input.requesterIp || "",
      input.userAgent,
    ],
  );

  return Number(result.rows[0].id);
}

