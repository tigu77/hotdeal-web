import type { Product } from "@/types";
import raw from "./products.json";

const allProducts: Product[] = (raw as any[]).map((p) => ({
  id: p.id || '',
  title: p.title || '',
  description: p.description || '',
  price: p.price || 0,
  salePrice: p.salePrice,
  wowPrice: p.wowPrice,
  originalPrice: p.originalPrice,
  discount: p.discount,
  imageUrl: p.imageUrl || p.image || '',
  affiliateUrl: p.affiliateUrl || p.url || '',
  category: p.category || 'general',
  tags: p.tags || [],
  isWow: !!p.wowPrice,
  isRocket: p.isRocket,
  soldPercent: p.soldPercent,
  expiresAt: p.expiresAt,
  postedAt: p.postedAt || new Date().toISOString(),
}));

/**
 * 중복 제거 + 최신순 정렬된 상품 목록
 * - title 기준 중복 제거, 최신 것만 유지
 */
export function getProducts(category?: string | null): Product[] {
  const sorted = [...allProducts].sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  // 같은 title이면 최신 것만 유지
  const seen = new Set<string>();
  const deduped = sorted.filter((p) => {
    if (seen.has(p.title)) return false;
    seen.add(p.title);
    return true;
  });

  if (!category) return deduped;
  return deduped.filter((p) => p.category === category);
}
