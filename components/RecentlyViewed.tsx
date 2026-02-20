"use client";

import { useState, useEffect, useRef } from "react";
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
  isSoldOut?: boolean;
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
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item) => {
          const displayPrice = item.isWow && item.wowPrice != null ? item.wowPrice : (item.salePrice || item.price);
          const priceColor = item.isWow ? "text-purple-600" : "text-orange-600";

          return (
            <a
              key={item.productId}
              href={item.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-shrink-0 w-28 group ${item.isSoldOut ? 'opacity-50 grayscale' : ''}`}
            >
              <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-50 mb-1.5">
                {item.isSoldOut && (
                  <span className="absolute top-1 left-1 z-10 bg-gray-600 text-white text-[8px] font-bold px-1 py-0.5 rounded">
                    한정수량 마감
                  </span>
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
      </div>
    </section>
  );
}
