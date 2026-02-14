export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  affiliateUrl: string;
  category: string;
  tags: string[];
  isRocket?: boolean;
  isFreeShipping?: boolean;
  rating?: number;
  reviewCount?: number;
  postedAt: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  slug: string;
}

export const CATEGORIES: Category[] = [
  { id: "digital", name: "가전/디지털", emoji: "🖥️", slug: "digital" },
  { id: "living", name: "생활용품", emoji: "🏠", slug: "living" },
  { id: "food", name: "식품", emoji: "🍜", slug: "food" },
  { id: "baby", name: "육아용품", emoji: "👶", slug: "baby" },
  { id: "beauty", name: "뷰티", emoji: "💄", slug: "beauty" },
  { id: "fashion", name: "패션", emoji: "👕", slug: "fashion" },
  { id: "kitchen", name: "주방", emoji: "🍳", slug: "kitchen" },
  { id: "sports", name: "스포츠", emoji: "⚽", slug: "sports" },
  { id: "pet", name: "반려동물", emoji: "🐶", slug: "pet" },
];
