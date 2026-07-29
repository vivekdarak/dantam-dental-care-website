"use client";

import { CalendarCheck, Send } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type FormState = {
  date: string;
  name: string;
  age: string;
  sex: string;
  mobile: string;
};

type OpenDayDate = {
  value: string;
  label: string;
  shortLabel: string;
};

const initialForm: FormState = {
  date: "",
  name: "",
  age: "",
  sex: "",
  mobile: "",
};

const formatter = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

function isOpenDay(date: Date) {
  if (date.getDay() !== 6) return false;

  const day = date.getDate();
  let saturdayCount = 0;

  for (let currentDay = 1; currentDay <= day; currentDay += 1) {
    const current = new Date(date.getFullYear(), date.getMonth(), currentDay);
    if (current.getDay() === 6) saturdayCount += 1;
  }

  return saturdayCount === 1 || saturdayCount === 3;
}

function getNextOpenDays(count: number): OpenDayDate[] {
  const dates: OpenDayDate[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (dates.length < count) {
    if (isOpenDay(cursor)) {
      const value = [
        cursor.getFullYear(),
        String(cursor.getMonth() + 1).padStart(2, "0"),
        String(cursor.getDate()).padStart(2, "0"),
      ].join("-");
      const label = `${formatter.format(cursor)}, 4:00 PM - 6:00 PM`;

      dates.push({
        value,
        label,
        shortLabel: formatter.format(cursor),
      });
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function AlignerOpenDayForm() {
  const openDays = useMemo(() => getNextOpenDays(2), []);
  const [form, setForm] = useState<FormState>({ ...initialForm, date: openDays[0]?.value || "" });
  const [status, setStatus] = useState<"idle" | "error" | "sending" | "sent" | "preview">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.date || !form.name.trim() || !form.age.trim() || !form.sex || !form.mobile.trim()) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/aligner-open-day/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          campaign: "Open Day for Aligners",
          selectedDateLabel: openDays.find((day) => day.value === form.date)?.label,
        }),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      const payload = (await response.json()) as { forwarded?: boolean };
      setStatus(payload.forwarded ? "sent" : "preview");
      setForm({ ...initialForm, date: openDays[0]?.value || "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="open-day-form" onSubmit={onSubmit}>
      <div className="open-day-form-header">
        <div>
          <div className="eyebrow">Reserve your visit</div>
          <h2>Book your free slot</h2>
        </div>
        <CalendarCheck aria-hidden="true" size={34} />
      </div>
      <p>
        Select one of the next two Open Day sessions. Our team may call or WhatsApp you to confirm your visit within
        the 4:00 PM to 6:00 PM window.
      </p>

      <fieldset className="open-day-date-options">
        <legend>Select Open Day date</legend>
        {openDays.map((day) => (
          <label key={day.value} className={form.date === day.value ? "selected" : ""}>
            <input
              required
              type="radio"
              name="date"
              value={day.value}
              checked={form.date === day.value}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
            <span>{day.shortLabel}</span>
            <small>4:00 PM - 6:00 PM</small>
          </label>
        ))}
      </fieldset>

      <div className="open-day-form-grid">
        <label>
          Name *
          <input
            required
            autoComplete="name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <label>
          Age *
          <input
            required
            inputMode="numeric"
            min="1"
            max="99"
            type="number"
            value={form.age}
            onChange={(event) => setForm({ ...form, age: event.target.value })}
          />
        </label>
        <label>
          Sex *
          <select required value={form.sex} onChange={(event) => setForm({ ...form, sex: event.target.value })}>
            <option value="">Select</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>
        <label>
          Mobile number *
          <input
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91"
            type="tel"
            value={form.mobile}
            onChange={(event) => setForm({ ...form, mobile: event.target.value })}
          />
        </label>
      </div>

      {status === "error" && <div className="form-status error">Please check the required fields and try again.</div>}
      {status === "sent" && <div className="form-status sent">Your registration details were sent successfully.</div>}
      {status === "preview" && (
        <div className="form-status sent">Local preview received. Add the n8n webhook URL to forward these details.</div>
      )}

      <button className="button primary" type="submit" disabled={status === "sending"}>
        <Send size={17} />
        {status === "sending" ? "Sending..." : "Confirm free slot"}
      </button>
    </form>
  );
}

export function UpcomingOpenDays() {
  const openDays = useMemo(() => getNextOpenDays(2), []);

  return (
      <div className="hero-upcoming-dates" aria-label="Upcoming Open Day for Aligners dates">
      <strong>Upcoming Open Days</strong>
      <div>
        {openDays.map((day) => (
          <span key={day.value}>{day.shortLabel}</span>
        ))}
      </div>
    </div>
  );
}
