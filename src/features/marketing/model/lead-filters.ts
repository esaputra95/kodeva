import { z } from "zod";

export const LeadFiltersSchema = z
  .object({
    campaignId: z.string().trim().max(120).optional().default(""),
    utmSource: z
      .string()
      .trim()
      .max(200)
      .regex(/^[a-z0-9_-]*$/i)
      .optional()
      .default(""),
  })
  .strict();

export type LeadFilters = z.infer<typeof LeadFiltersSchema>;

export function readLeadFilters(params: URLSearchParams) {
  return LeadFiltersSchema.safeParse({
    campaignId: params.get("campaignId") ?? "",
    utmSource: params.get("utmSource") ?? "",
  });
}
