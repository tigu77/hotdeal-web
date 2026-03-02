"use client";

import { useState, useEffect, useRef } from "react";
import { getProducts } from "@/data/products";
import type { Product } from "@/types";
import { formatPrice, getProductPrices } from "@/lib/format";
import { getDisplaySoldPercent } from "@/lib/product";
import { trackRecentlyViewedClick } from "@/lib/analytics";
import { getRecentlyViewed, cleanRecentlyViewed } from "@/lib/recently-viewed";
import SoldBar from "@/components/SoldBar";

export default function RecentlyViewed() {
  const [items, setItems] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState);
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [items]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  useEffect(() => {
    const loadRecent = () => {
      const stored = getRecentlyViewed();
      if (stored.length === 0) { setItems([]); return; }

      const products = getProducts();
      const productMap = new Map(products.map((p) => [p.id, p]));

      const found: Product[] = [];
      const validIds: string[] = [];
      for (const id of stored) {
        const p = productMap.get(id);
        if (p) {
          found.push(p);
          validIds.push(id);
        }
      }

      // 삭제된 상품 정리
      if (validIds.length !== stored.length) {
        cleanRecentlyViewed(validIds);
      }

      setItems(found);
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
      <div className="relative group/scroll">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 shadow-md rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-orange-500 transition-all hidden md:flex"
            aria-label="왼쪽으로"
          >
            ‹
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 shadow-md rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-orange-500 transition-all hidden md:flex"
            aria-label="오른쪽으로"
          >
            ›
          </button>
        )}
      <div
        ref={scrollRef}
        onWheel={(e) => {
          if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
            e.preventDefault();
            scrollRef.current?.scrollBy({ left: e.deltaY });
          }
        }}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
      >
        {items.map((item) => {
          const { finalPrice: displayPrice, discountPercent: discount } = getProductPrices(item);
          const priceColor = item.isWow ? "text-purple-600" : "text-orange-600";

          return (
            <a
              key={item.id}
              href={item.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-shrink-0 w-28 group ${item.isSoldOut ? 'opacity-50 grayscale' : ''}`}
              onClick={() => trackRecentlyViewedClick(item.id, item.title, item.source)}
            >
              <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-50 mb-1.5">
                {item.isSoldOut && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl z-[1]">
                    <span className="text-white text-[12px] font-bold">한정수량 마감</span>
                  </div>
                )}
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
                {discount > 0 && (
                  <span className="text-[10px] font-bold text-red-500">
                    {discount}%↓
                  </span>
                )}
              </div>
              {item.rating != null && item.rating > 0 && (
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] font-bold text-yellow-500">⭐{item.rating.toFixed(1)}</span>
                  {item.reviewCount != null && item.reviewCount > 0 && (
                    <span className="text-[10px] text-gray-400">({item.reviewCount.toLocaleString()})</span>
                  )}
                </div>
              )}
              {(() => {
                const sp = getDisplaySoldPercent(item);
                return sp > 0 ? <SoldBar soldPercent={sp} variant="mini" /> : null;
              })()}
            </a>
          );
        })}
      </div>
      </div>
    </section>
  );
}
