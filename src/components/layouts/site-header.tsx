"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { ROUTES } from "@/constants/app";
import { useCartStore } from "@/features/cart/model/store";

const links = [
  { href: ROUTES.home, label: "Beranda" },
  { href: ROUTES.products, label: "Produk" },
  { href: ROUTES.blog, label: "Blog" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { lines, hydrated } = useCartStore();
  const cartCount = hydrated ? lines.reduce((sum, line) => sum + line.quantity, 0) : 0;

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          className="brand"
          href="/"
          aria-label="Kodeva, beranda"
          onClick={() => setOpen(false)}
        >
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>Kodeva</span>
        </Link>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            href={ROUTES.cart}
            className="cart-link"
            aria-label={`Keranjang, ${cartCount} lisensi`}
          >
            <ShoppingBag size={19} strokeWidth={1.8} />
            <span>Keranjang</span>
            <span className="cart-count">{cartCount}</span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Navigasi mobile">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href={ROUTES.cart} onClick={() => setOpen(false)}>
            Keranjang ({cartCount})
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
