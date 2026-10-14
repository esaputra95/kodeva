import type { Attribution } from "./attribution";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
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
