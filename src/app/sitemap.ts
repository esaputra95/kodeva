import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/features/products/model/catalog";
import { getBlogPage } from "@/features/blog/server/queries";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const firstPage = await getBlogPage(1);
  const pages = await Promise.all(
    Array.from({ length: firstPage.pageCount }, (_, index) => getBlogPage(index + 1)),
  );
  const posts = [
    ...new Map(pages.flatMap((page) => page.posts).map((post) => [post.slug, post])).values(),
  ];
  const staticRoutes = ["", "/products", "/blog"];
  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: path === "/" ? ("weekly" as const) : ("daily" as const),
      priority: path === "/" ? 1 : 0.7,
    })),
    ...PRODUCTS.map((product) => ({
      url: `${base}/products/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
