import type { SourceAdapter, WebProduct } from './types';

interface CoupangRaw {
  productId: string;
  title: string;
  productUrl?: string;
  affiliateUrl?: string;
  imageUrl?: string;
  originalPrice?: number;
  salePrice?: number;
  wowPrice?: number | null;
  discountRate?: number;
  isRocket?: boolean;
  isSoldOut?: boolean;
  soldPercent?: number;
  expiresAt?: string;
  postedAt?: string;
  scrapedAt?: string;
  status?: string;
  detailChecked?: boolean;
  category?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
}

function calcFinalPrice(raw: CoupangRaw): number {
  if (raw.wowPrice != null && raw.wowPrice > 0) return raw.wowPrice;
  if (raw.salePrice && raw.salePrice > 0) return raw.salePrice;
  return raw.originalPrice || 0;
}

function calcDiscount(raw: CoupangRaw): number {
  if (raw.discountRate && raw.discountRate > 0) return raw.discountRate;
  const orig = raw.originalPrice || 0;
  const final = calcFinalPrice(raw);
  if (orig > 0 && final > 0 && final < orig) {
    return Math.round(((orig - final) / orig) * 100);
  }
  return 0;
}

export const coupangAdapter: SourceAdapter<CoupangRaw> = {
  source: 'coupang',

  transform(rawItems) {
    return rawItems
      .filter((r) => r.status !== '❌' && r.title && r.affiliateUrl)
      .map((raw): WebProduct => ({
        id: raw.productId,
        title: raw.title,
        description: '',
        price: calcFinalPrice(raw),
        originalPrice: raw.originalPrice || undefined,
        salePrice: raw.salePrice || undefined,
        wowPrice: raw.wowPrice ?? undefined,
        discount: calcDiscount(raw),
        imageUrl: raw.imageUrl || '',
        affiliateUrl: raw.affiliateUrl || '',
        productUrl: raw.productUrl,
        productId: raw.productId,
        category: raw.category || 'general',
        tags: raw.tags || buildTags(raw),
        isWow: !!(raw.wowPrice && raw.wowPrice > 0),
        isRocket: raw.isRocket,
        isSoldOut: raw.isSoldOut,
        soldPercent: raw.soldPercent,
        expiresAt: raw.expiresAt,
        postedAt: raw.postedAt || raw.scrapedAt || new Date().toISOString(),
        rating: raw.rating,
        reviewCount: raw.reviewCount,
        source: 'coupang',
      }));
  },
};

function buildTags(raw: CoupangRaw): string[] {
  const tags: string[] = [];
  if (raw.isRocket) tags.push('로켓배송');
  if (raw.wowPrice && raw.wowPrice > 0) tags.push('와우할인');
  const price = calcFinalPrice(raw);
  if (price > 0 && price <= 30000) tags.push('3만원이하');
  return tags;
}
