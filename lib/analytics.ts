// Google Analytics 이벤트 트래킹

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function trackEvent(action: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
}

// 상품 카드 클릭
export function trackProductClick(productId: string, title: string, category?: string) {
  trackEvent('select_item', {
    item_list_name: 'hotdeal_list',
    items: [{ item_id: productId, item_name: title, item_category: category }],
  });
}

// 구매 버튼 클릭
export function trackPurchaseClick(productId: string, title: string, price: number, category?: string) {
  trackEvent('purchase_click', {
    item_id: productId,
    item_name: title,
    item_category: category,
    value: price,
    currency: 'KRW',
  });
}

// 카테고리 필터
export function trackCategoryFilter(category: string) {
  trackEvent('category_filter', { category });
}

// 검색
export function trackSearch(query: string, resultCount: number) {
  trackEvent('search', { search_term: query, result_count: resultCount });
}

// 정렬 변경
export function trackSort(sortBy: string) {
  trackEvent('sort_change', { sort_by: sortBy });
}

// 텔레그램 구독 클릭
export function trackTelegramClick(location: string) {
  trackEvent('telegram_subscribe', { location });
}

// 추천 상품 클릭
export function trackRecommendClick(productId: string, title: string) {
  trackEvent('recommend_click', {
    item_id: productId,
    item_name: title,
  });
}
