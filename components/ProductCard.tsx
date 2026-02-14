"use client";

import { Product } from "@/types";

function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 hover:-translate-y-1"
    >
      <div className="flex gap-3 p-3">
        {/* 이미지 (작게) */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
              <span className="text-3xl">🛒</span>
            </div>
          )}
          {/* 로켓배송 */}
          {product.isRocket && (
            <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
              🚀
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* 상품명 */}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.title}
          </h3>

          {/* 가격 정보 - 한눈에 */}
          <div className="mt-1.5">
            {product.originalPrice && product.originalPrice > 0 && (
              <span className="text-xs text-gray-400 line-through mr-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount && (
              <span className="text-xs font-bold text-red-500 mr-2">
                {product.discount}%↓
              </span>
            )}
            {product.price > 0 && (
              <div className="text-lg font-bold text-orange-600">
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          {/* 하단: 시간 + 평점 */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-gray-400">{timeAgo(product.postedAt)}</span>
            {product.rating && (
              <span className="text-[11px] text-gray-400">
                ★{product.rating}({product.reviewCount?.toLocaleString()})
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
