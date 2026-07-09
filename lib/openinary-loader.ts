import { openinaryUrl } from "./openinary";

type LoaderParams = {
  src: string;
  width: number;
  quality?: number;
};

export default function openinaryLoader({ src, width, quality }: LoaderParams) {
  const [path, query = ""] = src.split("?");
  const params = new URLSearchParams(query);
  const transforms = [`w_${width}`, `q_${quality ?? params.get("q") ?? 75}`, `f_${params.get("f") ?? "webp"}`];
  const height = params.get("h") ?? heightFromAspectRatio(width, params.get("ar"));
  const crop = params.get("c");

  if (height) transforms.splice(1, 0, `h_${height}`);
  if (crop) transforms.splice(height ? 2 : 1, 0, `c_${crop}`);

  return openinaryUrl(path, transforms.join(","));
}

function heightFromAspectRatio(width: number, aspectRatio: string | null) {
  if (!aspectRatio) return null;

  const [rawWidth, rawHeight] = aspectRatio.split(":").map((value) => Number.parseFloat(value));
  if (!rawWidth || !rawHeight) return null;

  return String(Math.round((width * rawHeight) / rawWidth));
}
