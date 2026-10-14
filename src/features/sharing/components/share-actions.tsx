"use client";

import { useId } from "react";
import { Copy, MessageCircle, Share2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { trackShare } from "@/features/attribution/model/events";
import { useShare } from "../hooks/use-share";
import { canonicalShareUrl, whatsappShareUrl } from "../model/share-links";
import type { ShareContent } from "../types";

const labels: Record<ShareContent["kind"], string> = {
  campaign: "Bagikan campaign",
  product: "Bagikan produk",
  article: "Bagikan artikel",
};

export function ShareActions({ content }: { content: ShareContent }) {
  const inputId = useId();
  const { share, copy, pending, result } = useShare(content);
  const url = canonicalShareUrl(content.url);
  return (
    <div className="share-actions">
      <div className="share-buttons" role="group" aria-label={labels[content.kind]}>
        <Button type="button" variant="secondary" size="small" onClick={share} disabled={pending}>
          <Share2 size={17} aria-hidden="true" />
          {pending ? "Menyiapkan tautan…" : labels[content.kind]}
        </Button>
        <ButtonLink
          href={whatsappShareUrl(content.title, url)}
          variant="ghost"
          size="small"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bagikan lewat WhatsApp (tab baru)"
          onClick={() => trackShare(content, "whatsapp")}
        >
          <MessageCircle size={17} aria-hidden="true" /> WhatsApp
        </ButtonLink>
        <Button type="button" variant="ghost" size="small" onClick={copy} disabled={pending}>
          <Copy size={17} aria-hidden="true" /> Salin tautan
        </Button>
      </div>
      <p className="share-status" role="status" aria-live="polite">
        {result === "copied"
          ? "Tautan disalin. Siap dibagikan."
          : result === "shared"
            ? "Tautan diteruskan ke pilihan berbagi."
            : result === "manual"
              ? "Pilih tautan di bawah, lalu salin untuk dibagikan."
              : "Bagikan lewat perangkat, WhatsApp, atau salin tautan."}
      </p>
      {result === "manual" ? (
        <Field label="Tautan untuk dibagikan" htmlFor={inputId}>
          <Input
            id={inputId}
            value={url}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
          />
        </Field>
      ) : null}
    </div>
  );
}
