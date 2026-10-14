import { describe, expect, it } from "vitest";
import { serializeLeadCsv } from "./lead-csv";

describe("lead CSV export", () => {
  it("includes first-touch campaign fields and protects spreadsheet cells", () => {
    const csv = serializeLeadCsv([
      {
        name: '=HYPERLINK("https://bad.test")',
        email: "a@example.com",
        whatsapp: "+62812345678",
        campaign_id: "q4,launch",
        utm: {
          utm: {
            utm_source: "instagram",
            utm_medium: "social",
            utm_campaign: 'Promo "besar"',
            utm_term: "",
            utm_content: "story",
          },
        },
        created_at: "2026-10-14T03:00:00.000Z",
        landing_path: "/products?from=ig",
      },
    ]);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("'=HYPERLINK");
    expect(csv).toContain('"instagram"');
    expect(csv).toContain('"q4,launch"');
    expect(csv).toContain('"Promo ""besar"""');
  });
});
