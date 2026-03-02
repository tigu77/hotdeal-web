"use client";

/**
 * 판매율 바 — 다양한 크기를 지원하는 공통 컴포넌트
 * variant="detail" : 상품 상세 페이지용 (큰 사이즈)
 * variant="card"   : ProductCard/RecentlyViewed 카드용 (작은 사이즈)
 * variant="mini"   : RecentlyViewed 미니 카드용 (가장 작은 사이즈)
 */

interface SoldBarProps {
  soldPercent: number;
  variant?: "detail" | "card" | "mini";
}

export default function SoldBar({ soldPercent, variant = "card" }: SoldBarProps) {
  const isAlmostGone = soldPercent >= 80;

  const barColor =
    soldPercent >= 80
      ? "bg-red-500"
      : soldPercent >= 50
        ? "bg-orange-400"
        : "bg-blue-400";

  if (variant === "detail") {
    return (
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${Math.min(soldPercent, 100)}%` }}
          />
        </div>
        <span
          className={`text-sm font-bold whitespace-nowrap ${
            isAlmostGone ? "text-red-500" : "text-gray-600"
          }`}
        >
          {soldPercent}% 판매
          {isAlmostGone && " 🔥"}
        </span>
      </div>
    );
  }

  if (variant === "mini") {
    return (
      <div className="flex items-center gap-1 mt-0.5">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{ width: `${Math.min(soldPercent, 100)}%` }}
          />
        </div>
        <span className={`text-[9px] font-bold whitespace-nowrap ${
          isAlmostGone ? 'text-red-500' : 'text-gray-500'
        }`}>
          {soldPercent}%
        </span>
      </div>
    );
  }

  // variant === "card" (default)
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 bg-gray-100 rounded-full overflow-hidden h-2 max-w-[80px]">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.min(soldPercent, 100)}%` }}
        />
      </div>
      <span className={`text-[11px] font-bold ${isAlmostGone ? "text-red-500" : "text-gray-500"}`}>
        {soldPercent}% 판매
      </span>
    </div>
  );
}
