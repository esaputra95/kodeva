import type { Metadata } from "next";
import { SiteShell } from "@/components/layouts/site-shell";
import { CartPage } from "@/features/cart/components/cart-page";
export const metadata: Metadata = { title: "Keranjang" };
export default function CartRoute() {
  return (
    <SiteShell>
      <CartPage />
    </SiteShell>
  );
}
