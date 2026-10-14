import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layouts/site-header";
import { SiteFooter } from "@/components/layouts/site-footer";
import { CartHydrator } from "@/features/cart/components/cart-hydrator";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <CartHydrator />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
