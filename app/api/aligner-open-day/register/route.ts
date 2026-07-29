import { NextResponse } from "next/server";

type RegistrationPayload = {
  campaign?: string;
  date?: string;
  selectedDateLabel?: string;
  name?: string;
  age?: string;
  sex?: string;
  mobile?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as RegistrationPayload;

  if (!payload.date || !payload.name?.trim() || !payload.age?.trim() || !payload.sex || !payload.mobile?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_ALIGNER_OPEN_DAY_WEBHOOK_URL;
  const registration = {
    ...payload,
    source: "dantamdentalcare.com/aligner-open-day",
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
