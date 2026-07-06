import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/site";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact & Book",
  description: "Book an appointment at Dantam Dental Care in Thane. Call, WhatsApp or fill the contact form.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Book your visit."
        subtitle="Fill the form, call, or WhatsApp. We usually reply within an hour during clinic hours."
      />

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <div className="visit-card">
              <h2>Visit the clinic</h2>
              <div className="contact-items">
                <a href={site.mapLink} target="_blank" rel="noreferrer">
                  <MapPin size={20} />
                  <span>{site.location}<small>Tap for Google Maps directions</small></span>
                </a>
                <div>
                  <Clock size={20} />
                  <span>{site.hours}</span>
                </div>
                {site.phones.map((phone) => (
                  <a href={phone.href} key={phone.href}>
                    <Phone size={20} />
                    <span>{phone.label}</span>
                  </a>
                ))}
                <a href={site.email.href}>
                  <Mail size={20} />
                  <span>{site.email.label}</span>
                </a>
              </div>
              <div className="contact-actions">
                <a className="button whatsapp" href={site.whatsapp.href} target="_blank" rel="noreferrer">
                  <MessageCircle size={17} />
                  WhatsApp
                </a>
                <a className="button outline" href={site.phones[0].href}>
                  <Phone size={17} />
                  Call
                </a>
              </div>
            </div>

            <div className="map-frame">
              <iframe
                src={site.mapEmbed}
                title="Dantam Dental Care map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
