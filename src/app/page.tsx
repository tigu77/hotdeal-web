"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 히어로 */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            오늘의 <span className="text-orange-500">핫딜</span> 🔥
          </h2>
          <p className="text-gray-500">
            매일 엄선된 최저가 상품을 추천합니다
          </p>
        </div>

        {/* 상품 그리드 */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">해당 카테고리의 핫딜이 아직 없어요</p>
            <p className="text-gray-300 mt-2">곧 업데이트됩니다! 🔥</p>
          </div>
        )}

        {/* 텔레그램 CTA */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">핫딜 놓치지 마세요!</h3>
          <p className="text-orange-100 mb-6">
            텔레그램에서 실시간 최저가 알림을 받아보세요
          </p>
          <a
            href="https://t.me/hotdeal_alimi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors"
          >
            📢 텔레그램 구독하기
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
