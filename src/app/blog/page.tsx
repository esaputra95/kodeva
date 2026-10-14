import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/layouts/site-shell";
import { BlogCard } from "@/features/blog/components/blog-card";
import { getBlogPage } from "@/features/blog/server/queries";
export const metadata: Metadata = {
  title: "Catatan operasional",
  description: "Panduan praktis untuk merapikan catatan kas, stok, dan jadwal tim.",
};
type Props = { searchParams: Promise<{ page?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const query = await searchParams;
  const requested = Number.parseInt(query.page ?? "1", 10);
  const page = Number.isFinite(requested) ? Math.max(1, requested) : 1;
  const { posts, pageCount } = await getBlogPage(page);
  return (
    <SiteShell>
      <section className="page-hero blog-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span>/</span>
            <span>Catatan</span>
          </div>
          <p className="eyebrow">Catatan operasional</p>
          <h1>Hal kecil yang membuat kerja harian lebih tertata.</h1>
          <p>
            Panduan singkat untuk pencatatan kas, stok, dan jadwal tim. Artikel dikelola lewat
            Sanity Studio.
          </p>
          <div className="catalog-meta">
            <span>
              <b>{String(posts.length).padStart(2, "0")}</b> artikel halaman ini
            </span>
            <span>
              <b>{pageCount}</b> halaman
            </span>
            <span>
              <b>5 menit</b> rata-rata baca
            </span>
          </div>
        </div>
      </section>
      <section className="section blog-section">
        <div className="container">
          <div className="blog-toolbar">
            <span>
              HALAMAN {page} DARI {pageCount}
            </span>
            <Link href="/studio">
              Kelola artikel di CMS <ArrowRight size={15} />
            </Link>
          </div>
          {posts.length ? (
            <div className="blog-grid">
              {posts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={(page - 1) * posts.length + index} />
              ))}
            </div>
          ) : (
            <div className="empty-panel">
              <h2>Belum ada artikel di halaman ini</h2>
              <Link className="button button-primary" href="/blog">
                Kembali ke halaman pertama
              </Link>
            </div>
          )}
          <nav className="pagination" aria-label="Navigasi halaman artikel">
            {page > 1 ? (
              <Link className="pagination-link" href={`/blog?page=${page - 1}`}>
                <ArrowLeft size={15} /> Sebelumnya
              </Link>
            ) : (
              <span />
            )}
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <Link
                aria-current={number === page ? "page" : undefined}
                className={`pagination-number ${number === page ? "current" : ""}`}
                href={`/blog?page=${number}`}
                key={number}
              >
                {number}
              </Link>
            ))}
            {page < pageCount ? (
              <Link className="pagination-link" href={`/blog?page=${page + 1}`}>
                Berikutnya <ArrowRight size={15} />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </section>
    </SiteShell>
  );
}
