import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { services, site } from "@/lib/site";
import { Brand } from "./brand";
import "./site-footer.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/dentists", label: "Our Dentists" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
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
            {links.map((link) => (
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
          <h4>Visit Us</h4>
          <ul className="contact-list">
            <li>
              <MapPin size={17} />
              <a href={site.mapLink} target="_blank" rel="noreferrer">
                {site.location}
              </a>
            </li>
            <li>
              <Clock size={17} />
              <span>{site.hours}</span>
            </li>
            {site.phones.map((phone) => (
              <li key={phone.href}>
                <Phone size={17} />
                <a href={phone.href}>{phone.label}</a>
              </li>
            ))}
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
