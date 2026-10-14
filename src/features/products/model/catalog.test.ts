import { describe, expect, it } from "vitest";
import { filterProducts } from "./catalog";

describe("product catalog filters", () => {
  it("combines search and category filters", () => {
    expect(
      filterProducts({ category: "HR & Payroll", query: "absensi" }).map((product) => product.slug),
    ).toEqual(["hr-payroll", "absensi-online"]);
    expect(filterProducts({ query: "barcode" }).map((product) => product.slug)).toEqual([
      "kasir-retail",
    ]);
  });

  it("sorts from the canonical lowest plan promo price", () => {
    const ascending = filterProducts({ sort: "price-asc" });
    const descending = filterProducts({ sort: "price-desc" });
    expect(ascending[0].plans[0].promoPrice).toBeLessThanOrEqual(ascending[1].plans[0].promoPrice);
    expect(descending[0].plans[0].promoPrice).toBeGreaterThanOrEqual(
      descending[1].plans[0].promoPrice,
    );
  });
});
