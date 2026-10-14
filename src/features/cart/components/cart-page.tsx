"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/features/cart/model/store";
import { calculateCartTotals } from "@/features/cart/model/cart-math";
import { formatIdr } from "@/lib/format-idr";

export function CartPage() {
  const { lines, hydrated, storageWarning, setQuantity, removeLine } = useCartStore();
  const totals = useMemo(() => calculateCartTotals(lines), [lines]);
  if (!hydrated)
    return (
      <section className="section cart-page">
        <div className="container">
          <p role="status">Memuat keranjang…</p>
        </div>
      </section>
    );
  return (
    <section className="section cart-page">
      <div className="container">
        <div className="breadcrumb">
          <Link href="/products">Katalog produk</Link>
          <span>/</span>
          <span>Keranjang</span>
        </div>
        <div className="page-title-row">
          <div>
            <p className="eyebrow">Ringkasan pilihan</p>
            <h1>Keranjang</h1>
            <p>Periksa paket, jumlah, kuota promo, dan totalnya sebelum simulasi checkout.</p>
          </div>
          <span className="cart-large-count">
            <ShoppingBag size={19} />
            {lines.reduce((sum, line) => sum + line.quantity, 0)} lisensi
          </span>
        </div>
        {storageWarning ? (
          <p className="inline-warning" role="status">
            {storageWarning}
          </p>
        ) : null}
        {lines.length === 0 ? (
          <div className="empty-panel cart-empty">
            <div className="empty-icon">
              <ShoppingBag size={22} />
            </div>
            <h2>Keranjang masih kosong</h2>
            <p>Pilih salah satu aplikasi dan paket untuk melihat ringkasan biayanya.</p>
            <Link className="button button-primary" href="/products">
              Jelajahi katalog <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-lines">
              {totals.lines.map((line) => (
                <article className="cart-line" key={`${line.productId}-${line.planId}`}>
                  <div className={`cart-product-mark accent-${line.product.accent}`}>
                    {line.product.name.slice(0, 1)}
                  </div>
                  <div className="cart-line-info">
                    <div className="cart-line-heading">
                      <div>
                        <span className="cart-category">{line.product.category}</span>
                        <h2>{line.product.name}</h2>
                        <p>
                          Paket {line.plan.name} · {line.product.unitLabel}
                        </p>
                      </div>
                      <button
                        className="icon-button remove-button"
                        type="button"
                        aria-label={`Hapus ${line.product.name}`}
                        onClick={() => removeLine(line.productId, line.planId)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                    <div className="cart-line-bottom">
                      <div className="quantity-control" aria-label={`Jumlah ${line.product.name}`}>
                        <button
                          type="button"
                          aria-label="Kurangi jumlah"
                          onClick={() =>
                            setQuantity(line.productId, line.planId, line.quantity - 1)
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          type="button"
                          aria-label="Tambah jumlah"
                          onClick={() =>
                            setQuantity(line.productId, line.planId, line.quantity + 1)
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="cart-line-price">
                        <span>
                          <del>{formatIdr(line.lineRegularTotal)}</del>
                          <b>{formatIdr(line.lineTotal)}</b>
                        </span>
                        <small>Hemat {formatIdr(line.lineRegularTotal - line.lineTotal)}</small>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              <div className="cart-quota-note">
                <ShieldCheck size={17} />
                <span>
                  Promo per produk memakai kuota bersama untuk semua paket. Pilihan produk berbeda
                  dihitung terpisah.
                </span>
              </div>
              <Link className="text-link continue-shopping" href="/products">
                ← Lanjut melihat produk
              </Link>
            </div>
            <aside className="order-summary">
              <p className="eyebrow">Rincian pembayaran</p>
              <h2>Ringkasan</h2>
              <div className="summary-row">
                <span>Harga sebelum diskon</span>
                <b>{formatIdr(totals.subtotalRegular)}</b>
              </div>
              <div className="summary-row summary-savings">
                <span>Diskon contoh</span>
                <b>− {formatIdr(totals.savings)}</b>
              </div>
              <div className="summary-row">
                <span>Periode</span>
                <b>1 tahun</b>
              </div>
              <div className="summary-total">
                <span>Total simulasi</span>
                <strong>{formatIdr(totals.total)}</strong>
              </div>
              <p className="summary-disclaimer">
                Tidak ada tagihan sungguhan. Data pembelian tidak disimpan sebagai transaksi.
              </p>
              {totals.issues.length ? (
                <p className="inline-warning">
                  Ada pilihan yang perlu diperiksa sebelum melanjutkan.
                </p>
              ) : (
                <Link className="button button-primary checkout-button" href="/checkout">
                  Lanjut ke checkout <ArrowRight size={17} />
                </Link>
              )}
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
