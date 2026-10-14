"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/integrations/supabase/browser";

export function PasswordResetRequestForm() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Konfigurasi Supabase belum tersedia.");
      return;
    }

    setPending(true);
    setMessage("");
    setSent(false);
    const email = String(formData.get("email") ?? "").trim();
    const redirectTo = new URL("/admin/reset-password", window.location.origin).toString();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    setSent(!error);
    setMessage(
      error
        ? "Tautan belum dapat dikirim. Periksa email atau coba lagi beberapa saat."
        : "Jika email terdaftar, tautan untuk mengatur password akan segera dikirim.",
    );
    setPending(false);
  }

  return (
    <form className="admin-login-form" action={submit}>
      <label className="form-control">
        <span>Email akun marketing</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      {message ? (
        <p
          className={`form-message ${sent ? "success" : "error"}`}
          role={sent ? "status" : "alert"}
        >
          {message}
        </p>
      ) : null}
      <button className="button button-primary" disabled={pending}>
        {pending ? "Mengirim…" : "Kirim tautan"}
      </button>
    </form>
  );
}
