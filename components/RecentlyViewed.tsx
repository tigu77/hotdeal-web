"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/data/products";
import { formatPrice } from "@/lib/format";

interface RecentItem {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  salePrice?: number;
  wowPrice?: number;
  originalPrice?: number;
  discount?: number;
  isWow?: boolean;
  isRocket?: boolean;
  affiliateUrl: string;
  soldPercent?: number;
  expiresAt?: string;
  rating?: number;
  reviewCount?: number;
  timestamp: number;
}

const STORAGE_KEY = "recentlyViewed";

export default function RecentlyViewed() {
  const [items, setItems] = useState<(RecentItem & { expired: boolean })[]>([]);

  useEffect(() => {
    const loadRecent = () => {
      try {
        const stored: RecentItem[] = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        );
        if (stored.length === 0) { setItems([]); return; }

        const activeIds = new Set(getProducts().map((p) => p.id));
        const active = stored.filter((item) => activeIds.has(item.productId));
        if (active.length !== stored.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
        }
        setItems(active.map((item) => ({ ...item, expired: false })));
      } catch {}
    };

    loadRecent();

    const onVisible = () => {
      if (document.visibilityState === "visible") loadRecent();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3">🕐 최근 본 상품</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item) => {
          const displayPrice = item.isWow && item.wowPrice != null ? item.wowPrice : (item.salePrice || item.price);
          const priceColor = item.isWow ? "text-purple-600" : "text-orange-600";

          return (
            <a
              key={item.productId}
              href={item.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-28 group"
            >
              <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-50 mb-1.5">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                    <span className="text-2xl">🛒</span>
                  </div>
                )}
              </div>
              <h3 className="text-xs font-medium text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-1">
                <span className={`text-xs font-bold ${priceColor}`}>
                  {displayPrice === 0 ? "무료" : formatPrice(displayPrice)}
                </span>
                {item.discount != null && item.discount > 0 && (
                  <span className="text-[10px] font-bold text-red-500">
                    {item.discount}%↓
                  </span>
                )}
              </div>
              {item.rating != null && item.rating > 0 && (
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] text-yellow-500">⭐{item.rating.toFixed(1)}</span>
                  {item.reviewCount != null && item.reviewCount > 0 && (
                    <span className="text-[10px] text-gray-400">({item.reviewCount.toLocaleString()})</span>
                  )}
                </div>
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}
