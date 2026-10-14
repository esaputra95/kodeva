import { z } from "zod";
import { AttributionSchema } from "@/features/attribution/model/attribution";

export const LeadSubmissionSchema = z
  .object({
    submissionId: z.string().uuid(),
    name: z.string().trim().min(2).max(120),
    contact: z.string().trim().min(5).max(254),
    campaignId: z.string().trim().min(1).max(120),
    attribution: AttributionSchema,
    landingPath: z.string().startsWith("/").max(500),
    website: z.string().max(300).optional().default(""),
  })
  .strict();

export function splitContact(contact: string) {
  const value = contact.trim();
  if (z.string().email().safeParse(value).success)
    return { email: value.toLowerCase(), whatsapp: null };
  if (/^[+]?[(\d][\d\s().-]{5,30}$/.test(value))
    return { email: null, whatsapp: value.replace(/[\s().-]/g, "") };
  return null;
}
