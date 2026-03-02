import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/data/products";
import { formatPrice, getProductPrices } from "@/lib/format";
import { SITE, CATEGORIES } from "@/lib/constants";
import CountdownTimer from "@/components/CountdownTimer";
import ShareButtons from "@/components/ShareButtons";
import SoldBar from "@/components/SoldBar";
import { getDisplaySoldPercent } from "@/lib/product";
import { PurchaseButton, TelegramButton, RecommendCard } from "./TrackingButtons";
import SaveRecentlyViewed from "@/components/SaveRecentlyViewed";
import WishlistButton from "@/components/WishlistButton";
import ProductCard from "@/components/ProductCard";

function getProductById(id: string) {
  return getProducts().find((p) => p.id === id) || null;
}

export function generateStaticParams() {
  return getProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};

  const title = `${product.title} | 핫딜 알리미`;
  const description = `${product.title} - ${formatPrice(product.price)}${product.discount ? ` (${product.discount}% 할인)` : ""}. 쿠팡 최저가 핫딜!`;
  const keywords = ["핫딜", "최저가", "쿠팡", product.title, ...(product.tags || [])];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${SITE.url}/product/${product.id}`,
      siteName: SITE.name,
      images: product.imageUrl ? [{ url: product.imageUrl, width: 230, height: 230 }] : [],
      type: "article",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
    alternates: {
      canonical: `/product/${product.id}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const { salePrice, wowPrice, price, isWow } = product;
  const { basePrice, finalPrice, discountPercent } = getProductPrices(product);

  const categoryInfo = CATEGORIES.find((c) => c.id === product.category);
  const relatedProducts = getProducts(product.category as string)
    .filter((p) => p.id !== product.id && !p.isSoldOut)
    .sort((a, b) => (b.soldPercent || 0) - (a.soldPercent || 0));

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.imageUrl,
    url: `${SITE.url}/product/${product.id}`,
    offers: {
      "@type": "Offer",
      price: finalPrice,
      priceCurrency: "KRW",
      availability: product.isSoldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: product.affiliateUrl,
      seller: { "@type": "Organization", name: "쿠팡" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <SaveRecentlyViewed productId={product.id} title={product.title} category={product.category} />
      {/* 상단 네비 */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-500 hover:text-orange-500 transition-colors text-sm font-medium"
          >
            ← 다른 핫딜 보기
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* 상품 이미지 */}
        <div className="relative w-full aspect-[4/3] max-w-sm mx-auto rounded-2xl overflow-hidden bg-white shadow-sm mb-4">
          {product.imageUrl ? (
            <img
              src={product.imageUrl.replace(/\/\d+x\d+ex\//, '/492x492ex/')}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
              <span className="text-6xl">🛒</span>
            </div>
          )}
          {product.isSoldOut ? (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-[1]">
              <span className="text-white text-lg font-bold">한정수량 마감</span>
            </div>
          ) : discountPercent > 0 ? (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {discountPercent}% OFF
            </span>
          ) : null}
        </div>

        {/* 상품 정보 */}
        <div className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4 ${product.isSoldOut ? 'opacity-50 grayscale' : ''}`}>
          {/* 카테고리 + 배지 */}
          <div className="flex items-center gap-2 mb-2">
            {categoryInfo && (
              <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                {categoryInfo.emoji} {categoryInfo.name}
              </span>
            )}
            {product.isRocket && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                🚀 로켓배송
              </span>
            )}
            {product.isFreeShipping && (
              <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">
                무료배송
              </span>
            )}
          </div>

          {/* 상품명 */}
          <h1 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
            {product.title}
          </h1>

          {/* 태그 */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 별점/리뷰 */}
          {product.rating != null && product.rating > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-yellow-500 text-sm font-bold">⭐ {product.rating.toFixed(1)}</span>
              {product.reviewCount != null && product.reviewCount > 0 && (
                <span className="text-sm text-gray-500">({product.reviewCount.toLocaleString()}개 리뷰)</span>
              )}
            </div>
          )}

          {/* 가격 블록 — 카드 스타일 통일 */}
          <div className="mb-4">
            {basePrice > 0 && discountPercent > 0 && (
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(basePrice)}
                </span>
                <span className="text-sm font-bold text-red-500">
                  {discountPercent}%↓
                </span>
              </div>
            )}

            {(salePrice ?? price ?? 0) > 0 && !(isWow && (salePrice || price) === wowPrice) && (
              <span className="text-2xl font-bold text-orange-600">
                {formatPrice((salePrice || price)!)}
              </span>
            )}

            {isWow && wowPrice != null && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-2xl font-bold text-purple-600">
                  {wowPrice === 0 ? "무료" : formatPrice(wowPrice)}
                </span>
                <span className="text-xs text-white font-semibold bg-purple-500 px-1.5 py-0.5 rounded">
                  와우
                </span>
              </div>
            )}
          </div>

          {/* 카운트다운 */}
          {product.expiresAt && !product.isSoldOut && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-orange-50 rounded-xl">
              <CountdownTimer expiresAt={product.expiresAt} />
              <span className="text-sm text-gray-500">남음</span>
            </div>
          )}

          {/* 판매율 */}
          {(() => {
            const sp = getDisplaySoldPercent(product);
            return sp >= 0 ? <SoldBar soldPercent={sp} variant="detail" /> : null;
          })()}

          {/* CTA + 공유 + 찜 */}
          <div className="flex items-center gap-2 mt-4">
            <WishlistButton
              productId={product.id}
              title={product.title}
              imageUrl={product.imageUrl}
              price={finalPrice}
              discount={discountPercent}
              affiliateUrl={product.affiliateUrl}
              variant="detail"
            />
            <PurchaseButton
              productId={product.id}
              title={product.title}
              price={finalPrice}
              category={product.category}
              affiliateUrl={product.affiliateUrl}
            />
            <ShareButtons
              productId={product.id}
              title={product.title}
              discount={discountPercent}
            />
          </div>

          {/* 파트너스 고지 */}
          <p className="text-xs text-gray-500 text-center mt-4 bg-gray-100 rounded-lg px-3 py-2 leading-relaxed">
            💡 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
            수수료를 제공받습니다.
          </p>
        </div>

        {/* 추천 상품 */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {categoryInfo ? `${categoryInfo.emoji} 같은 카테고리 추천` : "🔥 다른 추천 상품"}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </div>
        )}

        {/* 메인 링크 */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            ← 전체 핫딜 보기
          </Link>
        </div>
      </main>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
