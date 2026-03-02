"use client";

import { useState } from "react";
import { trackSiteShare } from "@/lib/analytics";

interface SiteShareButtonProps {
  title?: string;
  url?: string;
  utm?: string;
  className?: string;
}

export default function SiteShareButton({
  title = "핫딜 알리미 - 쿠팡 골드박스 핫딜 모음",
  url,
  utm = "?utm_source=share&utm_medium=webshare",
  className = "",
}: SiteShareButtonProps) {
  const [copied, setCopied] = useState(false);

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
    const base = url || (typeof window !== "undefined" ? window.location.origin : "");
    const shareUrl = `${base}${utm}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        trackSiteShare('native_share');
        return;
      } catch {
        // user cancelled
      }
    }
    await copyToClipboard(shareUrl);
    trackSiteShare('copy_link');
  };

  return (
    <button
      onClick={handleShare}
      className={`relative flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${className}`}
      aria-label="사이트 공유하기"
      title="공유하기"
    >
      {copied ? (
        <span className="text-[10px] font-medium text-green-600 whitespace-nowrap">복사됨!</span>
      ) : (
        <span className="text-lg">📤</span>
      )}
    </button>
  );
}
