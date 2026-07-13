import type { Metadata } from "next";
import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClinicLocationCards } from "@/components/clinic-location-cards";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { seoMetadata } from "@/lib/seo-metadata";
import { site } from "@/lib/site";
import "./contact.css";

const title = "Contact & Book";
const description = "Book an appointment at Dantam Dental Care in Thane. Call, WhatsApp or fill the contact form.";

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    title: "Contact Dantam Dental Care",
    description,
    image: "/images/hero-clinic.jpg",
    imageAlt: "Dantam Dental Care clinic in Thane",
    path: "/contact",
  });
}

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]} />
      <PageHero
        eyebrow="Get in Touch"
        title="Book your visit."
        subtitle="Choose the clinic closest to you, then call, WhatsApp, or fill the form. We usually reply within an hour during clinic hours."
      />

      <section className="section">
        <div className="container">
          <ClinicLocationCards />

          <div className="contact-grid">
            <div className="contact-info">
              <div className="visit-card">
                <h2>Need help booking?</h2>
                <p>Call, WhatsApp, or send the form and we will help you choose the right clinic.</p>
                <div className="contact-items">
                  <div>
                    <Clock size={20} />
                    <span>{site.hours}</span>
                  </div>
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
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
