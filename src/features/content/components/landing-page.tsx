import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/features/products/components/product-card";
import { ProductVisual } from "@/features/products/components/product-visual";
import { TrackCta } from "@/features/attribution/components/track-cta";
import { LeadForm } from "@/features/leads/components/lead-form";
import { ShareActions } from "@/features/sharing/components/share-actions";
import { getSiteUrl } from "@/lib/site-url";
import { PRODUCTS } from "@/features/products/model/catalog";
import { resolveFeaturedProducts, type LandingContent } from "@/features/content/model/content";

export function LandingPage({ content }: { content: LandingContent }) {
  const featured = resolveFeaturedProducts(content, PRODUCTS);
  const heroProduct = PRODUCTS[0];
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="announcement">
              <span className="announcement-dot" />
              {content.announcement}
            </div>
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1>{content.hero.title}</h1>
            <p className="hero-description">{content.hero.subtitle}</p>
            <div className="hero-actions">
              <TrackCta
                className="button button-primary button-large"
                href="/products"
                ctaId="hero-catalog"
                campaignId={content.campaignId}
              >
                {content.hero.ctaLabel}
                <ArrowRight size={18} />
              </TrackCta>
              <Link className="button button-quiet button-large" href="#cara-kerja">
                Lihat cara kerja
              </Link>
            </div>
            <div className="hero-assurance">
              <span>
                <Check size={15} /> Harga terlihat sebelum pilih
              </span>
              <span>
                <Check size={15} /> Checkout hanya simulasi
              </span>
            </div>
            <ShareActions
              content={{
                title: `Kodeva — ${content.hero.title}`,
                text: content.hero.subtitle,
                url: getSiteUrl(),
                kind: "campaign",
                id: content.campaignId,
              }}
            />
          </div>
          <div className="hero-art">
            <div className="hero-art-glow" />
            <div className="hero-visual-wrap">
              {content.hero.imageUrl ? (
                <div className="hero-cms-image">
                  <Image
                    src={content.hero.imageUrl}
                    alt={content.hero.imageAlt}
                    width={1200}
                    height={860}
                    priority
                    sizes="(max-width: 700px) 95vw, 50vw"
                  />
                </div>
              ) : (
                <ProductVisual product={heroProduct} />
              )}
            </div>
            <div className="floating-note floating-note-top">
              <span className="note-icon note-green">
                <Sparkles size={16} />
              </span>
              <span>
                <b>Pekerjaan hari ini</b>
                <small>Lebih mudah ditinjau</small>
              </span>
            </div>
            <div className="floating-note floating-note-bottom">
              <span className="note-icon note-blue">
                <Clock3 size={16} />
              </span>
              <span>
                <b>Rekap tersusun</b>
                <small>Kasir · Tim · Stok</small>
              </span>
            </div>
            <div className="hero-index">
              01 <i /> 03
            </div>
          </div>
        </div>
        <div className="container category-rail">
          <span>Untuk alur usaha yang sering dipakai</span>
          <div>
            <span>
              <b>01</b> Kasir
            </span>
            <span>
              <b>02</b> Tim & payroll
            </span>
            <span>
              <b>03</b> Inventori
            </span>
          </div>
        </div>
      </section>

      <section className="section section-products" id="produk">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Pilih yang dibutuhkan</p>
              <h2>{content.featured.title}</h2>
              <p>{content.featured.description}</p>
            </div>
            <Link className="text-link" href="/products">
              Semua produk <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {featured.map((item) => (
              <ProductCard key={item.product.id} product={item.product} content={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section how-section" id="cara-kerja">
        <div className="container how-grid">
          <div className="how-intro">
            <p className="eyebrow">Tidak perlu menebak</p>
            <h2>Lihat cakupan paketnya sebelum memutuskan.</h2>
            <p>
              Mulai dari fitur yang dipakai tiap hari. Kamu bisa membandingkan paket dan melihat
              total biaya di keranjang.
            </p>
            <TrackCta
              className="button button-dark"
              href="/products"
              ctaId="howto-catalog"
              campaignId={content.campaignId}
            >
              Bandingkan aplikasi <ArrowRight size={16} />
            </TrackCta>
          </div>
          <div className="how-steps">
            <div className="how-step">
              <span className="step-number">01</span>
              <div>
                <h3>Pilih alur yang ingin dirapikan</h3>
                <p>
                  Kasir, absensi tim, atau stok gudang. Mulai dari kebutuhan yang paling terasa.
                </p>
              </div>
              <span className="step-icon">
                <Sparkles size={18} />
              </span>
            </div>
            <div className="how-step">
              <span className="step-number">02</span>
              <div>
                <h3>Bandingkan paket yang tersedia</h3>
                <p>
                  Periksa batas akun dan fitur setiap paket, lalu pilih yang pas untuk ukuran tim.
                </p>
              </div>
              <span className="step-icon">
                <ShieldCheck size={18} />
              </span>
            </div>
            <div className="how-step">
              <span className="step-number">03</span>
              <div>
                <h3>Cek ulang sebelum simulasi checkout</h3>
                <p>Harga, diskon, dan kuota promo ditampilkan sebelum pesanan disimulasikan.</p>
              </div>
              <span className="step-icon">
                <Check size={18} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section scenario-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Contoh situasi</p>
              <h2>{content.testimonials.title}</h2>
              <p>Berikut ilustrasi penggunaan, bukan ulasan atau klaim dari pelanggan nyata.</p>
            </div>
          </div>
          <div className="scenario-grid">
            {content.testimonials.items.map((scenario, index) => (
              <article className="scenario-card" key={`${scenario.context}-${index}`}>
                <span className="scenario-index">0{index + 1}</span>
                <blockquote>“{scenario.quote}”</blockquote>
                <div className="scenario-person">
                  <span className="scenario-avatar">{scenario.context.slice(0, 1)}</span>
                  <span>
                    <b>{scenario.context}</b>
                    <small>{scenario.attribution}</small>
                  </span>
                </div>
              </article>
            ))}
            <article className="scenario-card scenario-card-link">
              <Badge>Butuh gambaran lain?</Badge>
              <h3>Lihat detail enam aplikasi dan paketnya.</h3>
              <Link href="/products" className="round-arrow" aria-label="Buka katalog produk">
                <ArrowRight size={19} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container faq-grid">
          <div className="faq-intro">
            <p className="eyebrow">Sebelum memilih</p>
            <h2>{content.faq.title}</h2>
            <p>Jawaban singkat soal demo, paket, dan harga.</p>
            <Link href="/blog" className="text-link">
              Baca panduan di blog <ArrowRight size={15} />
            </Link>
          </div>
          <div className="faq-list">
            {content.faq.items.map((item, index) => (
              <details className="faq-item" key={`${item.question}-${index}`} open={index === 0}>
                <summary>
                  <span>{item.question}</span>
                  <ChevronDown size={18} />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section lead-section" id="kontak">
        <div className="container lead-card">
          <div className="lead-copy">
            <p className="eyebrow">Masih membandingkan?</p>
            <h2>{content.lead.title}</h2>
            <p>{content.lead.description}</p>
            <div className="lead-promise">
              <span>
                <Check size={15} /> Tidak ada pembayaran sungguhan
              </span>
              <span>
                <Check size={15} /> Hanya data kontak demo
              </span>
            </div>
          </div>
          <LeadForm
            campaignId={content.campaignId}
            successMessage={content.lead.successMessage}
            buttonLabel={content.lead.buttonLabel}
          />
        </div>
      </section>
    </>
  );
}
