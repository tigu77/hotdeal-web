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
        // user cancelled or error — fall through to copy
      }
    }
    // fallback: copy link
    await copyToClipboard(url);
  };

  const handleCopy = async () => {
    const url = `${baseUrl}?utm_source=copy&utm_medium=share`;
    await copyToClipboard(url);
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        onClick={handleShare}
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors"
      >
        📤 공유하기
      </button>
      <button
        onClick={handleCopy}
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors"
      >
        📋 {copied ? "복사됨!" : "링크복사"}
      </button>
    </div>
  );
}
