export const OPENINARY_FOLDER = "dantam-dental-care";

const openinaryBaseUrl = process.env.NEXT_PUBLIC_OPENINARY_BASE_URL?.replace(/\/$/, "") ?? "";

export function openinaryPath(path: string) {
  const cleanPath = path.replace(/^\/+/, "");

  if (cleanPath.startsWith(`${OPENINARY_FOLDER}/`)) {
    return cleanPath;
  }

  if (cleanPath.startsWith("images/")) {
    return `${OPENINARY_FOLDER}/${cleanPath.replace(/^images\//, "")}`;
  }

  return `${OPENINARY_FOLDER}/${cleanPath}`;
}

export function openinaryUrl(path: string, transforms?: string) {
  const mediaPath = openinaryPath(path);

  if (!openinaryBaseUrl) {
    return `/${mediaPath.replace(`${OPENINARY_FOLDER}/`, "images/")}`;
  }

  if (!transforms) {
    return `${openinaryBaseUrl}/t/${mediaPath}`;
  }

  return `${openinaryBaseUrl}/t/${transforms}/${mediaPath}`;
}
