import { describe, expect, it, vi } from "vitest";
import { canonicalShareUrl, whatsappShareUrl } from "../model/share-links";
import type { ShareContent } from "../types";
import { shareContent } from "./share-content";

const content: ShareContent = {
  title: "Kasir Retail — Kodeva",
  text: "Bandingkan paket untuk toko kamu.",
  url: "https://kodeva.test/products/kasir-retail?utm_source=instagram#paket",
  kind: "product",
  id: "kasir-retail",
};
const cleanUrl = "https://kodeva.test/products/kasir-retail";

describe("sharing", () => {
  it("uses native sharing with a clean URL without copying", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const copy = vi.fn();
    expect(await shareContent(content, { share, copy })).toBe("shared");
    expect(share).toHaveBeenCalledWith({ title: content.title, text: content.text, url: cleanUrl });
    expect(copy).not.toHaveBeenCalled();
  });

  it("does not copy or report success when the user cancels", async () => {
    const share = vi.fn().mockRejectedValue(new DOMException("Cancelled", "AbortError"));
    const copy = vi.fn();
    expect(await shareContent(content, { share, copy })).toBe("cancelled");
    expect(copy).not.toHaveBeenCalled();
  });

  it("copies when native sharing is unavailable", async () => {
    const copy = vi.fn().mockResolvedValue(undefined);
    expect(await shareContent(content, { copy })).toBe("copied");
    expect(copy).toHaveBeenCalledWith(cleanUrl);
  });

  it("falls back to copying when native sharing is blocked", async () => {
    const share = vi.fn().mockRejectedValue(new DOMException("Blocked", "NotAllowedError"));
    const copy = vi.fn().mockResolvedValue(undefined);
    expect(await shareContent(content, { share, copy })).toBe("copied");
    expect(copy).toHaveBeenCalledWith(cleanUrl);
  });

  it("offers manual copying when clipboard permission is denied", async () => {
    const copy = vi.fn().mockRejectedValue(new DOMException("Denied", "NotAllowedError"));
    expect(await shareContent(content, { copy })).toBe("manual");
  });

  it("offers manual copying without browser share APIs", async () => {
    expect(await shareContent(content, {})).toBe("manual");
  });

  it("removes credentials, query values and fragments from shared links", () => {
    expect(
      canonicalShareUrl("https://user:password@kodeva.test/blog/panduan?token=private#isi"),
    ).toBe("https://kodeva.test/blog/panduan");
  });

  it("encodes the title and clean link for WhatsApp without sending a message", () => {
    const destination = new URL(whatsappShareUrl("HR & Payroll — Kodeva", content.url));
    expect(destination.origin).toBe("https://wa.me");
    expect(destination.searchParams.get("text")).toBe(`HR & Payroll — Kodeva\n${cleanUrl}`);
  });

  it("rejects non-web URLs", () => {
    expect(() => canonicalShareUrl("javascript:alert(1)")).toThrow();
    expect(() => canonicalShareUrl("file:///private/file.txt")).toThrow();
  });
});
