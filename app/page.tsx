"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import RecentlyViewed from "@/components/RecentlyViewed";
import { getProducts } from "@/data/products";
import { SITE } from "@/lib/constants";
import { trackCategoryFilter, trackSearch, trackSort } from "@/lib/analytics";
import { getWishlist } from "@/lib/wishlist";
import { formatPrice } from "@/lib/format";

type SortType = "latest" | "popular" | "ending" | "discount" | "price-low" | "price-high" | "rating" | "reviews";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("latest");
  const [wishlistMode, setWishlistMode] = useState(false);
  const [wishlistVersion, setWishlistVersion] = useState(0);

  // Listen for wishlist changes
  useEffect(() => {
    const handler = () => setWishlistVersion((v) => v + 1);
    window.addEventListener("wishlist-changed", handler);
    return () => window.removeEventListener("wishlist-changed", handler);
  }, []);

  // 카테고리 변경 시 스크롤 초기화
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory]);

  // Wishlist items — 진행 중인 것만 보여줌
  const wishlistItems = useMemo(() => {
    if (!wishlistMode) return [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _v = wishlistVersion; // trigger recalc
    const wl = getWishlist();
    const activeIds = new Set(getProducts().map((p) => p.id));
    return wl.filter((item) => activeIds.has(item.productId));
  }, [wishlistMode, wishlistVersion]);

  const products = useMemo(() => {
    if (wishlistMode) return []; // handled separately
    let items = getProducts(selectedCategory);

    // 검색 필터
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // 정렬
    switch (sortBy) {
      case "popular":
        items = [...items].sort((a, b) => (b.soldPercent || 0) - (a.soldPercent || 0));
        break;
      case "ending":
        items = [...items].sort((a, b) => {
          const aExp = a.expiresAt ? new Date(a.expiresAt).getTime() : Infinity;
          const bExp = b.expiresAt ? new Date(b.expiresAt).getTime() : Infinity;
          return aExp - bExp;
        });
        break;
      case "discount":
        items = [...items].sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case "price-low":
        items = [...items].sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        items = [...items].sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        items = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "reviews":
        items = [...items].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      // latest는 기본 (getProducts가 이미 최신순)
    }

    return items;
  }, [selectedCategory, searchQuery, sortBy, wishlistMode]);

  // 검색 트래킹 (디바운스 500ms)
  const searchTimer = useRef<NodeJS.Timeout>(null);
  useEffect(() => {
    if (!searchQuery.trim()) return;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      trackSearch(searchQuery.trim(), products.length);
    }, 500);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [searchQuery, products.length]);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery("");
          setWishlistMode(false);
          trackCategoryFilter(cat || "전체");
        }}
        wishlistMode={wishlistMode}
        onWishlistToggle={() => {
          setWishlistMode((prev) => !prev);
          if (!wishlistMode) setSelectedCategory(null);
        }}
      />

      {/* 파트너스 고지 */}
      <div className="bg-gray-100 border-b border-gray-200">
        <p className="max-w-6xl mx-auto px-4 py-2 text-xs text-gray-500 text-center">
          ℹ️ 이 사이트는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 히어로 + 검색 */}
        <section aria-label="검색" className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            오늘의 <span className="text-orange-500">핫딜</span> 🔥
          </h1>
          <p className="text-gray-500 mb-5">{SITE.description}</p>

          {/* 검색바 */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상품 검색..."
              className="w-full px-4 py-2.5 pl-10 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </section>

        {/* 정렬 + 결과 카운트 */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            {searchQuery ? `"${searchQuery}" 검색 결과 ` : ""}
            총 <strong className="text-gray-700">{products.length}</strong>개
          </span>

          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as SortType); trackSort(e.target.value); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:border-orange-400"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="ending">마감임박순</option>
            <option value="discount">할인율순</option>
            <option value="price-low">가격 낮은순</option>
            <option value="price-high">가격 높은순</option>
            <option value="rating">별점순</option>
            <option value="reviews">리뷰수순</option>
          </select>
        </div>

        {/* 최근 본 상품 */}
        <RecentlyViewed />

        {/* 상품 목록 */}
        {wishlistMode ? (
          wishlistItems.length > 0 ? (
            <section aria-label="찜한 상품" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {wishlistItems.map((item) => (
                <a
                  key={item.productId}
                  href={`/product/${item.productId}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative aspect-square bg-gray-50">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                        <span className="text-3xl">🛒</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <h3 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-orange-600">{formatPrice(item.price)}</span>
                      {item.discount != null && item.discount > 0 && (
                        <span className="text-[10px] font-bold text-red-500">{item.discount}%↓</span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </section>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">찜한 상품이 없어요</p>
              <p className="text-gray-300 mt-2">마음에 드는 상품의 ❤️ 를 눌러보세요!</p>
            </div>
          )
        ) : products.length > 0 ? (
          <section aria-label="상품 목록" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : (
          <EmptyState query={searchQuery} />
        )}

        {/* 텔레그램 CTA */}
        <aside className="mt-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">핫딜 놓치지 마세요!</h3>
          <p className="text-orange-100 mb-6">
            텔레그램에서 실시간 최저가 알림을 받아보세요
          </p>
          <a
            href={SITE.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors"
          >
            📢 텔레그램 구독하기
          </a>
        </aside>
      </main>

      <Footer />
    </div>
  );
}

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="text-center py-20">
      <p className="text-gray-400 text-lg">
        {query
          ? `"${query}"에 대한 검색 결과가 없어요`
          : "해당 카테고리의 핫딜이 아직 없어요"}
      </p>
      <p className="text-gray-300 mt-2">곧 업데이트됩니다! 🔥</p>
    </div>
  );
}
