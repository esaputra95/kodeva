import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Artikel",
  type: "document",
  groups: [
    { name: "content", title: "Konten", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug URL",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Gambar cover",
      type: "image",
      group: "content",
      options: { hotspot: true },
    }),
    defineField({
      name: "coverAlt",
      title: "Deskripsi gambar cover",
      type: "string",
      group: "content",
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: "excerpt",
      title: "Ringkasan",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required().max(260),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "reference",
      group: "content",
      to: [{ type: "blogCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Isi artikel",
      type: "array",
      group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Teks", value: "normal" },
            { title: "Judul bagian", value: "h2" },
            { title: "Subjudul", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Tebal", value: "strong" },
              { title: "Miring", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Tautan eksternal",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (rule) => rule.uri({ scheme: ["https", "mailto"] }),
                  },
                ],
              },
              {
                name: "productLink",
                type: "object",
                title: "Tautan produk Kodeva",
                fields: [
                  {
                    name: "productId",
                    type: "string",
                    title: "ID produk",
                    options: {
                      list: [
                        "kasir-retail",
                        "hr-payroll",
                        "inventory-warehouse",
                        "kasir-fnb",
                        "attendance-online",
                        "accounting-reports",
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Deskripsi gambar", type: "string" }],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "publishedAt",
      title: "Tanggal publish",
      type: "datetime",
      group: "content",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "seo",
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 2,
      group: "seo",
      validation: (rule) => rule.max(170),
    }),
  ],
  orderings: [
    {
      title: "Tanggal publish terbaru",
      name: "publishedAtDesc",
      by: [
        { field: "publishedAt", direction: "desc" },
        { field: "_id", direction: "asc" },
      ],
    },
  ],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "coverImage" } },
});
