import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layouts/site-shell";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug, PRODUCTS } from "@/features/products/model/catalog";
import { ProductVisual } from "@/features/products/components/product-visual";
import { ProductPurchase } from "@/features/products/components/product-purchase";
import { EcommerceView } from "@/features/attribution/components/ecommerce-view";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return PRODUCTS.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  return product
    ? { title: product.name, description: product.shortDescription }
    : { title: "Produk tidak ditemukan" };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();
  return (
    <SiteShell>
      <EcommerceView product={product} />
      <section className="detail-page">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/products">
              <ArrowLeft size={14} /> Katalog
            </Link>
            <span>/</span>
            <span>{product.category}</span>
          </div>
          <div className="detail-grid">
            <div className="detail-copy">
              <Badge>{product.category}</Badge>
              <h1>{product.name}</h1>
              <p className="detail-lead">{product.description}</p>
              <div className="detail-visual">
                <ProductVisual product={product} />
              </div>
              <div className="detail-features">
                <p className="eyebrow">Yang bisa dicoba di paket</p>
                <h2>Fitur yang tercakup</h2>
                <ul>
                  {product.featureList.map((feature) => (
                    <li key={feature}>
                      <span>
                        <Check size={15} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="detail-demo-note">
                <ShieldCheck size={18} />
                <span>
                  <b>Produk dan harga adalah data contoh.</b>
                  <small>
                    Website ini tidak menjual lisensi sungguhan; tombol checkout hanya menjalankan
                    simulasi.
                  </small>
                </span>
              </div>
            </div>
            <aside className="detail-aside">
              <ProductPurchase product={product} />
              <p className="detail-side-note">
                Harga {product.unitLabel}. Diskon dan kuota hanya untuk simulasi tes.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
