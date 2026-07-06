import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/site";

type Service = (typeof services)[number];

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link className="service-card card" href={`/services/${service.slug}`}>
      <div className="service-card-image">
        <Image src={service.image} alt={service.title} fill sizes="(max-width: 760px) 100vw, 33vw" />
      </div>
      <div className="service-card-body">
        <h3>{service.title}</h3>
        <p>{service.short}</p>
        <span>
          Learn more <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}
