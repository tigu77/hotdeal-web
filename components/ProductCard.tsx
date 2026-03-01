"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/types";
import { formatPrice, timeAgo, calcDiscountPercent } from "@/lib/format";
import { getDisplaySoldPercent } from "@/lib/product";
import { trackProductClick } from "@/lib/analytics";
import WishlistButton from "@/components/WishlistButton";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
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

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { originalPrice, salePrice, wowPrice, price, isWow } = product;
  const { remaining, expired, isUrgent } = useCountdown(product.expiresAt);

  const basePrice = originalPrice || 0;
  const finalPrice =
    isWow && wowPrice != null && wowPrice !== undefined
      ? wowPrice
      : salePrice || price;
  const discountPercent =
    basePrice > 0 && finalPrice < basePrice
      ? calcDiscountPercent(basePrice, finalPrice)
      : product.discount || 0;

  const isNaver = product.source === 'naver';
  const isCoupang = product.source !== 'naver';
  const isSoldOut = product.isSoldOut || false;
  const soldPercent = getDisplaySoldPercent(product);
  const isAlmostGone = soldPercent >= 80;

  // ── 공통 클릭 핸들러 ──
  const handleClick = () => {
    trackProductClick(product.id, product.title, product.category);
    try {
      const STORAGE_KEY = "recentlyViewed";
      const MAX_ITEMS = 20;
      const stored: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const filtered = stored.filter((id) => id !== product.id);
      filtered.unshift(product.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
    } catch {}
  };

  // ── 공통 요소 ──
  const clickOverlay = (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="absolute inset-0 z-10"
      aria-label={product.title}
    />
  );

  const wishlistBtn = (
    <WishlistButton
      productId={product.id}
      title={product.title}
      imageUrl={product.imageUrl}
      price={finalPrice}
      discount={discountPercent}
      affiliateUrl={product.affiliateUrl}
    />
  );

  const thumbnail = (src: string, cls: string) => (
    <img src={src} alt={product.title} className={cls} loading="lazy" />
  );

  const soldOutBadge = isSoldOut ? (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl z-[1]">
      <span className="text-white text-[11px] font-bold">한정수량 마감</span>
    </div>
  ) : isAlmostGone ? (
    <span className={`absolute top-1 left-1 bg-red-500 text-white font-bold px-1.5 py-0.5 rounded animate-pulse ${compact ? 'text-[8px]' : 'text-[9px]'}`}>
      🔥 매진임박
    </span>
  ) : null;

  const sourceBadge = (pos: string) => (
    <span className={`absolute ${pos} z-[2] text-[9px] font-bold text-white px-1.5 py-0.5 rounded ${
      isNaver ? 'bg-green-500' : 'bg-red-500'
    }`}>
      {isNaver ? '네이버' : '쿠팡'}
    </span>
  );

  const storeInfo = isNaver && product.storeName && (
    <span className="text-[11px] text-gray-500">🏪 {product.storeName}</span>
  );

  const soldBar = soldPercent >= 0 && (
    <div className="flex items-center gap-1.5">
      <div className={`flex-1 bg-gray-100 rounded-full overflow-hidden ${compact ? 'h-2' : 'h-2 max-w-[80px]'}`}>
        <div
          className={`h-full rounded-full transition-all ${
            soldPercent >= 80 ? "bg-red-500" : soldPercent >= 50 ? "bg-orange-400" : "bg-blue-400"
          }`}
          style={{ width: `${Math.min(soldPercent, 100)}%` }}
        />
      </div>
      <span className={`font-bold ${compact ? 'text-[11px]' : 'text-[11px]'} ${soldPercent >= 80 ? "text-red-500" : "text-gray-500"}`}>
        {soldPercent}% 판매
      </span>
    </div>
  );

  // ── compact 모드 (세로형 2열) ──
  if (compact) {
    return (
      <div className={`group relative p-2.5 bg-white rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[1.01] transition-all duration-200 ease-out border border-gray-100 hover:border-orange-200 cursor-pointer ${isSoldOut ? 'opacity-50 grayscale' : ''}`}>
        {clickOverlay}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 mb-2">
          {wishlistBtn}
          {sourceBadge('top-1 left-1')}
          {product.imageUrl ? thumbnail(product.imageUrl.replace(/\/\d+x\d+ex\//, '/230x230ex/'), "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300") : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200"><span className="text-2xl">🛒</span></div>
          )}
          {soldOutBadge}
        </div>
        <h3 className="font-semibold text-gray-900 text-xs leading-snug line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
          {product.title}
        </h3>
        <div>
          {basePrice > 0 && discountPercent > 0 && (
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-[11px] text-gray-400 line-through">{formatPrice(basePrice)}</span>
              <span className="text-sm font-extrabold text-red-500">{discountPercent}%↓</span>
            </div>
          )}
          {(salePrice ?? price ?? 0) > 0 && !(isWow && (salePrice || price) === wowPrice) && (
            <span className="text-sm font-bold text-orange-600">{formatPrice((salePrice || price)!)}</span>
          )}
          {isWow && wowPrice != null && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-sm font-bold text-purple-600">{wowPrice === 0 ? "무료" : formatPrice(wowPrice)}</span>
              <span className="text-[9px] text-white font-semibold bg-purple-500 px-1 py-0.5 rounded">와우</span>
            </div>
          )}
        </div>
        {product.rating != null && product.rating > 0 && (
          <div className="mt-1 text-[11px]">
            <span className="text-yellow-500 font-bold">⭐{product.rating.toFixed(1)}</span>
            {product.reviewCount != null && product.reviewCount > 0 && <span className="text-gray-400"> ({product.reviewCount.toLocaleString()})</span>}
          </div>
        )}
        {isCoupang && remaining && !isSoldOut && (
          <div className="mt-1">
            <span className={`text-[11px] font-bold tabular-nums ${isUrgent ? "text-red-600 animate-pulse" : "text-orange-500"}`}>
              ⏰ {remaining}
            </span>
          </div>
        )}
        {isCoupang && <div className="mt-1">{soldBar}</div>}
        {isNaver && <div className="mt-1">{storeInfo}</div>}
        {!remaining && !soldPercent && !storeInfo && (
          <span className="text-[10px] text-gray-400">{timeAgo(product.postedAt)}</span>
        )}
      </div>
    );
  }

  // ── 기본 모드 (가로형 리스트) ──
  return (
    <div className={`group relative flex gap-3 p-3 bg-white rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[1.01] transition-all duration-200 ease-out border border-gray-100 hover:border-orange-200 cursor-pointer ${isSoldOut ? 'opacity-50 grayscale' : ''}`}>
      {clickOverlay}
      {/* 썸네일 */}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
        {wishlistBtn}
        {sourceBadge('top-1 left-1')}
        {product.imageUrl ? thumbnail(product.imageUrl, "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300") : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200"><span className="text-3xl">🛒</span></div>
        )}
        {soldOutBadge}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.title}
        </h3>

        <div className="mt-1.5">
          {(basePrice > 0 && discountPercent > 0 || (product.rating != null && product.rating > 0)) && (
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              {basePrice > 0 && discountPercent > 0 && (
                <>
                  <span className="text-xs text-gray-400 line-through">{formatPrice(basePrice)}</span>
                  <span className="text-sm font-extrabold text-red-500">{discountPercent}%↓</span>
                </>
              )}
              {product.rating != null && product.rating > 0 && (
                <span className="text-[11px]">
                  <span className="text-yellow-500 font-bold">⭐{product.rating.toFixed(1)}</span>
                  {product.reviewCount != null && product.reviewCount > 0 && <span className="text-gray-400"> ({product.reviewCount.toLocaleString()})</span>}
                </span>
              )}
            </div>
          )}

          {(salePrice ?? price ?? 0) > 0 && !(isWow && (salePrice || price) === wowPrice) && (
            <span className="text-lg font-bold text-orange-600">{formatPrice((salePrice || price)!)}</span>
          )}

          {isWow && wowPrice != null && (
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-purple-600">{wowPrice === 0 ? "무료" : formatPrice(wowPrice)}</span>
              <span className="text-[10px] text-white font-semibold bg-purple-500 px-1.5 py-0.5 rounded">와우</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-1.5">
          {isCoupang && remaining && !isSoldOut && (
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold tabular-nums tracking-tight ${isUrgent ? "text-red-600 animate-pulse" : "text-orange-500"}`}>
                ⏰ {remaining}
              </span>
              <span className="text-[10px] text-gray-400">남음</span>
            </div>
          )}
          {isCoupang && soldBar}
          {isNaver && storeInfo}
          {!remaining && !soldPercent && !storeInfo && (
            <span className="text-[11px] text-gray-400">{timeAgo(product.postedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
