export const PRODUCT_CATEGORIES = ["Kasir", "HR & Payroll", "Add-on"] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type PlanId = "basic" | "pro" | "business";

export type ProductPlan = {
  id: PlanId;
  name: string;
  regularPrice: number;
  promoPrice: number;
  features: string[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  unitLabel: string;
  promoQuota: number;
  featured: boolean;
  accent: "emerald" | "amber" | "blue" | "violet";
  previewLabel: string;
  featureList: string[];
  plans: ProductPlan[];
};
