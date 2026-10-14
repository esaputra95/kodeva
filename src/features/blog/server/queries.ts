import { defineQuery } from "next-sanity";
import { BLOG_PAGE_SIZE, REVALIDATE_SECONDS } from "@/constants/app";
import { FALLBACK_POSTS } from "@/features/blog/model/fallback-posts";
import type { BlogPost } from "@/features/blog/model/types";
import { sanityClient } from "@/integrations/sanity/client.server";
import { sanityImageUrl } from "@/integrations/sanity/image";

const postsQuery =
  defineQuery(`*[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, _updatedAt) desc, _id asc)[$start...$end]{
  _id, title, "slug": slug.current, excerpt, "category": category->title,
  coverImage, coverAlt, "publishedAt": coalesce(publishedAt, _updatedAt),
  seoTitle, seoDescription, body
}`);
const countQuery = defineQuery(`count(*[_type == "post" && defined(slug.current)])`);
const postBySlugQuery = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, excerpt, "category": category->title,
  coverImage, coverAlt, "publishedAt": coalesce(publishedAt, _updatedAt),
  seoTitle, seoDescription, body
}`);

export async function getBlogPage(
  page: number,
): Promise<{ posts: BlogPost[]; total: number; pageCount: number }> {
  if (!sanityClient) return fallbackPage(page);
  try {
    const start = (page - 1) * BLOG_PAGE_SIZE;
    const end = start + BLOG_PAGE_SIZE;
    const [rawPosts, total] = await Promise.all([
      sanityClient.fetch<Array<Record<string, unknown>>>(
        postsQuery,
        { start, end },
        { next: { revalidate: REVALIDATE_SECONDS, tags: ["sanity-content"] } },
      ),
      sanityClient.fetch<number>(
        countQuery,
        {},
        { next: { revalidate: REVALIDATE_SECONDS, tags: ["sanity-content"] } },
      ),
    ]);
    if (total === 0) return fallbackPage(page);
    const posts = rawPosts.map(mapPost);
    return { posts, total, pageCount: Math.ceil(total / BLOG_PAGE_SIZE) };
  } catch (error) {
    console.error(
      "Sanity blog query failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return fallbackPage(page);
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!sanityClient) return FALLBACK_POSTS.find((post) => post.slug === slug) ?? null;
  try {
    const rawPost = await sanityClient.fetch<Record<string, unknown> | null>(
      postBySlugQuery,
      { slug },
      { next: { revalidate: REVALIDATE_SECONDS, tags: ["sanity-content"] } },
    );
    if (!rawPost) return FALLBACK_POSTS.find((post) => post.slug === slug) ?? null;
    return mapPost(rawPost);
  } catch (error) {
    console.error(
      "Sanity post query failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return FALLBACK_POSTS.find((post) => post.slug === slug) ?? null;
  }
}

function fallbackPage(page: number) {
  const start = (page - 1) * BLOG_PAGE_SIZE;
  const posts = FALLBACK_POSTS.slice(start, start + BLOG_PAGE_SIZE);
  return {
    posts,
    total: FALLBACK_POSTS.length,
    pageCount: Math.ceil(FALLBACK_POSTS.length / BLOG_PAGE_SIZE),
  };
}

function mapPost(raw: Record<string, unknown>): BlogPost {
  return {
    id: typeof raw._id === "string" ? raw._id : "sanity-post",
    title: stringValue(raw.title, "Artikel Kodeva"),
    slug: stringValue(raw.slug, "artikel"),
    excerpt: stringValue(raw.excerpt, "Baca panduan operasional Kodeva."),
    category: stringValue(raw.category, "Operasional"),
    coverUrl: sanityImageUrl(raw.coverImage as never, 1000),
    coverAlt: stringValue(raw.coverAlt, "Ilustrasi artikel"),
    publishedAt: stringValue(raw.publishedAt, new Date().toISOString()),
    seoTitle: stringValue(raw.seoTitle, ""),
    seoDescription: stringValue(raw.seoDescription, ""),
    body: Array.isArray(raw.body) ? (raw.body as BlogPost["body"]) : [],
  };
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}
