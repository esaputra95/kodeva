import { z } from "zod";
import { PRODUCTS } from "@/features/products/model/catalog";

export const CampaignLinkSchema = z
  .object({
    destination: z.string().min(1).max(500),
    source: z.enum(["instagram", "tiktok"]),
    medium: z.enum(["social", "paid_social"]),
    campaign: z.string().trim().min(1, "Nama campaign wajib diisi.").max(100),
    term: z.string().trim().max(200).optional().default(""),
    content: z.string().trim().max(200).optional().default(""),
  })
  .strict();

export type CampaignLinkInput = z.input<typeof CampaignLinkSchema>;

export function buildCampaignUrl(baseUrl: string, input: CampaignLinkInput): string {
  const parsed = CampaignLinkSchema.parse(input);
  const base = new URL(baseUrl);
  const destination = new URL(parsed.destination, base);
  if (destination.origin !== base.origin || !["http:", "https:"].includes(destination.protocol))
    throw new Error("Tujuan hanya boleh menuju halaman Kodeva.");
  const allowedPaths = new Set([
    "/",
    "/products",
    "/blog",
    ...PRODUCTS.map((product) => `/products/${product.slug}`),
  ]);
  if (!allowedPaths.has(destination.pathname))
    throw new Error("Pilih landing, katalog, blog, atau detail produk Kodeva.");
  const params = destination.searchParams;
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"])
    params.delete(key);
  params.set("utm_source", parsed.source);
  params.set("utm_medium", parsed.medium);
  params.set("utm_campaign", parsed.campaign);
  if (parsed.term) params.set("utm_term", parsed.term);
  if (parsed.content) params.set("utm_content", parsed.content);
  return destination.toString();
}
