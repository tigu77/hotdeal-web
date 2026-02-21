"use client";

import { useEffect, useRef, useState } from "react";
import { trackBannerAction } from "@/lib/analytics";

export default function CoupangBanner() {
  const [visible, setVisible] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!bannerRef.current || initialized.current) return;
    initialized.current = true;

    // 스크립트를 배너 컨테이너 안에 직접 삽입
    const script1 = document.createElement("script");
    script1.src = "https://ads-partners.coupang.com/g.js";
    script1.async = true;
    script1.onload = () => {
      if ((window as any).PartnersCoupang) {
        const script2 = document.createElement("script");
        script2.textContent = `new PartnersCoupang.G({"id":965423,"template":"carousel","trackingCode":"AF6113349","width":"680","height":"100","tsource":""});`;
        bannerRef.current?.appendChild(script2);
      }

      // iframe 너비 100%로 강제
      setTimeout(() => {
        const iframes = bannerRef.current?.querySelectorAll("iframe");
        iframes?.forEach((iframe) => {
          iframe.style.width = "100%";
          iframe.style.maxWidth = "100%";
        });
      }, 1000);

      setTimeout(() => {
        const iframes = bannerRef.current?.querySelectorAll("iframe");
        iframes?.forEach((iframe) => {
          iframe.style.width = "100%";
          iframe.style.maxWidth = "100%";
        });
      }, 3000);
    };
    bannerRef.current.appendChild(script1);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid #e5e7eb",
        padding: "4px 0",
      }}
    >
      <button
        onClick={() => { trackBannerAction('close'); setVisible(false); }}
        style={{
          position: "absolute",
          top: 2,
          right: 8,
          background: "rgba(0,0,0,0.15)",
          border: "none",
          borderRadius: "50%",
          width: 22,
          height: 22,
          cursor: "pointer",
          fontSize: 12,
          lineHeight: "22px",
          textAlign: "center",
          color: "#666",
          zIndex: 10000,
        }}
        aria-label="배너 닫기"
      >
        ✕
      </button>
      <div
        ref={bannerRef}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}
      />
    </div>
  );
}
