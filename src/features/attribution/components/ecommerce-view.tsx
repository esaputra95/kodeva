"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/features/products/model/types";
import { getAttribution } from "@/features/attribution/model/attribution";
import { trackEcommerceEvent } from "@/features/attribution/model/events";

export function EcommerceView({ product }: { product: Product }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackEcommerceEvent("view_item", {
      currency: "IDR",
      value: product.plans[0].promoPrice,
      attribution: getAttribution(),
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_variant: product.plans[0].name,
          price: product.plans[0].promoPrice,
          quantity: 1,
        },
      ],
    });
  }, [product]);
  return null;
}
