"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { Brand } from "./brand";
import "./site-header.css";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/dentists", label: "Our Dentists" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <span>{site.hours}</span>
          <div>
            <a href={site.phones[0].href}>{site.phones[0].label}</a>
            <a href={site.email.href}>{site.email.label}</a>
          </div>
        </div>
      </div>

      <div className="container nav-row">
        <Brand />

        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={isActive(item.href) ? "active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="button primary book-link" href="/contact">
            Book Appointment
          </Link>
          <button
            className="menu-button"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav container" aria-label="Mobile navigation">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link className="button primary" href="/contact" onClick={() => setOpen(false)}>
            Book Appointment
          </Link>
        </nav>
      )}
    </header>
  );
}
