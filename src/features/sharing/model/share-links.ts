export function canonicalShareUrl(url: string) {
  const canonical = new URL(url);
  if (!["https:", "http:"].includes(canonical.protocol)) {
    throw new Error("Share URLs must use HTTP or HTTPS.");
  }
  canonical.search = "";
  canonical.hash = "";
  canonical.username = "";
  canonical.password = "";
  return canonical.toString();
}

export function whatsappShareUrl(title: string, url: string) {
  const destination = new URL("https://wa.me/");
  destination.searchParams.set("text", `${title}\n${canonicalShareUrl(url)}`);
  return destination.toString();
}
