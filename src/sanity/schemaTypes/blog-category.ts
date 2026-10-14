import { defineField, defineType } from "sanity";

export const blogCategory = defineType({
  name: "blogCategory",
  title: "Kategori artikel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nama kategori",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
