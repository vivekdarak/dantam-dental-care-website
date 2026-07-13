import { MapPin, Navigation, Phone } from "lucide-react";
import Link from "next/link";
import { locations } from "@/lib/site";
import "./clinic-location-cards.css";

export function ClinicLocationCards({ showDetailsLink = false }: { showDetailsLink?: boolean }) {
  return (
    <div className="locations-grid">
      {locations.map((location) => (
        <article className="location-card" key={location.name}>
          <div className="location-map-frame">
            <iframe
              src={location.mapEmbed}
              title={`${location.name} map`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <span className="location-area">
            <MapPin size={16} />
            {location.area}
          </span>
          <h3>
            {showDetailsLink ? (
              <Link href={`/locations/${location.slug}`}>{location.name}</Link>
            ) : (
              location.name
            )}
          </h3>
          <p>{location.address}</p>
          <div className="location-phone-list">
            <a className="location-phone" href={location.phone.href}>
              <Phone size={15} />
              {location.phone.label}
            </a>
          </div>
          <div className="location-actions">
            {showDetailsLink && (
              <Link className="button outline" href={`/locations/${location.slug}`}>
                View clinic
              </Link>
            )}
            <a className="button dark" href={location.mapLink} target="_blank" rel="noreferrer">
              <Navigation size={16} />
              Directions
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
