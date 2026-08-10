"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

const announcements = [
  {
    title: "Free Pediatric Consultation",
    text: "26 Sep - 3 Oct, Majiwada only",
    href: "/pedo-dentist-free-consultation",
    cta: "Register",
  },
  {
    title: "Open Day for Aligners",
    text: "Every 1st & 3rd Saturday, free consultation",
    href: "/aligner-open-day",
    cta: "Read More",
  },
];

const announcementDismissedKey = "dantam-campaign-announcement-dismissed";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = window.setInterval(() => {
      setAnnouncementIndex((current) => (current + 1) % announcements.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setAnnouncementDismissed(window.sessionStorage.getItem(announcementDismissedKey) === "true");
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const announcement = announcements[announcementIndex];
  const showAnnouncement =
    !announcementDismissed &&
    !announcements.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  function dismissAnnouncement() {
    window.sessionStorage.setItem(announcementDismissedKey, "true");
    setAnnouncementDismissed(true);
  }

  return (
    <header className="site-header">
      {showAnnouncement && (
        <div className={`topbar${announcements.length > 1 ? " rotating" : ""}`}>
          <div className="container topbar-inner">
            <Link className="announcement-link" href={announcement.href}>
              <span className="announcement-title">{announcement.title}</span>
              <span className="announcement-text">{announcement.text}</span>
              <span className="announcement-cta">{announcement.cta}</span>
            </Link>
            <button
              className="announcement-dismiss"
              type="button"
              aria-label="Dismiss announcement"
              onClick={dismissAnnouncement}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

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
