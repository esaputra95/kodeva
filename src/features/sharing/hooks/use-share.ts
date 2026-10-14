"use client";

import { useRef, useState } from "react";
import { trackShare } from "@/features/attribution/model/events";
import { shareContent } from "../services/share-content";
import type { ShareContent, ShareResult } from "../types";

export function useShare(content: ShareContent) {
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ShareResult | null>(null);

  async function share() {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setResult(null);
    try {
      const outcome = await shareContent(content, {
        share: navigator.share?.bind(navigator),
        copy: navigator.clipboard?.writeText.bind(navigator.clipboard),
      });
      setResult(outcome);
      if (outcome === "shared" || outcome === "copied") {
        trackShare(content, outcome === "shared" ? "native" : "copy");
      }
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return { share, pending, result };
}
