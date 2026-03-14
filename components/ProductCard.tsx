"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Product } from "@/types";
import { formatPrice, formatSalesVolume, timeAgo, getProductPrices } from "@/lib/format";
import { getDisplaySoldPercent } from "@/lib/product";
import { trackProductClick, trackImageClick, trackSoldOutView, trackExternalLinkClick } from "@/lib/analytics";
import { saveRecentlyViewed } from "@/lib/recently-viewed";
import { useCountdown } from "@/components/CountdownTimer";
import WishlistButton from "@/components/WishlistButton";
import SoldBar from "@/components/SoldBar";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  eager?: boolean;
}

export default function ProductCard({ product, compact = false, eager = false }: ProductCardProps) {
  const { salePrice, wowPrice, price, isWow } = product;
  const { remaining, expired, isUrgent } = useCountdown(product.expiresAt, product.id, product.title);
  const { basePrice, finalPrice, discountPercent } = getProductPrices(product);

  const isNaver = product.source === 'naver';
  const isAli = product.source === 'aliexpress';
  const isCoupang = !isNaver && !isAli;
  const isSoldOut = product.isSoldOut || false;
  const soldPercent = getDisplaySoldPercent(product);
  const isAlmostGone = soldPercent >= 80;

  // ── 품절 상품 뷰포트 노출 트래킹 ──
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isSoldOut || !cardRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackSoldOutView(product.id, product.title);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isSoldOut, product.id, product.title]);

  // ── 공통 클릭 핸들러 ──
  const handleClick = () => {
    trackProductClick(product.id, product.title, product.category, product.source);
    trackExternalLinkClick(product.id, isNaver ? 'naver' : isAli ? 'aliexpress' : 'coupang', product.affiliateUrl);
    saveRecentlyViewed(product.id);
  };

  // ── 이미지 클릭 핸들러 ──
  const handleImageClick = useCallback(() => {
    trackImageClick(product.id, product.title);
  }, [product.id, product.title]);

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
      source={product.source}
    />
  );

  const thumbnail = (src: string, cls: string, eager?: boolean) => (
    <img src={src} alt={product.title} className={cls} loading={eager ? "eager" : "lazy"} />
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

  const sourceIcon = isNaver ? '/icons/naver.ico' : isAli ? '/icons/aliexpress.ico' : '/icons/coupang.ico';
  const sourceName = isNaver ? '네이버' : isAli ? '알리' : '쿠팡';
  const sourceBadge = (
    <span className={`flex-shrink-0 text-[9px] font-bold text-white px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
      isNaver ? 'bg-green-500' : isAli ? 'bg-orange-500' : 'bg-red-500'
    }`}>
      <img src={sourceIcon} alt={sourceName} className="w-3 h-3" />
      {sourceName}
    </span>
  );

  const rocketBadge = isCoupang && product.isRocket ? (
    <span className="flex-shrink-0 text-[9px] font-bold text-white px-1.5 py-0.5 rounded bg-blue-500">
      🚀 로켓
    </span>
  ) : null;

  const badgeColors: Record<string, string> = {
    '슈퍼적립': '#7346F3',
    '역대최저가': '#E53E3E',
    '재등장': '#DD6B20',
    '직구 핫딜': '#F4845F',
    'Choice': '#CCB800',
    '브랜드+': '#C5D8F0',
  };
  const badgeTextColors: Record<string, string> = {
  };
  const badgeIcons: Record<string, string> = {
    '역대최저가': '🏆',
    '재등장': '🔄',

  };
  const extraBadges = product.badges?.map((badge, i) => (
    <span key={i} className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: badgeColors[badge] || '#7346F3', color: badgeTextColors[badge] || '#FFFFFF' }}>
      {badgeIcons[badge] ? badgeIcons[badge] + ' ' : ''}{badge === '브랜드+' ? <>브랜드<span style={{ color: '#FFD700' }}>+</span></> : badge}
    </span>
  ));

  const storeInfo = (isNaver || isAli) && product.storeName && (
    <span className="text-[11px] text-gray-500">🏪 {product.storeName}</span>
  );

  const aliInfo = isAli && (
    <div className="flex items-center gap-1.5 flex-wrap">
      {product.salesVolume != null && product.salesVolume > 0 && (
        <span className="text-[11px] text-gray-500">🔥 {formatSalesVolume(product.salesVolume)}</span>
      )}
      {product.isFreeShipping && (
        <span className="text-[11px] text-green-600 font-medium">🚚 무료배송</span>
      )}
    </div>
  );

  const soldBar = soldPercent >= 0 && <SoldBar soldPercent={soldPercent} variant="card" />;

  // ── compact 모드 (세로형 2열) ──
  if (compact) {
    return (
      <div ref={cardRef} className={`group relative p-2 bg-white rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[1.01] transition-all duration-200 ease-out border border-gray-100 hover:border-orange-200 cursor-pointer ${isSoldOut ? 'opacity-50 grayscale' : ''}`}>
        {clickOverlay}
        <div className="relative aspect-square lg:aspect-[4/5] rounded-lg overflow-hidden bg-gray-50 mb-2" onClick={handleImageClick}>
          {wishlistBtn}
          {product.imageUrl ? thumbnail(product.imageUrl.replace(/\/\d+x\d+ex\//, '/230x230ex/'), "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300", eager) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200"><span className="text-2xl">🛒</span></div>
          )}
          {soldOutBadge}
        </div>
        <div className="mb-1">
          <div className="flex items-center gap-1 mb-0.5 flex-wrap">
            {sourceBadge}
            {rocketBadge}
            {extraBadges}
          </div>
          <h3 className="font-semibold text-gray-900 text-xs leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.title}
          </h3>
        </div>
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
            <span className="text-yellow-500 font-bold">⭐{(Math.floor(product.rating * 10) / 10).toFixed(1)}</span>
            {!isAli && product.reviewCount != null && product.reviewCount > 0 && <span className="text-gray-400"> ({product.reviewCount.toLocaleString()})</span>}
            {isAli && product.salesVolume != null && product.salesVolume > 0 && <span className="text-gray-400"> ({formatSalesVolume(product.salesVolume)})</span>}
          </div>
        )}
        {isAli && <div className="mt-1">{aliInfo}</div>}
        {isCoupang && remaining && !isSoldOut && (
          <div className="mt-1">
            <span className={`text-[11px] font-bold tabular-nums ${isUrgent ? "text-red-600 animate-pulse" : "text-orange-500"}`}>
              ⏰ {remaining}
            </span>
          </div>
        )}
        {isCoupang && <div className="mt-1">{soldBar}</div>}
        {isNaver && <div className="mt-1">{storeInfo}</div>}
        {isAli && <div className="mt-1">{storeInfo}</div>}

      </div>
    );
  }

  // ── 기본 모드 (가로형 리스트) ──
  return (
    <div ref={cardRef} className={`group relative flex gap-3 p-3 bg-white rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[1.01] transition-all duration-200 ease-out border border-gray-100 hover:border-orange-200 cursor-pointer ${isSoldOut ? 'opacity-50 grayscale' : ''}`}>
      {clickOverlay}
      {/* 썸네일 */}
      <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50" onClick={handleImageClick}>
        {wishlistBtn}
        {product.imageUrl ? thumbnail(product.imageUrl, "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300", eager) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200"><span className="text-3xl">🛒</span></div>
        )}
        {soldOutBadge}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 mb-0.5 flex-wrap">
            {sourceBadge}
            {rocketBadge}
            {extraBadges}
          </div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.title}
          </h3>
        </div>

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
                  <span className="text-yellow-500 font-bold">⭐{(Math.floor(product.rating * 10) / 10).toFixed(1)}</span>
                  {!isAli && product.reviewCount != null && product.reviewCount > 0 && <span className="text-gray-400"> ({product.reviewCount.toLocaleString()})</span>}
                  {isAli && product.salesVolume != null && product.salesVolume > 0 && <span className="text-gray-400"> ({formatSalesVolume(product.salesVolume)})</span>}
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
          {isAli && aliInfo}
          {isAli && storeInfo}

        </div>
      </div>
    </div>
  );
}
