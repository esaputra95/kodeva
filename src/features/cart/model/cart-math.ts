import { z } from "zod";
import { getPlanById, getProductById } from "@/features/products/model/catalog";
import type { Product } from "@/features/products/model/types";

export const CartLineSchema = z
  .object({
    productId: z.string().min(1),
    planId: z.enum(["basic", "pro", "business"]),
    quantity: z.number().int().positive().max(99),
  })
  .strict();

export const PersistedCartSchema = z.object({ lines: z.array(CartLineSchema).max(100) }).strict();

export type CartLine = z.infer<typeof CartLineSchema>;
export type CartIssue =
  "invalid-line" | "product-missing" | "plan-missing" | "promo-unavailable" | "quota-exceeded";

export function quantityForProduct(lines: CartLine[], productId: string): number {
  return lines
    .filter((line) => line.productId === productId)
    .reduce((sum, line) => sum + line.quantity, 0);
}

export function validateProductQuantity(
  product: Product,
  currentLines: CartLine[],
  nextTotal: number,
): CartIssue | null {
  if (!Number.isInteger(nextTotal) || nextTotal < 1 || nextTotal > 99) return "invalid-line";
  if (product.promoQuota < 1) return "promo-unavailable";
  if (nextTotal > product.promoQuota) return "quota-exceeded";
  return null;
}

export type CartViewLine = CartLine & {
  product: Product;
  plan: NonNullable<ReturnType<typeof getPlanById>>;
  lineTotal: number;
  lineRegularTotal: number;
};

export type CartTotals = {
  lines: CartViewLine[];
  issues: CartIssue[];
  subtotalRegular: number;
  savings: number;
  total: number;
};

export function calculateCartTotals(lines: CartLine[]): CartTotals {
  const viewLines: CartViewLine[] = [];
  const issues: CartIssue[] = [];

  for (const line of lines) {
    const parsed = CartLineSchema.safeParse(line);
    if (!parsed.success) {
      issues.push("invalid-line");
      continue;
    }
    const product = getProductById(line.productId);
    if (!product) {
      issues.push("product-missing");
      continue;
    }
    const plan = getPlanById(product, line.planId);
    if (!plan) {
      issues.push("plan-missing");
      continue;
    }
    viewLines.push({
      ...line,
      product,
      plan,
      lineTotal: plan.promoPrice * line.quantity,
      lineRegularTotal: plan.regularPrice * line.quantity,
    });
  }

  for (const product of new Set(viewLines.map((line) => line.product))) {
    const used = quantityForProduct(viewLines, product.id);
    const issue = validateProductQuantity(product, viewLines, used);
    if (issue) issues.push(issue);
  }

  const subtotalRegular = viewLines.reduce((sum, line) => sum + line.lineRegularTotal, 0);
  const total = viewLines.reduce((sum, line) => sum + line.lineTotal, 0);
  return {
    lines: viewLines,
    issues: [...new Set(issues)],
    subtotalRegular,
    savings: subtotalRegular - total,
    total,
  };
}

export function setProductLineQuantity(
  lines: CartLine[],
  productId: string,
  planId: CartLine["planId"],
  quantity: number,
): CartLine[] | CartIssue {
  const product = getProductById(productId);
  if (!product) return "product-missing";
  const currentProductTotal = quantityForProduct(lines, productId);
  const existingQuantity =
    lines.find((line) => line.productId === productId && line.planId === planId)?.quantity ?? 0;
  const nextProductTotal = currentProductTotal - existingQuantity + quantity;
  const issue = quantity === 0 ? null : validateProductQuantity(product, lines, nextProductTotal);
  if (issue) return issue;
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 99) return "invalid-line";

  if (quantity === 0)
    return lines.filter((line) => !(line.productId === productId && line.planId === planId));
  if (!getPlanById(product, planId)) return "plan-missing";

  const found = lines.some((line) => line.productId === productId && line.planId === planId);
  if (found)
    return lines.map((line) =>
      line.productId === productId && line.planId === planId ? { ...line, quantity } : line,
    );
  return [...lines, { productId, planId, quantity }];
}
