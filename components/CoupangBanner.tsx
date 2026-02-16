"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function CoupangBanner() {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (loaded && typeof window !== "undefined" && (window as any).PartnersCoupang) {
      new (window as any).PartnersCoupang.G({
        id: 965423,
        template: "carousel",
        trackingCode: "AF6113349",
        width: "680",
        height: "100",
        tsource: "",
      });
    }
  }, [loaded]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-white/95 backdrop-blur-sm border-t border-gray-200 py-1">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-1 right-2 text-gray-400 hover:text-gray-600 text-lg font-bold z-10"
        aria-label="배너 닫기"
      >
        ✕
      </button>
      <Script
        src="https://ads-partners.coupang.com/g.js"
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
