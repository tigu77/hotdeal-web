"use client";

import { useState, useEffect } from "react";

export function useCountdown(expiresAt?: string) {
  const [remaining, setRemaining] = useState("");
  const [expired, setExpired] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setRemaining("종료");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setIsUrgent(diff < 3600000);
      setRemaining(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return { remaining, expired, isUrgent };
}

export default function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const { remaining, expired, isUrgent } = useCountdown(expiresAt);

  if (expired) return <span className="text-red-500 font-bold">종료됨</span>;

  return (
    <span
      className={`text-2xl font-bold tabular-nums tracking-tight ${
        isUrgent ? "text-red-600 animate-pulse" : "text-orange-500"
      }`}
    >
      ⏰ {remaining}
    </span>
  );
}
