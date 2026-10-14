import type { Metadata } from "next";
import { SiteShell } from "@/components/layouts/site-shell";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
export const metadata: Metadata = { title: "Checkout simulasi" };
export default function CheckoutPage() {
  return (
    <SiteShell>
      <section className="section checkout-page">
        <div className="container">
          <div className="breadcrumb">
            <a href="/cart">Keranjang</a>
            <span>/</span>
            <span>Checkout simulasi</span>
          </div>
          <p className="eyebrow">Langkah terakhir</p>
          <h1>Checkout simulasi</h1>
          <p className="checkout-intro">
            Isi data pembeli demo dan pilih hasil simulasi pembayaran.
          </p>
          <CheckoutForm />
        </div>
      </section>
    </SiteShell>
  );
}
