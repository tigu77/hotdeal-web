import type { CategoryId } from "@/lib/constants";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  affiliateUrl: string;
  category: CategoryId | string;
  tags: string[];
  isWow?: boolean;          // 와우 회원가 여부
  isRocket?: boolean;
  isFreeShipping?: boolean;
  rating?: number;
  reviewCount?: number;
  postedAt: string;
}
