import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { PortableText } from "@portabletext/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layouts/site-shell";
import { getPostBySlug } from "@/features/blog/server/queries";
import { PRODUCTS } from "@/features/products/model/catalog";
import { sanityImageUrl } from "@/integrations/sanity/image";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  return post
    ? {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        openGraph: {
          type: "article",
          title: post.seoTitle || post.title,
          description: post.seoDescription || post.excerpt,
          publishedTime: post.publishedAt,
        },
      }
    : { title: "Artikel tidak ditemukan" };
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();
  const date = new Date(post.publishedAt);
  const value = post.body as never;
  return (
    <SiteShell>
      <article className="article-page">
        <div className="container article-container">
          <div className="breadcrumb">
            <Link href="/blog">
              <ArrowLeft size={14} /> Catatan operasional
            </Link>
            <span>/</span>
            <span>{post.category}</span>
          </div>
          <header className="article-header">
            <span className="article-category">{post.category}</span>
            <h1>{post.title}</h1>
            <p className="article-excerpt">{post.excerpt}</p>
            <div className="article-byline">
              <span className="article-author-mark">K</span>
              <span>
                <b>Tim editorial Kodeva</b>
                <small>
                  {Number.isNaN(date.valueOf())
                    ? "Artikel"
                    : new Intl.DateTimeFormat("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(date)}
                </small>
              </span>
              <span className="article-reading">4 menit baca</span>
            </div>
          </header>
          <div className={`article-cover${post.coverUrl ? " has-image" : ""}`}>
            {post.coverUrl ? (
              <Image
                className="article-cover-image"
                src={post.coverUrl}
                alt={post.coverAlt || post.title}
                width={1400}
                height={700}
                sizes="(max-width: 700px) 94vw, 950px"
              />
            ) : null}
            <div className="article-cover-grid">
              <span>KODEVA / OPERASIONAL</span>
              <b>{post.category}</b>
              <i>+</i>
            </div>
            <p>{post.coverAlt}</p>
          </div>
          <div className="article-layout">
            <aside className="article-aside">
              <span>DI ARTIKEL INI</span>
              <a href="#isi-artikel">Ringkasan</a>
              <a href="#langkah">Langkah yang bisa dicoba</a>
              <a href="#lanjut">Baca panduan lain</a>
            </aside>
            <div className="portable-content" id="isi-artikel">
              <div className="article-callout">
                <span>CATATAN</span>
                <p>
                  Mulai dari satu alur yang paling sering membuat tim berhenti bekerja untuk mencari
                  informasi.
                </p>
              </div>
              <PortableText
                value={value}
                components={{
                  types: {
                    image: ({ value: image }: { value: { alt?: string } }) => {
                      const src = sanityImageUrl(image as never, 1200);
                      return src ? (
                        <figure>
                          <Image
                            src={src}
                            alt={image.alt || post.title}
                            width={1200}
                            height={800}
                            sizes="(max-width: 700px) 90vw, 640px"
                          />
                          <figcaption>{image.alt || post.title}</figcaption>
                        </figure>
                      ) : null;
                    },
                  },
                  marks: {
                    productLink: ({
                      children,
                      value: mark,
                    }: {
                      children: ReactNode;
                      value?: { productId?: string };
                    }) => {
                      const product = PRODUCTS.find(
                        (candidate) => candidate.id === mark?.productId,
                      );
                      return product ? (
                        <Link href={`/products/${product.slug}`}>{children}</Link>
                      ) : (
                        <>{children}</>
                      );
                    },
                  },
                }}
              />
              <section className="article-next" id="lanjut">
                <span className="eyebrow">Langkah berikutnya</span>
                <h2>Bandingkan alur yang bisa dipakai tim kamu.</h2>
                <Link className="text-link" href="/products">
                  Lihat katalog aplikasi <ArrowUpRight size={15} />
                </Link>
              </section>
            </div>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
