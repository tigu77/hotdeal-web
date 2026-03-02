const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 20;

/** 최근 본 상품에 productId 저장 (맨 앞에 추가, 중복 제거) */
export function saveRecentlyViewed(productId: string): void {
  try {
    const stored: string[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    const filtered = stored.filter((id) => id !== productId);
    filtered.unshift(productId);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(filtered.slice(0, MAX_ITEMS))
    );
  } catch {}
}

/** 최근 본 상품 ID 목록 반환 */
export function getRecentlyViewed(): string[] {
  try {
    let stored: string[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    // 마이그레이션: 옛날 형식(객체 배열) → productId 배열
    if (stored.length > 0 && typeof stored[0] === "object") {
      stored = (stored as any[]).map((item: any) => item.productId).filter(Boolean);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    }
    return stored;
  } catch {
    return [];
  }
}

/** 유효한 ID만 남기고 정리 */
export function cleanRecentlyViewed(validIds: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validIds));
  } catch {}
}
