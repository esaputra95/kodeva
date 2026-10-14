"use client";

import { useEffect } from "react";
import { useCartStore } from "@/features/cart/model/store";

export function CartHydrator() {
  const rehydrate = useCartStore.persist.rehydrate;
  useEffect(() => {
    void rehydrate();
  }, [rehydrate]);
  return null;
}
