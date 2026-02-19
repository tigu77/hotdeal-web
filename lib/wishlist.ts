export interface WishlistItem {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  discount?: number;
  affiliateUrl: string;
  timestamp: number;
}

const STORAGE_KEY = "wishlist";
const MAX_ITEMS = 50;

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().some((item) => item.productId === productId);
}

export function toggleWishlist(item: Omit<WishlistItem, "timestamp">): boolean {
  const list = getWishlist();
  const idx = list.findIndex((i) => i.productId === item.productId);

  if (idx >= 0) {
    list.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("wishlist-changed"));
    return false; // removed
  } else {
    const newItem: WishlistItem = { ...item, timestamp: Date.now() };
    list.unshift(newItem);
    if (list.length > MAX_ITEMS) list.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("wishlist-changed"));
    return true; // added
  }
}
