/** 공통 웹 상품 타입 — 모든 소스의 상품이 이 형태로 변환됨 */
export interface WebProduct {
  // 공통 필드
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  affiliateUrl: string;
  category: string;
  tags: string[];
  postedAt: string;
  source: 'coupang' | 'naver' | string;

  // 쿠팡 확장
  salePrice?: number;
  wowPrice?: number;
  isWow?: boolean;
  isRocket?: boolean;
  isFreeShipping?: boolean;
  isSoldOut?: boolean;
  soldPercent?: number;
  expiresAt?: string;
  rating?: number;
  reviewCount?: number;

  // 네이버 확장
  storeName?: string;
  commissionRate?: number;

  // 원본 참조
  productUrl?: string;
  productId?: string;
}

/** 소스 어댑터 인터페이스 */
export interface SourceAdapter<T = unknown> {
  source: string;
  transform(raw: T[]): WebProduct[];
}
