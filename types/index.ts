import type { CategoryId } from "@/lib/constants";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;            // 최종 표시가 (와우가 있으면 와우가, 없으면 판매가)
  salePrice?: number;       // 쿠팡판매가
  wowPrice?: number;        // 와우할인가
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
