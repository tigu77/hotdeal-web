"use client";

import { useEffect } from "react";

interface RecentItem {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  salePrice?: number;
  wowPrice?: number;
  originalPrice?: number;
  discount?: number;
  isWow?: boolean;
  isRocket?: boolean;
  affiliateUrl: string;
  soldPercent?: number;
  expiresAt?: string;
  rating?: number;
  reviewCount?: number;
  timestamp: number;
}

const MAX_ITEMS = 20;
const STORAGE_KEY = "recentlyViewed";

export default function SaveRecentlyViewed({
  productId,
  title,
  imageUrl,
  price,
  salePrice,
  wowPrice,
  originalPrice,
  discount,
  isWow,
  isRocket,
  affiliateUrl,
  soldPercent,
  expiresAt,
  rating,
  reviewCount,
}: Omit<RecentItem, "timestamp">) {
  useEffect(() => {
    try {
      const stored: RecentItem[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
      const filtered = stored.filter((item) => item.productId !== productId);
      filtered.unshift({
        productId, title, imageUrl, price,
        salePrice, wowPrice, originalPrice, discount,
        isWow, isRocket, affiliateUrl, soldPercent, expiresAt, rating, reviewCount,
        timestamp: Date.now(),
      });
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(filtered.slice(0, MAX_ITEMS))
      );
    } catch {}
  }, [productId, title, imageUrl, price, salePrice, wowPrice, originalPrice, discount, isWow, isRocket, affiliateUrl, soldPercent, expiresAt, rating, reviewCount]);

  return null;
}
