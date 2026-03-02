"use client";

import { useEffect } from "react";
import { trackDetailView } from "@/lib/analytics";
import { saveRecentlyViewed } from "@/lib/recently-viewed";

export default function SaveRecentlyViewed({ productId, title, category, source }: { productId: string; title?: string; category?: string; source?: string }) {
  useEffect(() => {
    if (title) trackDetailView(productId, title, category, source);
    saveRecentlyViewed(productId);
  }, [productId]);

  return null;
}
