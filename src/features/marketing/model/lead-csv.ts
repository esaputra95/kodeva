export type ExportableLead = {
  name: string;
  email: string | null;
  whatsapp: string | null;
  campaign_id: string;
  utm: unknown;
  landing_path: string;
  created_at: string;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const HEADERS = [
  "Nama",
  "Email",
  "WhatsApp",
  "ID campaign",
  ...UTM_KEYS,
  "Waktu UTC",
  "Path landing",
];

function cell(value: unknown) {
  const raw = String(value ?? "");
  const spreadsheetSafe = /^[\s]*[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${spreadsheetSafe.replaceAll('"', '""')}"`;
}

export function serializeLeadCsv(leads: ExportableLead[]) {
  const rows = leads.map((lead) => {
    const attribution =
      lead.utm && typeof lead.utm === "object"
        ? (lead.utm as { utm?: Record<string, unknown> })
        : {};
    const utm = attribution.utm ?? {};
    return [
      lead.name,
      lead.email,
      lead.whatsapp,
      lead.campaign_id,
      ...UTM_KEYS.map((key) => utm[key]),
      lead.created_at,
      lead.landing_path,
    ]
      .map(cell)
      .join(",");
  });
  return `\uFEFF${[HEADERS.map(cell).join(","), ...rows].join("\r\n")}`;
}
