"use client";

import { useState } from "react";
import { CATEGORIES } from "@/types";

interface HeaderProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function Header({ selectedCategory, onCategoryChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* 로고 & 텔레그램 */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <h1 className="text-xl font-bold text-gray-900">
              핫딜 <span className="text-orange-500">알리미</span>
            </h1>
          </div>
          <a
            href="https://t.me/hotdeal_alimi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-sky-600 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.484-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.12.098.153.228.168.332.016.104.036.317.02.489z" />
            </svg>
            텔레그램 구독
          </a>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-1 pb-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => onCategoryChange(null)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            🔥 전체
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
