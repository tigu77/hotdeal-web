/** 사이트 전역 설정 */
export const SITE = {
  name: "핫딜 알리미",
  description: "매일 엄선된 최저가 상품을 추천합니다.",
  url: "https://hotdeal-web-peach.vercel.app",
  telegram: "https://t.me/hotdeal_alimi",
  coupangPartnersId: "AF6113349",
} as const;

/** 카테고리 정의 */
export const CATEGORIES = [
  { id: "digital", name: "가전/디지털", emoji: "🖥️" },
  { id: "living", name: "생활용품", emoji: "🏠" },
  { id: "food", name: "식품", emoji: "🍜" },
  { id: "health", name: "건강", emoji: "💊" },
  { id: "baby", name: "육아용품", emoji: "👶" },
  { id: "beauty", name: "뷰티", emoji: "💄" },
  { id: "fashion", name: "패션", emoji: "👕" },
  { id: "kitchen", name: "주방", emoji: "🍳" },
  { id: "sports", name: "스포츠", emoji: "⚽" },
  { id: "pet", name: "반려동물", emoji: "🐶" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

/** 소스 필터 정의 */
export const SOURCES = [
  { id: "coupang", name: "쿠팡", color: "bg-red-500", textColor: "text-red-600", borderColor: "border-red-400" },
  { id: "naver", name: "네이버", color: "bg-green-500", textColor: "text-green-600", borderColor: "border-green-400" },
] as const;

export type SourceId = (typeof SOURCES)[number]["id"];
