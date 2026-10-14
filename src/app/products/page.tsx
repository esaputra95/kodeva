import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { SiteShell } from "@/components/layouts/site-shell";
import { ProductCard } from "@/features/products/components/product-card";
import { filterProducts, PRODUCT_CATEGORIES } from "@/features/products/model/catalog";

export const metadata: Metadata = {
  title: "Katalog aplikasi",
  description: "Bandingkan enam contoh aplikasi untuk kasir, HR & payroll, dan inventori.",
};
type Props = { searchParams: Promise<{ kategori?: string; q?: string; urut?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const products = filterProducts({
    category: params.kategori,
    query: params.q,
    sort: params.urut,
  });
  return (
    <SiteShell>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span>/</span>
            <span>Katalog</span>
          </div>
          <p className="eyebrow">Katalog aplikasi</p>
          <h1>Mulai dari pekerjaan yang ingin dibuat lebih rapi.</h1>
          <p>
            Enam produk demo, tiga tingkat paket per produk. Bandingkan fitur dan harga tahunan
            sebelum masuk keranjang.
          </p>
          <div className="catalog-meta">
            <span>
              <b>06</b> contoh aplikasi
            </span>
            <span>
              <b>03</b> tingkat paket
            </span>
            <span>
              <b>100%</b> checkout simulasi
            </span>
          </div>
        </div>
      </section>
      <section className="section catalog-section">
        <div className="container">
          <form className="catalog-toolbar" action="/products">
            <div className="catalog-filter-label">
              <SlidersHorizontal size={16} /> Saring katalog
            </div>
            <label className="form-control catalog-search">
              <span className="visually-hidden">Cari aplikasi</span>
              <input
                name="q"
                type="search"
                defaultValue={params.q}
                placeholder="Cari aplikasi atau fitur…"
              />
            </label>
            <label className="form-control">
              <span className="visually-hidden">Kategori</span>
              <select name="kategori" defaultValue={params.kategori ?? "Semua"}>
                <option>Semua</option>
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="form-control">
              <span className="visually-hidden">Urutkan harga</span>
              <select name="urut" defaultValue={params.urut ?? "relevan"}>
                <option value="relevan">Urutan: rekomendasi</option>
                <option value="price-asc">Harga terendah</option>
                <option value="price-desc">Harga tertinggi</option>
              </select>
            </label>
            <button className="button button-dark" type="submit">
              Terapkan
            </button>
          </form>
          <div className="catalog-results">
            <p>
              <strong>{products.length}</strong> aplikasi{" "}
              {params.kategori && params.kategori !== "Semua"
                ? `· ${params.kategori}`
                : "· semua kategori"}
            </p>
            <Link href="/blog">
              Belum yakin? Lihat panduan <ArrowUpRight size={14} />
            </Link>
          </div>
          {products.length ? (
            <div className="product-grid product-grid-catalog">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-panel">
              <div className="empty-icon">⌕</div>
              <h2>Tidak ada yang cocok</h2>
              <p>Coba kata lain atau hapus filter kategori.</p>
              <Link className="button button-primary" href="/products">
                Lihat semua produk
              </Link>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
