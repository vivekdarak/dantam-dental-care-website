import { Pool, type QueryResultRow } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var dantamReviewPool: Pool | undefined;
}

export type ReviewRequestLog = {
  id: number;
  patientName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  branchSlug: string;
  branchName: string;
  n8nStatusCode: number | null;
  n8nResponse: unknown;
  source: string;
  createdAt: string;
  createdAtDisplay: string;
};

type ReviewRequestRow = QueryResultRow & {
  id: string;
  patient_name: string;
  phone_country_code: string;
  phone_number: string;
  branch_slug: string;
  branch_name: string;
  n8n_status_code: number | null;
  n8n_response: unknown;
  source: string;
  created_at: Date;
  created_at_display: string;
};

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!global.dantamReviewPool) {
    global.dantamReviewPool = new Pool({
      connectionString,
      ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
    });
  }

  return global.dantamReviewPool;
}

function timezone() {
  return process.env.INTERNAL_REVIEW_TIMEZONE || "Asia/Kolkata";
}

function mapReviewRequest(row: ReviewRequestRow): ReviewRequestLog {
  return {
    id: Number(row.id),
    patientName: row.patient_name,
    phoneCountryCode: row.phone_country_code,
    phoneNumber: row.phone_number,
    branchSlug: row.branch_slug,
    branchName: row.branch_name,
    n8nStatusCode: row.n8n_status_code,
    n8nResponse: row.n8n_response,
    source: row.source,
    createdAt: row.created_at.toISOString(),
    createdAtDisplay: row.created_at_display,
  };
}

const SELECT_LOG_FIELDS = `
  id,
  patient_name,
  phone_country_code,
  phone_number,
  branch_slug,
  branch_name,
  n8n_status_code,
  n8n_response,
  source,
  created_at,
  to_char(created_at AT TIME ZONE $1, 'DD Mon YYYY, HH12:MI AM') AS created_at_display
`;

async function getReviewRequestById(id: number) {
  const result = await getPool().query<ReviewRequestRow>(
    `
      SELECT ${SELECT_LOG_FIELDS}
      FROM review_requests
      WHERE id = $2
    `,
    [timezone(), id],
  );

  return result.rows[0] ? mapReviewRequest(result.rows[0]) : null;
}

export async function findReviewRequestsByPhone(phoneNumber: string, limit = 5) {
  const result = await getPool().query<ReviewRequestRow>(
    `
      SELECT ${SELECT_LOG_FIELDS}
      FROM review_requests
      WHERE phone_number = $2
      ORDER BY created_at DESC
      LIMIT $3
    `,
    [timezone(), phoneNumber, limit],
  );

  return result.rows.map(mapReviewRequest);
}

export async function listReviewRequests({
  page,
  search,
}: {
  page: number;
  search: string;
}) {
  const pageSize = 10;
  const currentPage = Math.max(1, page);
  const offset = (currentPage - 1) * pageSize;
  const trimmedSearch = search.trim();
  const selectParams: unknown[] = [timezone()];
  const countParams: unknown[] = [];
  let whereClause = "";

  if (trimmedSearch) {
    const nameSearch = `%${trimmedSearch.toLowerCase()}%`;
    const phoneSearch = `%${trimmedSearch.replace(/\D/g, "")}%`;
    countParams.push(nameSearch, phoneSearch);
    selectParams.push(nameSearch, phoneSearch);
    whereClause = `
      WHERE LOWER(patient_name) LIKE $${selectParams.length - 1}
      OR phone_number LIKE $${selectParams.length}
    `;
  }

  const countResult = await getPool().query<{ count: string }>(
    trimmedSearch
      ? `
        SELECT COUNT(*)::text AS count
        FROM review_requests
        WHERE LOWER(patient_name) LIKE $1
        OR phone_number LIKE $2
      `
      : "SELECT COUNT(*)::text AS count FROM review_requests",
    countParams,
  );

  selectParams.push(pageSize, offset);

  const result = await getPool().query<ReviewRequestRow>(
    `
      SELECT ${SELECT_LOG_FIELDS}
      FROM review_requests
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${selectParams.length - 1}
      OFFSET $${selectParams.length}
    `,
    selectParams,
  );

  const total = Number(countResult.rows[0]?.count || 0);

  return {
    items: result.rows.map(mapReviewRequest),
    page: currentPage,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function insertReviewRequest(input: {
  patientName: string;
  phoneNumber: string;
  branchSlug: string;
  branchName: string;
  n8nStatusCode: number | null;
  n8nResponse: unknown;
  requesterIp: string | null;
  userAgent: string | null;
}) {
  const result = await getPool().query<{ id: string }>(
    `
      INSERT INTO review_requests (
        patient_name,
        phone_number,
        branch_slug,
        branch_name,
        n8n_status_code,
        n8n_response,
        requester_ip,
        user_agent
      )
      VALUES ($1, $2, $3, $4, $5, $6::jsonb, NULLIF($7, '')::inet, $8)
      RETURNING id
    `,
    [
      input.patientName,
      input.phoneNumber,
      input.branchSlug,
      input.branchName,
      input.n8nStatusCode,
      JSON.stringify(input.n8nResponse ?? null),
      input.requesterIp || "",
      input.userAgent,
    ],
  );

  const inserted = await getReviewRequestById(Number(result.rows[0].id));
  if (!inserted) {
    throw new Error("Inserted review request could not be loaded.");
  }

  return inserted;
}
