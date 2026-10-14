"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Product, PlanId } from "@/features/products/model/types";
import { formatIdr } from "@/lib/format-idr";
import { useCartStore } from "@/features/cart/model/store";
import { getAttribution } from "@/features/attribution/model/attribution";
import { trackEcommerceEvent } from "@/features/attribution/model/events";

const errorMessage: Record<string, string> = {
  "quota-exceeded": "Jumlah pilihan melewati kuota promo produk ini.",
  "promo-unavailable": "Kuota promo produk ini sudah habis.",
  "product-missing": "Produk tidak tersedia.",
  "plan-missing": "Paket tidak tersedia.",
};

export function ProductPurchase({ product }: { product: Product }) {
  const [planId, setPlanId] = useState<PlanId>("pro");
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const addLine = useCartStore((state) => state.addLine);
  const router = useRouter();
  const plan = product.plans.find((candidate) => candidate.id === planId) ?? product.plans[0];
  function add() {
    const issue = addLine(product.id, planId);
    if (issue) {
      setAdded(false);
      setMessage(errorMessage[issue] ?? "Tidak bisa menambahkan produk.");
      return;
    }
    trackEcommerceEvent("add_to_cart", {
      currency: "IDR",
      value: plan.promoPrice,
      attribution: getAttribution(),
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_variant: plan.name,
          price: plan.promoPrice,
          quantity: 1,
        },
      ],
    });
    setAdded(true);
    setMessage("Paket tersimpan di keranjang.");
    router.refresh();
  }
  return (
    <div className="purchase-panel">
      <div className="purchase-heading">
        <span>PILIH PAKET</span>
        <span className="promo-chip">Promo tersedia · {product.promoQuota} lisensi</span>
      </div>
      <div className="plan-options" role="radiogroup" aria-label="Pilih paket">
        {product.plans.map((option) => (
          <button
            className={`plan-option ${planId === option.id ? "selected" : ""}`}
            type="button"
            role="radio"
            aria-checked={planId === option.id}
            key={option.id}
            onClick={() => setPlanId(option.id)}
          >
            <span className="plan-radio" />
            <span className="plan-copy">
              <b>{option.name}</b>
              <small>
                {option.features[0]} · {option.features[1]}
              </small>
            </span>
            <span className="plan-price">
              <b>{formatIdr(option.promoPrice)}</b>
              <del>{formatIdr(option.regularPrice)}</del>
            </span>
          </button>
        ))}
      </div>
      <div className="purchase-total">
        <span>Perkiraan biaya tahunan</span>
        <strong>
          {formatIdr(plan.promoPrice)} <small>/ {product.unitLabel}</small>
        </strong>
      </div>
      <button className="button button-primary purchase-button" onClick={add}>
        <ShoppingBag size={17} />
        {added ? "Tambahkan lagi" : "Tambah ke keranjang"}
      </button>
      <p className={`purchase-message ${added ? "success" : ""}`} role="status">
        {message || (
          <>
            <Check size={14} /> Pembayaran pada demo ini tidak menagih sungguhan.
          </>
        )}
      </p>
    </div>
  );
}
