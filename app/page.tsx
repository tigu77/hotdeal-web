"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import CoupangBanner from "@/components/CoupangBanner";
import { getProducts } from "@/data/products";
import { SITE } from "@/lib/constants";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const products = getProducts(selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 히어로 */}
        <section className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            오늘의 <span className="text-orange-500">핫딜</span> 🔥
          </h2>
          <p className="text-gray-500">{SITE.description}</p>
        </section>

        {/* 쿠팡 다이나믹 배너 */}
        <CoupangBanner />

        {/* 상품 목록 */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {/* 텔레그램 CTA */}
        <section className="mt-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-center text-white">
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
        </section>
      </main>

      <Footer />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-gray-400 text-lg">해당 카테고리의 핫딜이 아직 없어요</p>
      <p className="text-gray-300 mt-2">곧 업데이트됩니다! 🔥</p>
    </div>
  );
}
