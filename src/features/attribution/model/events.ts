import type { Attribution } from "./attribution";
import type { ShareContent } from "@/features/sharing/types";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackShare(content: ShareContent, method: "native" | "copy" | "whatsapp") {
  if (typeof window === "undefined") return;
  window.dataLayer ??= [];
  window.dataLayer.push({
    event: "share",
    content_type: content.kind,
    item_id: content.id,
    method,
  });
}

type EcommerceItem = {
  item_id: string;
  item_name: string;
  item_category: string;
  item_variant?: string;
  price: number;
  quantity: number;
};

export function trackEcommerceEvent(
  event: "view_item" | "add_to_cart" | "begin_checkout",
  input: {
    currency: "IDR";
    value: number;
    items: EcommerceItem[];
    campaignId?: string;
    attribution?: Attribution;
  },
) {
  if (typeof window === "undefined") return;
  window.dataLayer ??= [];
  window.dataLayer.push({
    event,
    campaign_id: input.campaignId || input.attribution?.campaignId || "promo-akhir-tahun",
    ...(input.attribution?.utm ? { utm: input.attribution.utm } : {}),
    ecommerce: { currency: input.currency, value: input.value, items: input.items },
  });
}

export function trackLandingCta(input: {
  ctaId: string;
  destination: string;
  campaignId?: string;
  attribution?: Attribution;
}) {
  if (typeof window === "undefined") return;
  window.dataLayer ??= [];
  window.dataLayer.push({
    event: "landing_cta_click",
    campaign_id: input.campaignId || input.attribution?.campaignId || "promo-akhir-tahun",
    cta_id: input.ctaId,
    destination: input.destination,
    ...(input.attribution?.utm ? { utm: input.attribution.utm } : {}),
  });
}
