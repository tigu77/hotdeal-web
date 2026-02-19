"use client";

import { useState, useEffect } from "react";
import { isInWishlist, toggleWishlist } from "@/lib/wishlist";

interface WishlistButtonProps {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  discount?: number;
  affiliateUrl: string;
  /** "card" = small overlay on card, "detail" = larger button for detail page */
  variant?: "card" | "detail";
}

export default function WishlistButton({
  productId,
  title,
  imageUrl,
  price,
  discount,
  affiliateUrl,
  variant = "card",
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setWishlisted(isInWishlist(productId));
    const handler = () => setWishlisted(isInWishlist(productId));
    window.addEventListener("wishlist-changed", handler);
    return () => window.removeEventListener("wishlist-changed", handler);
  }, [productId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ productId, title, imageUrl, price, discount, affiliateUrl });
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  };

  if (variant === "detail") {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all duration-200 ${
          wishlisted
            ? "bg-red-50 border-red-200 text-red-500"
            : "bg-gray-50 border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200"
        } ${animate ? "scale-125" : "scale-100"}`}
        aria-label={wishlisted ? "찜 해제" : "찜하기"}
      >
        <span className="text-xl">{wishlisted ? "❤️" : "🤍"}</span>
      </button>
    );
  }

  // card variant
  return (
    <button
      onClick={handleClick}
      className={`absolute top-1 right-1 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 ${
        animate ? "scale-125" : "scale-100"
      } hover:bg-white`}
      aria-label={wishlisted ? "찜 해제" : "찜하기"}
    >
      <span className="text-sm">{wishlisted ? "❤️" : "🤍"}</span>
    </button>
  );
}
