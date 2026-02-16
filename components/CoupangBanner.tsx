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

  // iframe 너비를 100%로 강제
  useEffect(() => {
    if (!loaded) return;
    const timer = setInterval(() => {
      const iframes = document.querySelectorAll('iframe[title*="Coupang"]');
      iframes.forEach((iframe) => {
        (iframe as HTMLIFrameElement).style.width = "100%";
        (iframe as HTMLIFrameElement).style.maxWidth = "100%";
      });
      if (iframes.length > 0) clearInterval(timer);
    }, 500);
    return () => clearInterval(timer);
  }, [loaded]);

  if (!visible) return null;

  return (
    <>
      <Script
        src="https://ads-partners.coupang.com/g.js"
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid #e5e7eb",
          padding: "4px 0",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => setVisible(false)}
          style={{
            position: "absolute",
            top: 2,
            right: 8,
            background: "rgba(0,0,0,0.1)",
            border: "none",
            borderRadius: "50%",
            width: 24,
            height: 24,
            cursor: "pointer",
            fontSize: 14,
            lineHeight: "24px",
            textAlign: "center",
            color: "#666",
            zIndex: 10000,
          }}
          aria-label="배너 닫기"
        >
          ✕
        </button>
      </div>
    </>
  );
}
