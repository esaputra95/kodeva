import { defineQuery } from "next-sanity";
import { REVALIDATE_SECONDS } from "@/constants/app";
import { FALLBACK_LANDING, type LandingContent } from "@/features/content/model/content";
import { sanityClient } from "@/integrations/sanity/client.server";
import { sanityImageUrl } from "@/integrations/sanity/image";

const landingQuery = defineQuery(`*[_type == "campaignLanding" && _id == "campaignLanding"][0]{
  campaignId, announcement,
  "hero": { "eyebrow": eyebrow, "title": heroTitle, "subtitle": heroSubtitle, "ctaLabel": heroCtaLabel, "image": heroImage, "imageAlt": heroImageAlt },
  "featured": { "title": featuredTitle, "description": featuredDescription, "items": featuredItems[] { productId, title, description, image, imageAlt, ctaLabel } },
  "testimonials": { "title": testimonialsTitle, "items": scenarioItems[] { quote, attribution, context } },
  "faq": { "title": faqTitle, "items": faqItems[] { question, answer } },
  "lead": { "title": leadTitle, "description": leadDescription, "buttonLabel": leadButtonLabel, "successMessage": leadSuccessMessage },
  "seo": { "title": seoTitle, "description": seoDescription }
}`);

export async function getLandingContent(): Promise<LandingContent> {
  if (!sanityClient) return FALLBACK_LANDING;
  try {
    const data = await sanityClient.fetch<Record<string, unknown> | null>(
      landingQuery,
      {},
      { next: { revalidate: REVALIDATE_SECONDS, tags: ["sanity-content"] } },
    );
    if (!data) return FALLBACK_LANDING;
    const hero = (data.hero ?? {}) as Record<string, unknown>;
    const featured = (data.featured ?? {}) as Record<string, unknown>;
    const testimonials = (data.testimonials ?? {}) as Record<string, unknown>;
    const faq = (data.faq ?? {}) as Record<string, unknown>;
    const lead = (data.lead ?? {}) as Record<string, unknown>;
    const seo = (data.seo ?? {}) as Record<string, unknown>;
    const items = Array.isArray(featured.items)
      ? (featured.items as Array<Record<string, unknown>>)
      : [];
    return {
      campaignId: stringOr(data.campaignId, FALLBACK_LANDING.campaignId),
      announcement: stringOr(data.announcement, FALLBACK_LANDING.announcement),
      hero: {
        eyebrow: stringOr(hero.eyebrow, FALLBACK_LANDING.hero.eyebrow),
        title: stringOr(hero.title, FALLBACK_LANDING.hero.title),
        subtitle: stringOr(hero.subtitle, FALLBACK_LANDING.hero.subtitle),
        ctaLabel: stringOr(hero.ctaLabel, FALLBACK_LANDING.hero.ctaLabel),
        imageUrl: sanityImageUrl(hero.image as never, 1400),
        imageAlt: stringOr(hero.imageAlt, FALLBACK_LANDING.hero.imageAlt),
      },
      featured: {
        title: stringOr(featured.title, FALLBACK_LANDING.featured.title),
        description: stringOr(featured.description, FALLBACK_LANDING.featured.description),
        items: items.map((item) => ({
          productId: stringOr(item.productId, ""),
          title: stringOr(item.title, ""),
          description: stringOr(item.description, ""),
          imageUrl: sanityImageUrl(item.image as never, 900),
          imageAlt: stringOr(item.imageAlt, ""),
          ctaLabel: stringOr(item.ctaLabel, "Lihat produk"),
        })),
      },
      testimonials: {
        title: stringOr(testimonials.title, FALLBACK_LANDING.testimonials.title),
        items: Array.isArray(testimonials.items)
          ? (testimonials.items as LandingContent["testimonials"]["items"])
          : FALLBACK_LANDING.testimonials.items,
      },
      faq: {
        title: stringOr(faq.title, FALLBACK_LANDING.faq.title),
        items: Array.isArray(faq.items)
          ? (faq.items as LandingContent["faq"]["items"])
          : FALLBACK_LANDING.faq.items,
      },
      lead: {
        title: stringOr(lead.title, FALLBACK_LANDING.lead.title),
        description: stringOr(lead.description, FALLBACK_LANDING.lead.description),
        buttonLabel: stringOr(lead.buttonLabel, FALLBACK_LANDING.lead.buttonLabel),
        successMessage: stringOr(lead.successMessage, FALLBACK_LANDING.lead.successMessage),
      },
      seo: {
        title: stringOr(seo.title, FALLBACK_LANDING.seo.title),
        description: stringOr(seo.description, FALLBACK_LANDING.seo.description),
      },
    };
  } catch (error) {
    console.error(
      "Sanity landing query failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return FALLBACK_LANDING;
  }
}

function stringOr(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}
