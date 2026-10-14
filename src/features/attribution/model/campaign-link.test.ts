import { describe, expect, it } from "vitest";
import { buildCampaignUrl } from "./campaign-link";

describe("campaign link builder", () => {
  it("replaces old UTM values once while preserving page query and hash", () => {
    const result = new URL(
      buildCampaignUrl("https://kodeva.test", {
        destination: "/products?kategori=Kasir&utm_source=old&utm_campaign=old#produk",
        source: "instagram",
        medium: "paid_social",
        campaign: "promo akhir tahun",
        term: "kasir",
        content: "story 1",
      }),
    );
    expect(result.searchParams.get("kategori")).toBe("Kasir");
    expect(result.searchParams.get("utm_source")).toBe("instagram");
    expect(result.searchParams.get("utm_campaign")).toBe("promo akhir tahun");
    expect(result.searchParams.get("utm_content")).toBe("story 1");
    expect(result.hash).toBe("#produk");
  });

  it("only allows known public Kodeva destinations", () => {
    expect(() =>
      buildCampaignUrl("https://kodeva.test", {
        destination: "https://example.com/",
        source: "tiktok",
        medium: "social",
        campaign: "launch",
      }),
    ).toThrow();
    expect(() =>
      buildCampaignUrl("https://kodeva.test", {
        destination: "/admin",
        source: "tiktok",
        medium: "social",
        campaign: "launch",
      }),
    ).toThrow();
    expect(() =>
      buildCampaignUrl("https://kodeva.test", {
        destination: "/unknown",
        source: "tiktok",
        medium: "social",
        campaign: "launch",
      }),
    ).toThrow();
  });
});
