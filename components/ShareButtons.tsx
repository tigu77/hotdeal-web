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

  const handleCopy = async () => {
    const url = `${baseUrl}?utm_source=copy&utm_medium=share`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitter = () => {
    const url = `${baseUrl}?utm_source=twitter&utm_medium=share`;
    const text = discount
      ? `${title} ${discount}%OFF`
      : title;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        onClick={handleCopy}
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors"
      >
        📋 {copied ? "복사됨!" : "링크복사"}
      </button>
      <button
        onClick={handleTwitter}
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors"
      >
        𝕏 공유
      </button>
      <button
        disabled
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 text-zinc-500 text-xs font-medium rounded-lg cursor-not-allowed"
      >
        💬 카카오톡
      </button>
    </div>
  );
}
