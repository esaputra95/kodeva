import { describe, expect, it } from "vitest";
import {
  calculateCartTotals,
  PersistedCartSchema,
  quantityForProduct,
  setProductLineQuantity,
} from "./cart-math";

describe("cart math", () => {
  it("sums product promo quota across different plans", () => {
    const lines = [
      { productId: "kasir-retail", planId: "basic" as const, quantity: 3 },
      { productId: "kasir-retail", planId: "pro" as const, quantity: 2 },
    ];
    expect(quantityForProduct(lines, "kasir-retail")).toBe(5);
    expect(calculateCartTotals(lines).issues).toEqual([]);
    expect(calculateCartTotals(lines).lines).toHaveLength(2);
    expect(calculateCartTotals(lines).total).toBe(3 * 200_000 + 2 * 300_000);
  });

  it("rejects a quantity that exceeds shared promo quota", () => {
    const lines = [{ productId: "kasir-retail", planId: "basic" as const, quantity: 4 }];
    expect(setProductLineQuantity(lines, "kasir-retail", "business", 2)).toBe("quota-exceeded");
  });

  it("updates or removes only the selected plan line", () => {
    const lines = [
      { productId: "kasir-retail", planId: "basic" as const, quantity: 2 },
      { productId: "kasir-retail", planId: "pro" as const, quantity: 1 },
    ];
    const updated = setProductLineQuantity(lines, "kasir-retail", "basic", 1);
    expect(Array.isArray(updated)).toBe(true);
    expect(updated).toEqual([
      { productId: "kasir-retail", planId: "basic", quantity: 1 },
      { productId: "kasir-retail", planId: "pro", quantity: 1 },
    ]);
    expect(setProductLineQuantity(lines, "kasir-retail", "basic", 0)).toEqual([lines[1]]);
  });

  it("rejects tampered persisted prices and reports unknown products", () => {
    expect(
      PersistedCartSchema.safeParse({
        lines: [{ productId: "kasir-retail", planId: "basic", quantity: 1, price: 1 }],
      }).success,
    ).toBe(false);
    expect(
      calculateCartTotals([{ productId: "removed-product", planId: "basic", quantity: 1 }]).issues,
    ).toContain("product-missing");
  });
});
