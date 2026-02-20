"use client";

import { useEffect } from "react";

const MAX_ITEMS = 20;
const STORAGE_KEY = "recentlyViewed";

export default function SaveRecentlyViewed({ productId }: { productId: string }) {
  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
      const filtered = stored.filter((id) => id !== productId);
      filtered.unshift(productId);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(filtered.slice(0, MAX_ITEMS))
      );
    } catch {}
  }, [productId]);

  return null;
}
