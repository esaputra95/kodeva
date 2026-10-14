import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/features/blog/model/types";

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
export function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  const date = new Date(post.publishedAt);
  return (
    <article className={`blog-card blog-art-${index % 4}`}>
      <Link
        className={`blog-art${post.coverUrl ? " has-image" : ""}`}
        href={`/blog/${post.slug}`}
        aria-label={`Baca ${post.title}`}
      >
        {post.coverUrl ? (
          <Image
            className="blog-cover-image"
            src={post.coverUrl}
            alt={post.coverAlt || post.title}
            width={900}
            height={520}
            sizes="(max-width: 700px) 90vw, (max-width: 980px) 45vw, 30vw"
          />
        ) : null}
        <span className="blog-art-index">
          KODEVA / CATATAN {String(index + 1).padStart(2, "0")}
        </span>
        <span className="blog-art-motif">{index % 2 ? "↗" : "＋"}</span>
        <span className="blog-art-caption">{post.category}</span>
      </Link>
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span>{post.category}</span>
          <time dateTime={post.publishedAt}>
            {Number.isNaN(date.valueOf()) ? "Artikel" : dateFormat.format(date)}
          </time>
        </div>
        <h2>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.excerpt}</p>
        <Link className="text-link" href={`/blog/${post.slug}`}>
          Baca artikel <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
