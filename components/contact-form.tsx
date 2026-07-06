"use client";

import { Send } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { services } from "@/lib/site";
import "./contact-form.css";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  service: "",
  date: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "error" | "sent">("idle");

  const message = useMemo(() => {
    const selected = form.service ? `Service: ${form.service}%0A` : "";
    const date = form.date ? `Preferred date: ${form.date}%0A` : "";
    return `Hello Dantam Dental Care,%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AEmail: ${form.email || "-"}%0A${selected}${date}Message: ${form.message || "-"}`;
  }, [form]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sent");
    window.open(`https://wa.me/918484092077?text=${message}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <h3>Send us a message</h3>
      <p>For now, the form opens WhatsApp with your details pre-filled.</p>
      <div className="form-grid">
        <label>
          Name *
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <label>
          Phone *
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          Preferred date
          <input
            type="date"
            value={form.date}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
          />
        </label>
        <label className="wide">
          Service
          <select
            value={form.service}
            onChange={(event) => setForm({ ...form, service: event.target.value })}
          >
            <option value="">Select a service</option>
            <option value="General Consultation">General Consultation</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
        <label className="wide">
          Message
          <textarea
            rows={5}
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            placeholder="Tell us briefly what you'd like to discuss..."
          />
        </label>
      </div>
      {status === "error" && <div className="form-status error">Please enter your name and phone number.</div>}
      {status === "sent" && <div className="form-status sent">WhatsApp opened with your message details.</div>}
      <button className="button primary" type="submit">
        <Send size={17} />
        Send message
      </button>
    </form>
  );
}
