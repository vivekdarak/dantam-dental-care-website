import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { OpeninaryImage } from "@/components/openinary-image";
import { services } from "@/lib/site";

type Service = (typeof services)[number];

export function ServiceCard({ service }: { service: Service }) {
  const isContainedImage = "imageFit" in service && service.imageFit === "contain";

  return (
    <Link className="service-card card" href={`/services/${service.slug}`}>
      <div className={`service-card-image${isContainedImage ? " service-card-image-contain" : ""}`}>
        <OpeninaryImage
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 760px) 100vw, 33vw"
          {...(!isContainedImage && { aspectRatio: "4:3" as const, cropMode: "fill" as const })}
        />
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
