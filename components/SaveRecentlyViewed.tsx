"use client";

import { useEffect } from "react";
import { trackDetailView } from "@/lib/analytics";
import { saveRecentlyViewed } from "@/lib/recently-viewed";

export default function SaveRecentlyViewed({ productId, title, category }: { productId: string; title?: string; category?: string }) {
  useEffect(() => {
    if (title) trackDetailView(productId, title, category);
    saveRecentlyViewed(productId);
  }, [productId]);

  return null;
}
