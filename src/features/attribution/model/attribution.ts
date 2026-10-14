import { z } from "zod";

const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export const UTMFieldSchema = z
  .object({
    utm_source: z.string().max(200).optional().default(""),
    utm_medium: z.string().max(200).optional().default(""),
    utm_campaign: z.string().max(200).optional().default(""),
    utm_term: z.string().max(200).optional().default(""),
    utm_content: z.string().max(200).optional().default(""),
  })
  .strict();

export const AttributionSchema = z
  .object({
    utm: UTMFieldSchema,
    campaignId: z.string().max(120).optional().default(""),
    entryPath: z.string().max(500).optional().default(""),
    capturedAt: z.string().datetime().optional(),
  })
  .strict();

export type UtmFields = z.infer<typeof UTMFieldSchema>;
export type Attribution = z.infer<typeof AttributionSchema>;

export const EMPTY_UTM: UtmFields = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
};

export function parseUtm(search: string | URLSearchParams): UtmFields {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const values = Object.fromEntries(
    utmKeys.map((key) => [key, (params.get(key) ?? "").trim().slice(0, 200)]),
  );
  const parsed = UTMFieldSchema.safeParse(values);
  return parsed.success ? parsed.data : EMPTY_UTM;
}

export function hasUtm(utm: UtmFields) {
  return utmKeys.some((key) => Boolean(utm[key]));
}

export function captureFirstTouch(
  currentUrl: string,
  existing?: Attribution | null,
  now = new Date(),
): Attribution | null {
  if (existing?.capturedAt) return existing;
  const url = new URL(currentUrl, "http://localhost");
  const utm = parseUtm(url.searchParams);
  if (!hasUtm(utm)) return existing ?? null;
  return {
    utm,
    campaignId: (url.searchParams.get("campaign_id") || utm.utm_campaign).trim().slice(0, 120),
    entryPath: `${url.pathname}${url.search}`.slice(0, 500),
    capturedAt: now.toISOString(),
  };
}

export function readStoredAttribution(
  storage: Pick<Storage, "getItem"> | null,
): Attribution | null {
  if (!storage) return null;
  try {
    const value = storage.getItem("kodeva:attribution:v1");
    if (!value) return null;
    const parsed = AttributionSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return { utm: EMPTY_UTM, campaignId: "", entryPath: "" };
  return (
    readStoredAttribution(window.sessionStorage) ?? {
      utm: EMPTY_UTM,
      campaignId: "",
      entryPath: "",
    }
  );
}
