"use client";

import { useRef, useState } from "react";
import { trackShare } from "@/features/attribution/model/events";
import { shareContent } from "../services/share-content";
import type { ShareContent, ShareResult } from "../types";

export function useShare(content: ShareContent) {
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ShareResult | null>(null);

  async function run(useNativeShare: boolean) {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setResult(null);
    try {
      const outcome = await shareContent(content, {
        share: useNativeShare ? navigator.share?.bind(navigator) : undefined,
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

  return { share: () => run(true), copy: () => run(false), pending, result };
}
