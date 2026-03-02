/** 가격 포맷 (예: 36,990원) */
export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}

/** 상대 시간 표시 (예: 3시간 전) */
export function timeAgo(dateStr: string): string {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

/** 할인율 계산 (원가, 할인가) */
export function calcDiscountPercent(
  original: number,
  current: number
): number {
  if (original <= 0 || current <= 0) return 0;
  return Math.round(((original - current) / original) * 100);
}

/** 상품 객체에서 최종 할인율을 계산하는 헬퍼 */
export function getDiscountPercent(product: {
  originalPrice?: number;
  salePrice?: number;
  wowPrice?: number;
  price: number;
  isWow?: boolean;
  discount?: number;
}): number {
  const basePrice = product.originalPrice || 0;
  const finalPrice =
    product.isWow && product.wowPrice != null
      ? product.wowPrice
      : product.salePrice || product.price;
  return basePrice > 0 && finalPrice < basePrice
    ? calcDiscountPercent(basePrice, finalPrice)
    : product.discount || 0;
}
