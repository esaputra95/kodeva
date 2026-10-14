"use client";

import { useEffect } from "react";
import {
  AttributionSchema,
  captureFirstTouch,
  readStoredAttribution,
} from "@/features/attribution/model/attribution";

export function AttributionCapture() {
  useEffect(() => {
    try {
      const current = readStoredAttribution(window.sessionStorage);
      const next = captureFirstTouch(window.location.href, current);
      const parsed = AttributionSchema.safeParse(next);
      if (parsed.success && parsed.data.capturedAt) {
        window.sessionStorage.setItem("kodeva:attribution:v1", JSON.stringify(parsed.data));
      }
    } catch {
      // Private browsing/storage denial should not block the page.
    }
  }, []);

  return null;
}
