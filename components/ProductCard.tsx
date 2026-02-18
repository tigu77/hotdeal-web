"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/types";
import { formatPrice, timeAgo } from "@/lib/format";

interface ProductCardProps {
  product: Product;
}

function useCountdown(expiresAt?: string) {
  const [remaining, setRemaining] = useState("");
  const [expired, setExpired] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setRemaining("종료");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setIsUrgent(diff < 3600000); // 1시간 미만
      setRemaining(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return { remaining, expired, isUrgent };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { originalPrice, salePrice, wowPrice, price, isWow } = product;
  const { remaining, expired, isUrgent } = useCountdown(product.expiresAt);

  const basePrice = originalPrice || 0;
  const finalPrice =
    isWow && wowPrice != null && wowPrice !== undefined
      ? wowPrice
      : salePrice || price;
  const discountPercent =
    basePrice > 0 && finalPrice < basePrice
      ? Math.round(((basePrice - finalPrice) / basePrice) * 100)
      : product.discount || 0;

  const soldPercent = product.soldPercent || 0;
  const isAlmostGone = soldPercent >= 80;

  return (
    <a
      href={product.affiliateUrl}
      className="group flex gap-3 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-orange-200"
    >
      {/* 썸네일 */}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
            <span className="text-3xl">🛒</span>
          </div>
        )}
        {isAlmostGone && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse">
            🔥 매진임박
          </span>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* 상품명 */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.title}
        </h3>

        {/* 가격 블록 */}
        <div className="mt-1.5">
          {basePrice > 0 && discountPercent > 0 && (
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(basePrice)}
              </span>
              <span className="text-xs font-bold text-red-500">
                {discountPercent}%↓
              </span>
            </div>
          )}

          {(salePrice ?? price ?? 0) > 0 && (
            <span className="text-lg font-bold text-orange-600">
              {formatPrice((salePrice || price)!)}
            </span>
          )}

          {isWow && wowPrice != null && (
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-purple-600">
                {wowPrice === 0 ? "무료" : formatPrice(wowPrice)}
              </span>
              <span className="text-[10px] text-white font-semibold bg-purple-500 px-1.5 py-0.5 rounded">
                와우
              </span>
            </div>
          )}
        </div>

        {/* 타이머 + 판매율 */}
        <div className="flex flex-col gap-1 mt-1.5">
          {remaining && (
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold tabular-nums tracking-tight ${
                isUrgent ? "text-red-600 animate-pulse" : "text-orange-500"
              }`}>
                ⏰ {remaining}
              </span>
              <span className="text-[10px] text-gray-400">남음</span>
            </div>
          )}
          {soldPercent > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                <div
                  className={`h-full rounded-full transition-all ${
                    soldPercent >= 80
                      ? "bg-red-500"
                      : soldPercent >= 50
                        ? "bg-orange-400"
                        : "bg-blue-400"
                  }`}
                  style={{ width: `${Math.min(soldPercent, 100)}%` }}
                />
              </div>
              <span className={`text-[11px] font-medium ${
                soldPercent >= 80 ? "text-red-500" : "text-gray-500"
              }`}>
                {soldPercent}% 판매
              </span>
            </div>
          )}
          {!remaining && !soldPercent && (
            <span className="text-[11px] text-gray-400">
              {timeAgo(product.postedAt)}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
