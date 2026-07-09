import Image, { type ImageProps } from "next/image";

type OpeninaryImageProps = Omit<ImageProps, "src"> & {
  src: string;
  aspectRatio?: `${number}:${number}`;
  cropHeight?: number;
  cropMode?: "fill" | "fit" | "cover" | "contain";
  format?: "webp" | "avif" | "jpg";
};

export function OpeninaryImage({ src, aspectRatio, cropHeight, cropMode, format = "webp", quality, ...props }: OpeninaryImageProps) {
  const params = new URLSearchParams();

  if (aspectRatio) params.set("ar", aspectRatio);
  if (cropHeight) params.set("h", String(cropHeight));
  if (cropMode) params.set("c", cropMode);
  if (format) params.set("f", format);
  if (quality) params.set("q", String(quality));

  const transformedSrc = params.size ? `${src}?${params.toString()}` : src;

  return <Image {...props} src={transformedSrc} quality={quality} />;
}
