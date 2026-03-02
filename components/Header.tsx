"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { CATEGORIES, SITE, SOURCES } from "@/lib/constants";
import SiteShareButton from "./SiteShareButton";

interface HeaderProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedSource: string | null;
  onSourceChange: (source: string | null) => void;
  wishlistMode?: boolean;
  onWishlistToggle?: () => void;
  availableSources?: string[];
}

export default function Header({
  selectedCategory,
  onCategoryChange,
  selectedSource,
  onSourceChange,
  wishlistMode,
  onWishlistToggle,
  availableSources,
}: HeaderProps) {
  const navRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scrollNav = (dir: "left" | "right") => {
    navRef.current?.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* 로고 & 텔레그램 */}
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 no-underline">
            <span className="text-2xl">🔥</span>
            <h1 className="text-xl font-bold text-gray-900">
              핫딜 <span className="text-orange-500">알리미</span>
            </h1>
          </a>

          <div className="flex items-center gap-1">
            <SiteShareButton />
            <a
              href={SITE.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-sky-600 transition-colors"
            >
              📢 텔레그램 구독
            </a>
          </div>
        </div>

        {/* 소스 필터 */}
        <div className="flex items-center gap-2 pb-2">
          <button
            onClick={() => onSourceChange(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedSource === null
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
            }`}
          >
            전체
          </button>
          {SOURCES.filter((s) => !availableSources || availableSources.includes(s.id)).map((s) => (
            <button
              key={s.id}
              onClick={() => onSourceChange(selectedSource === s.id ? null : s.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                selectedSource === s.id
                  ? `${s.color} text-white shadow-sm`
                  : `bg-white ${s.textColor} border ${s.borderColor} hover:opacity-80`
              }`}
            >
              <img src={s.icon} alt={s.name} className="w-3 h-3" />
              {s.name}
            </button>
          ))}
        </div>

        {/* 카테고리 필터 (스크롤 힌트 포함) */}
        <div className="relative">
          {/* 왼쪽 그라데이션 + 화살표 */}
          {canScrollLeft && (
            <button
              onClick={() => scrollNav("left")}
              className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-0.5 pr-3 bg-gradient-to-r from-white/95 via-white/70 to-transparent pointer-events-auto"
              aria-label="왼쪽으로 스크롤"
            >
              <span className="text-gray-400 text-sm font-bold">‹</span>
            </button>
          )}

          <nav
            ref={navRef}
            className="flex gap-1 pb-3 overflow-x-auto scrollbar-hide"
          >
            <CategoryTab
              label="🔥 전체"
              active={!wishlistMode && selectedCategory === null}
              onClick={() => onCategoryChange(null)}
            />
            {onWishlistToggle && (
              <CategoryTab
                label="❤️ 찜"
                active={!!wishlistMode}
                onClick={onWishlistToggle}
              />
            )}
            {CATEGORIES.map((cat) => (
              <CategoryTab
                key={cat.id}
                label={`${cat.emoji} ${cat.name}`}
                active={!wishlistMode && selectedCategory === cat.id}
                onClick={() => onCategoryChange(cat.id)}
              />
            ))}
          </nav>

          {/* 오른쪽 그라데이션 + 화살표 */}
          {canScrollRight && (
            <button
              onClick={() => scrollNav("right")}
              className="absolute right-0 top-0 bottom-0 z-10 flex items-center pr-0.5 pl-3 bg-gradient-to-l from-white/95 via-white/70 to-transparent pointer-events-auto"
              aria-label="오른쪽으로 스크롤"
            >
              <span className="text-gray-400 text-sm font-bold">›</span>
            </button>
          )}
        </div>
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
