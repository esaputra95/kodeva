"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CircleCheck, CircleX, PackageCheck } from "lucide-react";
import { SiteShell } from "@/components/layouts/site-shell";
import { formatIdr } from "@/lib/format-idr";

type OrderMock = {
  id: string;
  status: "succeeded" | "failed";
  buyer: { name: string; email: string };
  total: number;
  lines: Array<{ name: string; plan: string; quantity: number; total: number }>;
  createdAt: string;
};

export default function CheckoutResultPage() {
  return (
    <Suspense
      fallback={
        <section className="section result-page">
          <div className="container">
            <p role="status">Memuat hasil simulasi…</p>
          </div>
        </section>
      }
    >
      <CheckoutResultContent />
    </Suspense>
  );
}

function CheckoutResultContent() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const [order, setOrder] = useState<OrderMock | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const raw = sessionStorage.getItem("kodeva:last-order:v1");
        if (raw) {
          const value = JSON.parse(raw) as OrderMock;
          if (value.id === orderId) setOrder(value);
        }
      } catch {
        setOrder(null);
      }
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [orderId]);
  return (
    <SiteShell>
      <section className="section result-page">
        <div className="container">
          {!loaded ? (
            <p className="empty-panel" role="status">
              Memuat hasil simulasi…
            </p>
          ) : !order ? (
            <div className="empty-panel">
              <h1>Ringkasan sesi tidak ditemukan</h1>
              <p>
                Pesanan demo hanya tersimpan di sesi browser ini. Mulai simulasi baru dari
                keranjang.
              </p>
              <Link className="button button-primary" href="/products">
                Lihat katalog
              </Link>
            </div>
          ) : (
            <div className={`result-card ${order.status}`}>
              <div className="result-icon">
                {order.status === "succeeded" ? <CircleCheck size={27} /> : <CircleX size={27} />}
              </div>
              <p className="eyebrow">
                {order.status === "succeeded" ? "SIMULASI SELESAI" : "SIMULASI PEMBAYARAN"}
              </p>
              <h1>
                {order.status === "succeeded"
                  ? "Pesanan demo berhasil dibuat."
                  : "Pembayaran simulasi gagal."}
              </h1>
              <p className="result-lead">
                {order.status === "succeeded"
                  ? `Terima kasih, ${order.buyer.name}. Ini hanya konfirmasi lokal untuk mencoba alur checkout.`
                  : "Tidak ada transaksi nyata yang dibuat. Pilihanmu masih tersimpan di keranjang."}
              </p>
              <div className="result-order-id">
                <span>
                  <PackageCheck size={16} /> Referensi demo
                </span>
                <b>{order.id}</b>
              </div>
              <div className="result-lines">
                {order.lines.map((line, index) => (
                  <div key={`${line.name}-${index}`}>
                    <span>
                      <b>{line.name}</b>
                      <small>
                        {line.plan} × {line.quantity}
                      </small>
                    </span>
                    <b>{formatIdr(line.total)}</b>
                  </div>
                ))}
              </div>
              <div className="result-total">
                <span>Total simulasi</span>
                <strong>{formatIdr(order.total)}</strong>
              </div>
              <p className="result-disclaimer">
                Tidak dikirim ke payment gateway dan tidak disimpan sebagai transaksi. Data pesanan
                hanya ada di sesi browser ini.
              </p>
              <Link
                className="button button-primary"
                href={order.status === "succeeded" ? "/products" : "/cart"}
              >
                {order.status === "succeeded" ? "Kembali ke katalog" : "Coba lagi"}{" "}
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
