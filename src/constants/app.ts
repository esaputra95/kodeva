export const APP_NAME = "Kodeva";
export const DEFAULT_CAMPAIGN_ID = "promo-akhir-tahun";
export const BLOG_PAGE_SIZE = 6;
export const CHECKOUT_SNAPSHOT_TTL_MS = 2 * 60 * 60 * 1000;
// Public CMS reads stay fresh after a Sanity publish. The demo has low traffic,
// so request-time reads are a better fit than waiting on a time-based cache.
export const REVALIDATE_SECONDS = 0;

export const ROUTES = {
  home: "/",
  products: "/products",
  blog: "/blog",
  cart: "/cart",
  checkout: "/checkout",
  adminLogin: "/admin/login",
  adminLeads: "/admin",
  campaignLinks: "/admin/campaign-links",
  studio: "/studio",
} as const;
