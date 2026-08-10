import { NextResponse } from "next/server";

type RegistrationPayload = {
  campaign?: string;
  date?: string;
  selectedDateLabel?: string;
  parentName?: string;
  mobile?: string;
  childName?: string;
  childAge?: string;
  concern?: string;
  otherConcern?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as RegistrationPayload;

  if (
    !payload.date ||
    !payload.parentName?.trim() ||
    !payload.mobile?.trim() ||
    !payload.childName?.trim() ||
    !payload.childAge?.trim() ||
    !payload.concern ||
    (payload.concern === "Other concern" && !payload.otherConcern?.trim())
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_PEDO_DENTIST_WEBHOOK_URL;
  const registration = {
    ...payload,
    source: "dantamdentalcare.com/pedo-dentist-free-consultation",
    submittedAt: new Date().toISOString(),
  };

  if (!webhookUrl) {
    return NextResponse.json({ forwarded: false, registration }, { status: 202 });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registration),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Webhook delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ forwarded: true });
}
