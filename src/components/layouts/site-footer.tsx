import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark" aria-hidden="true">
              <span />
            </span>
            <span>Kodeva</span>
          </Link>
          <p>Contoh aplikasi bisnis untuk kebutuhan operasional UMKM.</p>
        </div>
        <div className="footer-links">
          <Link href="/products">Produk</Link>
          <Link href="/blog">Artikel</Link>
          <Link href="/admin/login">Panel marketing</Link>
        </div>
        <small>© 2026 Kodeva · Brand dan produk untuk demo.</small>
      </div>
    </footer>
  );
}
