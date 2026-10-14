import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatIdr } from "@/lib/format-idr";
import type { Product } from "@/features/products/model/types";
import { ProductVisual } from "./product-visual";
import { TrackCta } from "@/features/attribution/components/track-cta";

type ProductCardContent = {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  ctaLabel?: string;
};

export function ProductCard({
  product,
  content,
}: {
  product: Product;
  content?: ProductCardContent;
}) {
  const plan = product.plans[0];
  return (
    <article className="product-card">
      <Link
        className="product-card-visual-link"
        href={`/products/${product.slug}`}
        aria-label={`Lihat ${content?.title ?? product.name}`}
      >
        {content?.imageUrl ? (
          <div className="product-cms-image">
            <Image
              src={content.imageUrl}
              alt={content.imageAlt || content.title || product.name}
              width={780}
              height={440}
              sizes="(max-width: 700px) 90vw, (max-width: 980px) 45vw, 30vw"
            />
          </div>
        ) : (
          <ProductVisual product={product} compact />
        )}
      </Link>
      <div className="product-card-body">
        <div className="card-label-row">
          <Badge>{product.category}</Badge>
          <span className="quota-label">Promo {product.promoQuota} lisensi</span>
        </div>
        <h3>
          <Link href={`/products/${product.slug}`}>{content?.title || product.name}</Link>
        </h3>
        <p>{content?.description || product.shortDescription}</p>
        <ul className="card-feature-list">
          {product.featureList.slice(0, 2).map((feature) => (
            <li key={feature}>
              <Check size={14} />
              {feature}
            </li>
          ))}
        </ul>
        <div className="card-bottom">
          <span>
            <small>Mulai dari</small>
            <strong>
              {formatIdr(plan.promoPrice)}
              <del>{formatIdr(plan.regularPrice)}</del>
            </strong>
          </span>
          {content ? (
            <TrackCta
              className="text-link"
              href={`/products/${product.slug}`}
              ctaId={`featured-${product.id}`}
            >
              {content.ctaLabel || "Lihat paket"} <ArrowUpRight size={16} />
            </TrackCta>
          ) : (
            <Link className="text-link" href={`/products/${product.slug}`}>
              Lihat paket <ArrowUpRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
