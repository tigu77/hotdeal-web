"use client";

import { useEffect } from "react";

interface RecentItem {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  discount?: number;
  affiliateUrl: string;
  timestamp: number;
}

const MAX_ITEMS = 20;
const STORAGE_KEY = "recentlyViewed";

export default function SaveRecentlyViewed({
  productId,
  title,
  imageUrl,
  price,
  discount,
  affiliateUrl,
}: Omit<RecentItem, "timestamp">) {
  useEffect(() => {
    try {
      const stored: RecentItem[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
      const filtered = stored.filter((item) => item.productId !== productId);
      filtered.unshift({ productId, title, imageUrl, price, discount, affiliateUrl, timestamp: Date.now() });
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(filtered.slice(0, MAX_ITEMS))
      );
    } catch {}
  }, [productId, title, imageUrl, price, discount, affiliateUrl]);

  return null;
}
