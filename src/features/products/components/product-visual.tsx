import { ArrowDownRight, ArrowUpRight, Boxes, CalendarDays, CreditCard, Users } from "lucide-react";
import type { Product } from "@/features/products/model/types";

const iconByAccent = { emerald: CreditCard, amber: Boxes, blue: Users, violet: CalendarDays };

export function ProductVisual({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const Icon = iconByAccent[product.accent];
  return (
    <div
      className={`product-visual visual-${product.accent}${compact ? " visual-compact" : ""}`}
      aria-label={product.previewLabel}
    >
      <div className="visual-window">
        <div className="visual-window-top">
          <span className="visual-dots">
            <i />
            <i />
            <i />
          </span>
          <span>{product.previewLabel}</span>
          <span className="visual-status">● Aktif</span>
        </div>
        <div className="visual-dashboard">
          <aside className="visual-sidebar">
            <span className="visual-side-logo">
              <Icon size={16} />
            </span>
            <i />
            <i />
            <i />
            <i />
          </aside>
          <div className="visual-content">
            <div className="visual-title-row">
              <div>
                <span className="visual-kicker">RINGKASAN HARI INI</span>
                <strong>{product.name}</strong>
              </div>
              <span className="visual-period">7 hari terakhir⌄</span>
            </div>
            <div className="visual-stat-row">
              <div>
                <span>Total tercatat</span>
                <strong>Rp 8,42 jt</strong>
                <small>
                  <ArrowUpRight size={12} /> 12,8%
                </small>
              </div>
              <div>
                <span>Perlu diperiksa</span>
                <strong>12 item</strong>
                <small className="visual-muted">
                  <ArrowDownRight size={12} /> 2 dari kemarin
                </small>
              </div>
            </div>
            <div className="visual-chart" aria-hidden="true">
              <span style={{ height: "36%" }} />
              <span style={{ height: "52%" }} />
              <span style={{ height: "43%" }} />
              <span style={{ height: "72%" }} />
              <span style={{ height: "58%" }} />
              <span style={{ height: "88%" }} />
              <span style={{ height: "68%" }} />
              <span style={{ height: "95%" }} />
              <span style={{ height: "76%" }} />
              <span style={{ height: "100%" }} />
              <span style={{ height: "70%" }} />
              <span style={{ height: "83%" }} />
            </div>
            <div className="visual-axis">
              <span>Sen</span>
              <span>Rab</span>
              <span>Jum</span>
              <span>Min</span>
            </div>
          </div>
        </div>
      </div>
      <div className="visual-caption">
        <span className="visual-caption-icon">
          <Icon size={16} />
        </span>
        <span>
          <b>{product.name}</b>
          <small>Contoh tampilan aplikasi</small>
        </span>
        <span className="visual-caption-arrow">↗</span>
      </div>
    </div>
  );
}
