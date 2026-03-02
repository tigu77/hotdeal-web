import type { SourceAdapter, WebProduct } from './types';

interface NaverRaw {
  productId: string;
  title: string;
  originalPrice?: number;
  salePrice?: number;
  discountRate?: number;
  imageUrl?: string;
  productUrl?: string;
  affiliateUrl?: string;
  storeName?: string;
  category?: string;
  commissionRate?: number;
  status?: string;
  scrapedAt?: string;
  source?: string;
}

export const naverAdapter: SourceAdapter<NaverRaw> = {
  source: 'naver',

  transform(rawItems) {
    return rawItems
      .filter((r) => r.status !== '❌' && r.title && r.affiliateUrl)
      .map((raw): WebProduct => {
        const finalPrice = raw.salePrice || raw.originalPrice || 0;
        const origPrice = raw.originalPrice || 0;
        const discount = raw.discountRate ||
          (origPrice > 0 && finalPrice > 0 && finalPrice < origPrice
            ? Math.round(((origPrice - finalPrice) / origPrice) * 100)
            : 0);

        return {
          id: `naver-${raw.productId}`,
          title: raw.title,
          description: '',
          price: finalPrice,
          originalPrice: origPrice || undefined,
          discount: discount || undefined,
          imageUrl: raw.imageUrl || '',
          affiliateUrl: raw.affiliateUrl || '',
          productUrl: raw.productUrl,
          productId: raw.productId,
          category: raw.category || 'general',
          tags: buildTags(raw, finalPrice),
          postedAt: raw.scrapedAt || new Date().toISOString(),
          source: 'naver',
          storeName: raw.storeName,
          commissionRate: raw.commissionRate,
        };
      });
  },
};

function buildTags(raw: NaverRaw, price: number): string[] {
  const tags: string[] = [];
  if (raw.storeName) tags.push(raw.storeName);
  if (price > 0 && price <= 30000) tags.push('3만원이하');
  return tags;
}
