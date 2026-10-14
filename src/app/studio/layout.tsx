import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanity Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="studio-page">{children}</div>;
}
