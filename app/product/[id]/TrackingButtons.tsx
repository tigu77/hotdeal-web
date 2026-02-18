"use client";

import { trackPurchaseClick, trackTelegramClick, trackRecommendClick } from "@/lib/analytics";

export function PurchaseButton({ productId, title, price, category, affiliateUrl }: {
  productId: string; title: string; price: number; category?: string; affiliateUrl: string;
}) {
  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackPurchaseClick(productId, title, price, category)}
      className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl text-lg transition-colors mt-4"
    >
      🛒 쿠팡에서 구매하기
    </a>
  );
}

export function TelegramButton({ url, location }: { url: string; location: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackTelegramClick(location)}
      className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors"
    >
      📢 텔레그램 구독하기
    </a>
  );
}

export function RecommendCard({ product, children }: {
  product: { id: string; title: string };
  children: React.ReactNode;
}) {
  return (
    <a
      href={`/product/${product.id}`}
      onClick={() => trackRecommendClick(product.id, product.title)}
      className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group"
    >
      {children}
    </a>
  );
}
