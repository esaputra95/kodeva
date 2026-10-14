import { describe, expect, it } from "vitest";
import { captureFirstTouch, hasUtm, parseUtm } from "./attribution";

describe("first-touch attribution", () => {
  it("captures UTM values and the entry path once", () => {
    const first = captureFirstTouch(
      "https://kodeva.test/products?utm_source=search&utm_campaign=q4&campaign_id=launch",
    );
    expect(first?.utm.utm_source).toBe("search");
    expect(first?.campaignId).toBe("launch");
    expect(first?.entryPath).toContain("/products?");
    const later = captureFirstTouch("https://kodeva.test/blog?utm_source=newsletter", first);
    expect(later).toEqual(first);
  });

  it("does not invent UTM values for direct traffic and bounds inputs", () => {
    expect(captureFirstTouch("https://kodeva.test/")).toBeNull();
    const parsed = parseUtm(`?utm_source=${"x".repeat(250)}`);
    expect(parsed.utm_source).toHaveLength(200);
    expect(hasUtm(parsed)).toBe(true);
  });
});
