"use client";

import { CATEGORIES, SITE } from "@/lib/constants";

interface HeaderProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function Header({
  selectedCategory,
  onCategoryChange,
}: HeaderProps) {
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
            href={SITE.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-sky-600 transition-colors"
          >
            📢 텔레그램 구독
          </a>
        </div>

        {/* 카테고리 필터 */}
        <nav className="flex gap-1 pb-3 overflow-x-auto scrollbar-hide">
          <CategoryTab
            label="🔥 전체"
            active={selectedCategory === null}
            onClick={() => onCategoryChange(null)}
          />
          {CATEGORIES.map((cat) => (
            <CategoryTab
              key={cat.id}
              label={`${cat.emoji} ${cat.name}`}
              active={selectedCategory === cat.id}
              onClick={() => onCategoryChange(cat.id)}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}

/** 카테고리 탭 버튼 */
function CategoryTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-orange-500 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}
