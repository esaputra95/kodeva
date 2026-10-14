"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/integrations/supabase/browser";

export function MarketingLoginForm() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  async function submit(formData: FormData) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Kredensial Supabase belum diisi di .env.local.");
      return;
    }
    setPending(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    if (error) {
      setMessage("Login gagal. Periksa email dan password akun marketing.");
      setPending(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }
  return (
    <form className="admin-login-form" action={submit}>
      <label className="form-control">
        <span>Email</span>
        <input name="email" type="email" required autoComplete="username" />
      </label>
      <label className="form-control">
        <span>Password</span>
        <input name="password" type="password" required autoComplete="current-password" />
      </label>
      {message ? (
        <p className="form-message error" role="alert">
          {message}
        </p>
      ) : null}
      <button className="button button-primary" disabled={pending}>
        {pending ? "Memeriksa…" : "Masuk ke panel"}
      </button>
      <p className="admin-login-hint">
        Akses dibatasi untuk akun yang ditambahkan ke daftar marketing di Supabase.
      </p>
    </form>
  );
}
