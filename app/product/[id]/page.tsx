import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { SITE, CATEGORIES } from "@/lib/constants";
import CountdownTimer from "@/components/CountdownTimer";
import SoldBar from "./SoldBar";

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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE.url}/product/${product.id}`,
      siteName: SITE.name,
      images: product.imageUrl ? [{ url: product.imageUrl, width: 492, height: 492 }] : [],
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

  const { originalPrice, salePrice, wowPrice, price, isWow, discount } = product;
  const basePrice = originalPrice || 0;
  const finalPrice = isWow && wowPrice != null ? wowPrice : salePrice || price;
  const discountPercent =
    basePrice > 0 && finalPrice < basePrice
      ? Math.round(((basePrice - finalPrice) / basePrice) * 100)
      : discount || 0;

  const categoryInfo = CATEGORIES.find((c) => c.id === product.category);
  const relatedProducts = getProducts(product.category as string)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

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
      availability: "https://schema.org/InStock",
      url: product.affiliateUrl,
      seller: { "@type": "Organization", name: "쿠팡" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
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
        <div className="relative w-full aspect-square max-w-md mx-auto rounded-2xl overflow-hidden bg-white shadow-sm mb-6">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
              <span className="text-6xl">🛒</span>
            </div>
          )}
          {discountPercent > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
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
          <h1 className="text-xl font-bold text-gray-900 mb-4 leading-snug">
            {product.title}
          </h1>

          {/* 가격 */}
          <div className="space-y-1 mb-4">
            {basePrice > 0 && discountPercent > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">원가</span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(basePrice)}
                </span>
              </div>
            )}
            {(salePrice ?? price ?? 0) > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">판매가</span>
                <span className={`text-xl font-bold ${isWow && wowPrice != null ? "text-gray-500" : "text-orange-600"}`}>
                  {formatPrice((salePrice || price)!)}
                </span>
              </div>
            )}
            {isWow && wowPrice != null && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-500">와우할인가</span>
                <span className="text-2xl font-bold text-purple-600">
                  {wowPrice === 0 ? "무료" : formatPrice(wowPrice)}
                </span>
                <span className="text-xs text-white font-semibold bg-purple-500 px-2 py-0.5 rounded">
                  와우
                </span>
              </div>
            )}
          </div>

          {/* 카운트다운 */}
          {product.expiresAt && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-orange-50 rounded-xl">
              <CountdownTimer expiresAt={product.expiresAt} />
              <span className="text-sm text-gray-500">남음</span>
            </div>
          )}

          {/* 판매율 */}
          {product.soldPercent != null && product.soldPercent > 0 && (
            <SoldBar soldPercent={product.soldPercent} />
          )}

          {/* CTA */}
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl text-lg transition-colors mt-4"
          >
            🛒 쿠팡에서 구매하기
          </a>

          {/* 파트너스 고지 */}
          <p className="text-[11px] text-gray-400 text-center mt-3 leading-relaxed">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
            수수료를 제공받습니다.
          </p>
        </div>

        {/* 추천 상품 */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {categoryInfo ? `${categoryInfo.emoji} 같은 카테고리 추천` : "🔥 다른 추천 상품"}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.map((p) => {
                const pFinal = p.isWow && p.wowPrice != null ? p.wowPrice : p.salePrice || p.price;
                return (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
                      {p.title}
                    </h3>
                    <span className="text-sm font-bold text-orange-600">
                      {formatPrice(pFinal)}
                    </span>
                    {p.discount && p.discount > 0 && (
                      <span className="text-xs text-red-500 font-bold ml-1">
                        {p.discount}%↓
                      </span>
                    )}
                  </Link>
                );
              })}
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
