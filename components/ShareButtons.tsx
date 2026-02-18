"use client";

import { useState } from "react";

interface ShareButtonsProps {
  productId: string;
  title: string;
  discount?: number;
}

export default function ShareButtons({ productId, title, discount }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined"
    ? `${window.location.origin}/product/${productId}`
    : `/product/${productId}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = `${baseUrl}?utm_source=share&utm_medium=webshare`;
    const text = discount
      ? `${title} ${discount}%OFF 핫딜!`
      : `${title} 핫딜!`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }
    // fallback: copy link
    await copyToClipboard(url);
  };

  return (
    <button
      onClick={handleShare}
      className="relative flex-shrink-0 flex items-center justify-center w-14 h-14 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-colors"
      aria-label="공유하기"
    >
      {copied ? (
        <span className="text-xs font-medium text-green-600">복사됨!</span>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )}
    </button>
  );
}
