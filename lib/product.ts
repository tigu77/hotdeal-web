/**
 * 상품 판매율 표시값 계산
 * isSoldOut이면 무조건 100% 반환
 */
export function getDisplaySoldPercent(product: { isSoldOut?: boolean; soldPercent?: number }): number {
  if (product.isSoldOut) return 100;
  return product.soldPercent || 0;
}
