"use client";

export default function SoldBar({ soldPercent }: { soldPercent: number }) {
  const isAlmostGone = soldPercent >= 80;

  return (
    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            soldPercent >= 80
              ? "bg-red-500"
              : soldPercent >= 50
                ? "bg-orange-400"
                : "bg-blue-400"
          }`}
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
