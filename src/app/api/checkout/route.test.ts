import { describe, expect, it } from "vitest";
import { POST } from "./route";

const attribution = {
  utm: {
    utm_source: "instagram",
    utm_medium: "social",
    utm_campaign: "launch",
    utm_term: "",
    utm_content: "",
  },
  campaignId: "launch",
  entryPath: "/?utm_source=instagram",
};
const buyer = { name: "Rina Demo", email: "rina@example.com" };
const lines = [{ productId: "kasir-retail", planId: "pro", quantity: 2 }];

function request(body: unknown) {
  return new Request("http://localhost/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("checkout simulation route", () => {
  it("recomputes canonical totals and carries first-touch attribution", async () => {
    const response = await POST(request({ buyer, lines, attribution, outcome: "success" }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.order.total).toBe(600_000);
    expect(result.order.status).toBe("succeeded");
    expect(result.order.attribution.utm.utm_source).toBe("instagram");
  });

  it("returns deterministic failure and rejects over-quota lines", async () => {
    const failed = await POST(request({ buyer, lines, attribution, outcome: "failed" }));
    expect((await failed.json()).order.status).toBe("failed");
    const overQuota = await POST(
      request({
        buyer,
        lines: [{ productId: "kasir-retail", planId: "basic", quantity: 6 }],
        attribution,
        outcome: "success",
      }),
    );
    expect(overQuota.status).toBe(422);
  });

  it("rejects client-supplied pricing fields", async () => {
    const response = await POST(
      request({ buyer, lines: [{ ...lines[0], price: 1 }], attribution, outcome: "success" }),
    );
    expect(response.status).toBe(400);
  });
});
