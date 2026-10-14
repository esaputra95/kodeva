"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/integrations/supabase/browser";

export function PasswordUpdateForm() {
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      void Promise.resolve().then(() => {
        if (!mounted) return;
        setMessage("Konfigurasi Supabase belum tersedia.");
        setReady(true);
      });
      return () => {
        mounted = false;
      };
    }

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      setHasSession(Boolean(data.session));
      if (error || !data.session) {
        setMessage("Tautan sudah kedaluwarsa atau tidak valid. Minta tautan baru.");
      }
      setReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  async function submit(formData: FormData) {
    const password = String(formData.get("password") ?? "");
    const confirmation = String(formData.get("confirmation") ?? "");
    if (password !== confirmation) {
      setMessage("Konfirmasi password belum sama.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Konfigurasi Supabase belum tersedia.");
      return;
    }

    setPending(true);
    setMessage("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage("Password belum dapat diperbarui. Coba minta tautan baru.");
      setPending(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  if (!ready) return <p className="admin-login-hint">Memeriksa tautan…</p>;

  if (!hasSession) {
    return (
      <>
        <p className="form-message error" role="alert">
          {message}
        </p>
        <p className="admin-login-hint">
          <a href="/admin/forgot-password">Minta tautan baru</a>
        </p>
      </>
    );
  }

  return (
    <form className="admin-login-form" action={submit}>
      <label className="form-control">
        <span>Password baru</span>
        <input name="password" type="password" required minLength={8} autoComplete="new-password" />
      </label>
      <label className="form-control">
        <span>Ulangi password</span>
        <input
          name="confirmation"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </label>
      {message ? (
        <p className="form-message error" role="alert">
          {message}
        </p>
      ) : null}
      <button className="button button-primary" disabled={pending}>
        {pending ? "Menyimpan…" : "Simpan password"}
      </button>
    </form>
  );
}
