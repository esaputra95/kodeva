"use client";

import { useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Link2 } from "lucide-react";
import {
  CampaignLinkSchema,
  buildCampaignUrl,
  type CampaignLinkInput,
} from "@/features/attribution/model/campaign-link";

const DESTINATIONS = [
  { title: "Landing campaign", value: "/" },
  { title: "Katalog aplikasi", value: "/products" },
  { title: "Blog", value: "/blog" },
  { title: "Kasir Retail", value: "/products/kasir-retail" },
  { title: "HR & Payroll", value: "/products/hr-payroll" },
  { title: "Inventori & Gudang", value: "/products/inventori-gudang" },
];

export function CampaignLinkForm({
  baseUrl,
  defaultCampaign,
}: {
  baseUrl: string;
  defaultCampaign: string;
}) {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const initialDestination = useMemo(() => DESTINATIONS[0].value, []);
  async function submit(formData: FormData) {
    const input: CampaignLinkInput = {
      destination: String(formData.get("destination") ?? initialDestination),
      source: String(formData.get("source") ?? "instagram") as CampaignLinkInput["source"],
      medium: String(formData.get("medium") ?? "social") as CampaignLinkInput["medium"],
      campaign: String(formData.get("campaign") ?? ""),
      term: String(formData.get("term") ?? ""),
      content: String(formData.get("content") ?? ""),
    };
    const parsed = CampaignLinkSchema.safeParse(input);
    if (!parsed.success) {
      setLink("");
      setError(parsed.error.issues[0]?.message ?? "Periksa isian campaign.");
      return;
    }
    try {
      setLink(buildCampaignUrl(baseUrl, parsed.data));
      setError("");
      setCopied(false);
    } catch (reason) {
      setLink("");
      setError(reason instanceof Error ? reason.message : "Tujuan tidak valid.");
    }
  }
  async function copy() {
    if (!link) return;
    setPending(true);
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(link);
      else {
        const field = document.createElement("textarea");
        field.value = link;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.append(field);
        field.select();
        const successful = document.execCommand("copy");
        field.remove();
        if (!successful) throw new Error("Salin otomatis tidak tersedia.");
      }
      setCopied(true);
    } catch {
      setError("Link siap. Salin URL dari kotak di bawah secara manual.");
    } finally {
      setPending(false);
    }
  }
  return (
    <form className="campaign-builder" action={submit}>
      <div className="campaign-form-grid">
        <label className="form-control">
          <span>Tujuan link</span>
          <select name="destination" defaultValue={initialDestination}>
            {DESTINATIONS.map((item) => (
              <option value={item.value} key={item.value}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label className="form-control">
          <span>Channel</span>
          <select name="source" defaultValue="instagram">
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
          </select>
        </label>
        <label className="form-control">
          <span>Jenis campaign</span>
          <select name="medium" defaultValue="social">
            <option value="social">Organik · social</option>
            <option value="paid_social">Iklan · paid_social</option>
          </select>
        </label>
        <label className="form-control">
          <span>Nama campaign</span>
          <input
            name="campaign"
            required
            maxLength={100}
            defaultValue={defaultCampaign}
            placeholder="promo-akhir-tahun"
          />
        </label>
        <label className="form-control">
          <span>
            Term <small>(opsional)</small>
          </span>
          <input name="term" maxLength={200} placeholder="kasir-umkm" />
        </label>
        <label className="form-control">
          <span>
            Content <small>(opsional)</small>
          </span>
          <input name="content" maxLength={200} placeholder="story-1" />
        </label>
      </div>
      <button className="button button-primary" type="submit">
        <Link2 size={16} /> Buat link campaign
      </button>
      {error ? (
        <p className="form-message error" role="alert">
          {error}
        </p>
      ) : null}
      {link ? (
        <div className="campaign-output">
          <span>LINK SIAP DIPAKAI</span>
          <output>{link}</output>
          <div>
            <button
              className="button button-outline button-small"
              type="button"
              onClick={copy}
              disabled={pending}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Tersalin" : pending ? "Menyalin…" : "Salin link"}
            </button>
            <a
              className="button button-outline button-small"
              href={link}
              target="_blank"
              rel="noreferrer"
            >
              Buka halaman <ExternalLink size={14} />
            </a>
          </div>
          <small>UTM lama pada tujuan diganti. Query dan anchor non-UTM tetap dipertahankan.</small>
        </div>
      ) : null}
    </form>
  );
}
