"use client";

import type { Product } from "@/types";
import { formatPrice, timeAgo } from "@/lib/format";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { originalPrice, salePrice, wowPrice, price, isWow } = product;

  // 할인율: 와우가 있으면 와우 기준, 없으면 판매가 기준
  const basePrice = originalPrice || 0;
  const finalPrice = isWow && wowPrice != null ? wowPrice : (salePrice || price);
  const discountPercent =
    basePrice > 0 && finalPrice < basePrice
      ? Math.round(((basePrice - finalPrice) / basePrice) * 100)
      : product.discount || 0;

  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
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
        {product.isRocket && (
          <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            로켓
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
          {/* 원가 + 할인율 */}
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

          {/* 할인가 (판매가) */}
          {(() => {
            const displaySale = salePrice || (isWow ? originalPrice : 0) || 0;
            return displaySale > 0 ? (
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-orange-600">
                  {formatPrice(displaySale)}
                </span>
              </div>
            ) : null;
          })()}

          {/* 와우 할인가 (0원도 표시) — wowPrice 없으면 price로 대체 */}
          {isWow && (wowPrice != null || price != null) && (
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-red-500">
                {formatPrice(wowPrice ?? price)}
              </span>
              <span className="text-[10px] text-white font-semibold bg-red-500 px-1.5 py-0.5 rounded">
                와우
              </span>
            </div>
          )}

          {/* salePrice/wowPrice 둘 다 없으면 price 표시 */}
          {!salePrice && !wowPrice && price > 0 && (
            <span className="text-lg font-bold text-orange-600">
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* 메타 */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-gray-400">
            {timeAgo(product.postedAt)}
          </span>
          {product.rating != null && (
            <span className="text-[11px] text-gray-400">
              ★ {product.rating}
              {product.reviewCount != null && `(${product.reviewCount.toLocaleString()})`}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
