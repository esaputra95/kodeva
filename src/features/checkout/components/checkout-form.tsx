"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/features/cart/model/store";
import { calculateCartTotals } from "@/features/cart/model/cart-math";
import { getAttribution } from "@/features/attribution/model/attribution";
import { trackEcommerceEvent } from "@/features/attribution/model/events";
import { formatIdr } from "@/lib/format-idr";

type OrderMock = {
  id: string;
  status: "succeeded" | "failed";
  buyer: { name: string; email: string };
  total: number;
  lines: Array<{ name: string; plan: string; quantity: number; total: number }>;
  createdAt: string;
};

export function CheckoutForm() {
  const { lines, hydrated, clear } = useCartStore();
  const totals = useMemo(() => calculateCartTotals(lines), [lines]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function submit(formData: FormData) {
    if (!lines.length || totals.issues.length) {
      setError("Periksa keranjang sebelum melanjutkan.");
      return;
    }
    setPending(true);
    setError("");
    const attribution = getAttribution();
    trackEcommerceEvent("begin_checkout", {
      currency: "IDR",
      value: totals.total,
      attribution,
      items: totals.lines.map((line) => ({
        item_id: line.productId,
        item_name: line.product.name,
        item_category: line.product.category,
        item_variant: line.plan.name,
        price: line.plan.promoPrice,
        quantity: line.quantity,
      })),
    });
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          buyer: {
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
          },
          lines,
          attribution,
          outcome: String(formData.get("outcome") ?? "success"),
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Simulasi belum berhasil. Periksa data lalu coba lagi.",
        );
      const order = result.order as OrderMock;
      sessionStorage.setItem("kodeva:last-order:v1", JSON.stringify(order));
      if (order.status === "succeeded") clear();
      router.push(`/checkout/result?order=${encodeURIComponent(order.id)}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Checkout belum berhasil.");
    } finally {
      setPending(false);
    }
  }
  if (!hydrated) return <p role="status">Memuat keranjang…</p>;
  if (!lines.length)
    return (
      <div className="empty-panel">
        <h2>Belum ada paket untuk checkout</h2>
        <p>Tambahkan paket dari katalog terlebih dahulu.</p>
        <Link className="button button-primary" href="/products">
          Lihat katalog
        </Link>
      </div>
    );
  return (
    <form className="checkout-layout" action={submit}>
      <div className="checkout-fields">
        <div className="checkout-step-heading">
          <span>01</span>
          <div>
            <h2>Data pembeli</h2>
            <p>Data ini hanya dipakai untuk simulasi pada sesi browser ini.</p>
          </div>
        </div>
        <label className="form-control">
          <span>Nama lengkap</span>
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            placeholder="Nama kamu"
          />
        </label>
        <label className="form-control">
          <span>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="nama@email.com"
          />
        </label>
        <div className="checkout-step-heading checkout-payment-heading">
          <span>02</span>
          <div>
            <h2>Hasil pembayaran</h2>
            <p>Pilih hasil simulasi untuk menguji kedua alur.</p>
          </div>
        </div>
        <label className="outcome-choice">
          <input type="radio" name="outcome" value="success" defaultChecked />
          <span>
            <b>Simulasi berhasil</b>
            <small>Tampilkan halaman konfirmasi pesanan.</small>
          </span>
        </label>
        <label className="outcome-choice">
          <input type="radio" name="outcome" value="failed" />
          <span>
            <b>Simulasi gagal</b>
            <small>Keranjang tetap tersimpan agar bisa dicoba lagi.</small>
          </span>
        </label>
        <p className="checkout-safe-note">
          <LockKeyhole size={16} />
          Tidak meminta nomor kartu atau detail pembayaran.
        </p>
        {error ? (
          <p className="form-message error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <aside className="order-summary checkout-summary">
        <p className="eyebrow">Tinjau pesanan</p>
        <h2>Ringkasan paket</h2>
        <div className="checkout-lines">
          {totals.lines.map((line) => (
            <div className="checkout-line" key={`${line.productId}-${line.planId}`}>
              <span>
                <b>{line.product.name}</b>
                <small>
                  {line.plan.name} × {line.quantity}
                </small>
              </span>
              <b>{formatIdr(line.lineTotal)}</b>
            </div>
          ))}
        </div>
        <div className="summary-row">
          <span>Diskon contoh</span>
          <b>− {formatIdr(totals.savings)}</b>
        </div>
        <div className="summary-total">
          <span>Total simulasi</span>
          <strong>{formatIdr(totals.total)}</strong>
        </div>
        <p className="summary-disclaimer">
          <ShieldCheck size={14} />
          Tidak ada transaksi nyata. Hasil ini tidak dikirim ke payment gateway.
        </p>
        <button
          className="button button-primary checkout-button"
          type="submit"
          disabled={pending || totals.issues.length > 0}
        >
          {pending ? "Memproses simulasi…" : "Simulasikan checkout"}
          <ArrowRight size={17} />
        </button>
        <Link className="back-link" href="/cart">
          <ArrowLeft size={14} /> Kembali ke keranjang
        </Link>
      </aside>
    </form>
  );
}
