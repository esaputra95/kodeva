"use client";

import { useState } from "react";
import { z } from "zod";
import { getAttribution } from "@/features/attribution/model/attribution";

const LeadFormSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(120),
  contact: z.string().trim().min(5, "Isi email atau WhatsApp yang bisa dihubungi.").max(254),
});

export function LeadForm({
  campaignId,
  successMessage,
  buttonLabel,
}: {
  campaignId: string;
  successMessage: string;
  buttonLabel: string;
}) {
  const [state, setState] = useState<{
    kind: "idle" | "pending" | "success" | "error";
    message: string;
  }>({ kind: "idle", message: "" });
  async function submit(formData: FormData) {
    const values = {
      name: String(formData.get("name") ?? ""),
      contact: String(formData.get("contact") ?? ""),
    };
    const parsed = LeadFormSchema.safeParse(values);
    if (!parsed.success) {
      setState({
        kind: "error",
        message: parsed.error.issues[0]?.message ?? "Periksa kembali data.",
      });
      return;
    }
    setState({ kind: "pending", message: "Mengirim permintaan…" });
    const attribution = getAttribution();
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          submissionId: crypto.randomUUID(),
          name: parsed.data.name,
          contact: parsed.data.contact,
          campaignId,
          attribution,
          landingPath: window.location.pathname,
          website: String(formData.get("website") ?? ""),
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Permintaan belum tersimpan. Coba lagi.",
        );
      setState({ kind: "success", message: successMessage });
      (document.getElementById("lead-form") as HTMLFormElement | null)?.reset();
    } catch (error) {
      setState({
        kind: "error",
        message: error instanceof Error ? error.message : "Permintaan belum tersimpan. Coba lagi.",
      });
    }
  }
  return (
    <form id="lead-form" className="lead-form" action={submit}>
      <div className="lead-form-fields">
        <label className="form-control">
          <span>Nama</span>
          <input name="name" autoComplete="name" required maxLength={120} placeholder="Nama kamu" />
        </label>
        <label className="form-control">
          <span>Email atau WhatsApp</span>
          <input
            name="contact"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="email@contoh.com atau 08…"
          />
        </label>
        <label className="honeypot" aria-hidden="true" tabIndex={-1}>
          Website
          <input name="website" autoComplete="off" tabIndex={-1} />
        </label>
        <button className="button button-primary" type="submit" disabled={state.kind === "pending"}>
          {state.kind === "pending" ? "Mengirim…" : buttonLabel}
        </button>
      </div>
      <p className={`form-message ${state.kind}`} role="status">
        {state.message ||
          "Form ini hanya untuk demonstrasi. Jangan masukkan data pribadi sungguhan."}
      </p>
    </form>
  );
}
