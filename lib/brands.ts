export const BRANDS = [
  "Apple",
  "Samsung",
  "ASUS ROG",
  "Sony",
  "Google",
  "Xiaomi",
  "OPPO",
  "vivo",
  "OnePlus",
  "Nothing",
  "Motorola",
  "Nokia",
] as const;

export type Brand = (typeof BRANDS)[number];

export function brandSlug(brand: string) {
  return encodeURIComponent(brand.toLowerCase().replace(/\s+/g, "-"));
}

export function slugToBrand(slug: string): string {
  return decodeURIComponent(slug)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
