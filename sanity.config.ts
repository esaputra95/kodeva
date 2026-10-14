"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "77o8k6wz";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "kodeva",
  title: "Kodeva CMS",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Konten Kodeva")
          .items([
            S.listItem()
              .title("Landing Promo Akhir Tahun")
              .id("campaignLanding")
              .child(S.document().schemaType("campaignLanding").documentId("campaignLanding")),
            S.documentTypeListItem("post").title("Artikel"),
            S.documentTypeListItem("blogCategory").title("Kategori artikel"),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
