import type { SourceAdapter, WebProduct } from './types';

interface AliRaw {
  productId: string;
  title: string;
  originalPrice?: number;
  salePrice?: number;
  discountRate?: number;
  imageUrl?: string;
  originalUrl?: string;
  affiliateUrl?: string;
  brand?: string;
  category1?: string;
  category2?: string;
  tags?: string;
  firstSeen?: string;
  lastSeen?: string;
}

export const aliexpressAdapter: SourceAdapter<AliRaw> = {
  source: 'aliexpress',

  transform(rawItems) {
    return rawItems
      .filter((r) => r.title && r.affiliateUrl)
      .map((raw): WebProduct => {
        const finalPrice = raw.salePrice || raw.originalPrice || 0;
        const origPrice = raw.originalPrice || 0;
        const discount = raw.discountRate ||
          (origPrice > 0 && finalPrice > 0 && finalPrice < origPrice
            ? Math.round(((origPrice - finalPrice) / origPrice) * 100)
            : 0);

        const category = raw.category2
          ? `${raw.category1} > ${raw.category2}`
          : raw.category1 || 'general';

        return {
          id: `ali-${raw.productId}`,
          title: raw.title,
          description: '',
          price: finalPrice,
          originalPrice: origPrice || undefined,
          discount: discount || undefined,
          imageUrl: raw.imageUrl || '',
          affiliateUrl: raw.affiliateUrl || '',
          productUrl: raw.originalUrl,
          productId: raw.productId,
          category,
          tags: buildTags(raw, finalPrice),
          postedAt: raw.lastSeen || raw.firstSeen || new Date().toISOString(),
          source: 'aliexpress',
        };
      });
  },
};

function buildTags(raw: AliRaw, price: number): string[] {
  const tags: string[] = [];
  if (raw.brand) tags.push(raw.brand);
  if (price > 0 && price <= 30000) tags.push('3만원이하');
  return tags;
}
