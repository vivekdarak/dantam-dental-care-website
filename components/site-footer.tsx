import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { locations, services, site } from "@/lib/site";
import { Brand } from "./brand";
import "./site-footer.css";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/dentists", label: "Our Dentists" },
  { href: "/gallery", label: "Gallery" },
];

const patientResourceLinks = [
  { href: "/patient-instructions", label: "Patient Instructions" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/review-us", label: "Review Us" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <Brand compact />
          </div>
          <p>
            A modern dental practice in Thane offering implantology, cosmetic dentistry,
            single-sitting root canals and paediatric care under one calm roof.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <h4 className="footer-subheading">Patient Resources</h4>
          <ul>
            {patientResourceLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Services</h4>
          <ul>
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`}>{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Our Clinics</h4>
          <ul className="contact-list">
            {locations.map((location) => (
              <li key={location.name}>
                <MapPin size={17} />
                <a href={location.mapLink} target="_blank" rel="noreferrer">
                  <strong>{location.area}</strong>
                  <span>{location.name}</span>
                </a>
              </li>
            ))}
            <li>
              <Clock size={17} />
              <span>{site.hours}</span>
            </li>
            <li>
              <Phone size={17} />
              <a href={site.phones[0].href}>{site.phones[0].label}</a>
            </li>
            <li>
              <Mail size={17} />
              <a href={site.email.href}>{site.email.label}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} Dantam Dental Care. All rights reserved.</span>
          <span>Smile for a lifetime.</span>
        </div>
      </div>
    </footer>
  );
}
