import type { Metadata } from "next";
import { SiteShell } from "@/components/layouts/site-shell";
import { LandingPage } from "@/features/content/components/landing-page";
import { getLandingContent } from "@/features/content/server/queries";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLandingContent();
  return { title: content.seo.title, description: content.seo.description };
}

export default async function HomePage() {
  const content = await getLandingContent();
  return (
    <SiteShell>
      <LandingPage content={content} />
    </SiteShell>
  );
}
