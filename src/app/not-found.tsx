import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { SiteShell } from "@/components/layouts/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="section">
        <div className="container empty-panel">
          <div className="empty-icon">
            <SearchX size={20} />
          </div>
          <p className="eyebrow">404 · HALAMAN TIDAK DITEMUKAN</p>
          <h1>Link ini belum punya tujuan.</h1>
          <p>Periksa alamat atau kembali ke katalog Kodeva.</p>
          <Link className="button button-primary" href="/products">
            <ArrowLeft size={15} /> Buka katalog
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
