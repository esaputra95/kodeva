import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export function sanityImageUrl(
  source?: SanityImageSource | null,
  width = 1200,
): string | undefined {
  if (!source || !projectId || !dataset) return undefined;
  return imageUrlBuilder({ projectId, dataset })
    .image(source)
    .width(width)
    .auto("format")
    .fit("max")
    .url();
}
