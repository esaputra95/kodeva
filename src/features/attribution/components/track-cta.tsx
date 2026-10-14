"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackLandingCta } from "@/features/attribution/model/events";
import { getAttribution } from "@/features/attribution/model/attribution";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  ctaId: string;
  campaignId?: string;
  children: ReactNode;
};

export function TrackCta({ href, ctaId, campaignId, children, onClick, ...props }: Props) {
  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented)
          trackLandingCta({ ctaId, destination: href, campaignId, attribution: getAttribution() });
      }}
    >
      {children}
    </Link>
  );
}
