"use client";

import { useEffect } from "react";
import { trackDetailView } from "@/lib/analytics";

const MAX_ITEMS = 20;
const STORAGE_KEY = "recentlyViewed";

export default function SaveRecentlyViewed({ productId, title, category }: { productId: string; title?: string; category?: string }) {
  useEffect(() => {
    if (title) trackDetailView(productId, title, category);
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
