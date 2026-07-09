import type { Metadata } from "next";
import { openinaryUrl } from "@/lib/openinary";
import { site } from "@/lib/site";

const socialImageTransform = "w_1200,h_630,c_fill,q_82,f_jpg";

export function socialImage(path: string) {
  return openinaryUrl(path, socialImageTransform);
}

export function socialMetadata({
  title,
  description,
  image,
  imageAlt,
  path,
}: {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  path: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const url = `https://dantamdentalcare.com${path}`;
  const imageUrl = socialImage(image);

  return {
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: "image/jpeg",
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
