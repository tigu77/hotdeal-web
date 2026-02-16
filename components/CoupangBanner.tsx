"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function CoupangBanner() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded && typeof window !== "undefined" && (window as any).PartnersCoupang) {
      new (window as any).PartnersCoupang.G({
        id: 965423,
        template: "carousel",
        trackingCode: "AF6113349",
        width: "680",
        height: "140",
        tsource: "",
      });
    }
  }, [loaded]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-white/95 backdrop-blur-sm border-t border-gray-200 py-2">
      <Script
        src="https://ads-partners.coupang.com/g.js"
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
