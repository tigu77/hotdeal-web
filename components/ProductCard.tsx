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
      {/* 이미지 */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
            <span className="text-5xl">🛒</span>
          </div>
        )}
        {/* 할인 배지 */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )}
        {/* 로켓배송 */}
        {product.isRocket && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            🚀 로켓배송
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="p-4">
        {/* 카테고리 & 시간 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {product.tags[0]}
          </span>
          <span className="text-xs text-gray-400">{timeAgo(product.postedAt)}</span>
        </div>

        {/* 상품명 */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.title}
        </h3>

        {/* 가격 */}
        {product.price > 0 && (
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-orange-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > 0 && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        )}

        {/* 평점 */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-xs text-gray-600">
              {product.rating} ({product.reviewCount?.toLocaleString()})
            </span>
          </div>
        )}

        {/* 구매 버튼 */}
        <div className="mt-3 bg-orange-500 text-white text-center py-2.5 rounded-xl text-sm font-semibold group-hover:bg-orange-600 transition-colors">
          🛒 최저가로 구매하기
        </div>
      </div>
    </a>
  );
}
