"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

export default function CoupangBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
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
    <div
      ref={containerRef}
      className="w-full flex justify-center my-6 overflow-hidden rounded-xl"
    >
      <Script
        src="https://ads-partners.coupang.com/g.js"
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
