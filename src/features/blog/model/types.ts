export type PortableSpan = { _key: string; _type: "span"; text: string; marks?: string[] };
export type PortableTextBlock = {
  _key: string;
  _type: "block";
  style?: "normal" | "h2" | "h3" | "blockquote";
  children: PortableSpan[];
  markDefs?: Array<{
    _key: string;
    _type: "link" | "productLink";
    href?: string;
    productId?: string;
  }>;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverUrl?: string;
  coverAlt: string;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  body: PortableTextBlock[];
};
