import { canonicalShareUrl } from "../model/share-links";
import type { ShareBrowser, ShareContent, ShareResult } from "../types";

export async function shareContent(
  content: ShareContent,
  browser: ShareBrowser,
): Promise<ShareResult> {
  const url = canonicalShareUrl(content.url);
  if (browser.share) {
    try {
      await browser.share({ title: content.title, text: content.text, url });
      return "shared";
    } catch (error) {
      // Closing the native share sheet must not silently change the clipboard.
      if (error instanceof Error && error.name === "AbortError") return "cancelled";
    }
  }
  if (browser.copy) {
    try {
      await browser.copy(url);
      return "copied";
    } catch {
      // A selectable URL still works when browser clipboard access is denied.
    }
  }
  return "manual";
}
