"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { getProducts } from "@/data/products";
import { SITE } from "@/lib/constants";

type SortType = "latest" | "popular" | "ending" | "discount" | "price-low" | "price-high";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("latest");

  const products = useMemo(() => {
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
      // latest는 기본 (getProducts가 이미 최신순)
    }

    return items;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery("");
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
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:border-orange-400"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="ending">마감임박순</option>
            <option value="discount">할인율순</option>
            <option value="price-low">가격 낮은순</option>
            <option value="price-high">가격 높은순</option>
          </select>
        </div>

        {/* 상품 목록 */}
        {products.length > 0 ? (
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
