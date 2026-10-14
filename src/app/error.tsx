"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page rendering failed", error.digest ?? "no digest");
  }, [error.digest]);
  return (
    <main className="section">
      <div className="container empty-panel">
        <h1>Halaman belum dapat dimuat.</h1>
        <p>Coba sekali lagi. Pilihan keranjang yang tersimpan tetap ada di browser.</p>
        <button className="button button-primary" onClick={reset}>
          <RefreshCw size={15} /> Coba lagi
        </button>
      </div>
    </main>
  );
}
