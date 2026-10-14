"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProductById } from "@/features/products/model/catalog";
import {
  calculateCartTotals,
  PersistedCartSchema,
  setProductLineQuantity,
  type CartIssue,
  type CartLine,
} from "./cart-math";

type CartState = {
  lines: CartLine[];
  hydrated: boolean;
  storageWarning: string | null;
  setHydrated: (value: boolean, warning?: string | null) => void;
  addLine: (productId: string, planId: CartLine["planId"], quantity?: number) => CartIssue | null;
  setQuantity: (
    productId: string,
    planId: CartLine["planId"],
    quantity: number,
  ) => CartIssue | null;
  removeLine: (productId: string, planId: CartLine["planId"]) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      hydrated: false,
      storageWarning: null,
      setHydrated: (hydrated, storageWarning) =>
        set({ hydrated, ...(storageWarning !== undefined ? { storageWarning } : {}) }),
      addLine: (productId, planId, quantity = 1) => {
        const product = getProductById(productId);
        if (!product) return "product-missing";
        const existing = get().lines.find(
          (line) => line.productId === productId && line.planId === planId,
        );
        const result = setProductLineQuantity(
          get().lines,
          productId,
          planId,
          (existing?.quantity ?? 0) + quantity,
        );
        if (typeof result === "string") return result;
        set({ lines: result });
        return null;
      },
      setQuantity: (productId, planId, quantity) => {
        const result = setProductLineQuantity(get().lines, productId, planId, quantity);
        if (typeof result === "string") return result;
        set({ lines: result });
        return null;
      },
      removeLine: (productId, planId) =>
        set({
          lines: get().lines.filter(
            (line) => line.productId !== productId || line.planId !== planId,
          ),
        }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "kodeva:cart:v1",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => ({
        getItem: (name) =>
          typeof window === "undefined" ? null : window.localStorage.getItem(name),
        setItem: (name, value) => {
          if (typeof window !== "undefined") window.localStorage.setItem(name, value);
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") window.localStorage.removeItem(name);
        },
      })),
      partialize: (state) => ({ lines: state.lines }),
      merge: (persistedState, currentState) => {
        const parsed = PersistedCartSchema.safeParse(persistedState);
        if (!parsed.success)
          return {
            ...currentState,
            lines: [],
            hydrated: true,
            storageWarning:
              "Keranjang tersimpan tidak terbaca. Mulai lagi dengan pilihan yang valid.",
          };
        const lines = parsed.data.lines.filter((line) => Boolean(getProductById(line.productId)));
        const totals = calculateCartTotals(lines);
        if (lines.length !== parsed.data.lines.length || totals.issues.length > 0) {
          return {
            ...currentState,
            lines: [],
            hydrated: true,
            storageWarning:
              "Pilihan lama tidak cocok dengan katalog atau kuota. Periksa keranjang sebelum melanjutkan.",
          };
        }
        return { ...currentState, lines, hydrated: true, storageWarning: null };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error)
          state?.setHydrated(
            true,
            "Keranjang tersimpan tidak dapat dibaca. Kamu bisa mulai lagi dengan pilihan baru.",
          );
        else state?.setHydrated(true);
      },
    },
  ),
);
