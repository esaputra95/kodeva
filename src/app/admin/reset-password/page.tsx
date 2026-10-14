import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layouts/site-shell";
import { PasswordUpdateForm } from "@/features/marketing/components/password-update-form";

export const metadata: Metadata = {
  title: "Buat password panel marketing",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <SiteShell>
      <section className="section admin-login-page">
        <div className="admin-login-card">
          <Link className="back-link" href="/admin/login">
            ← Kembali ke login
          </Link>
          <span className="admin-mark">K</span>
          <p className="eyebrow">AREA MARKETING</p>
          <h1>Buat password baru.</h1>
          <p>Gunakan password baru untuk masuk ke panel marketing Kodeva.</p>
          <PasswordUpdateForm />
        </div>
      </section>
    </SiteShell>
  );
}
