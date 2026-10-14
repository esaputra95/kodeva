import { describe, expect, it } from "vitest";
import { splitContact } from "./schema";

describe("lead contact normalization", () => {
  it("normalizes email addresses", () => {
    expect(splitContact("  Person@Example.com ")).toEqual({
      email: "person@example.com",
      whatsapp: null,
    });
  });

  it("normalizes WhatsApp numbers and rejects arbitrary text", () => {
    expect(splitContact("+62 812-3456-7890")).toEqual({ email: null, whatsapp: "+6281234567890" });
    expect(splitContact("telepon saya")).toBeNull();
  });
});
