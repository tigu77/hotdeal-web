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

// 상세 페이지 조회
export function trackDetailView(productId: string, title: string, category?: string) {
  trackEvent('view_item', {
    item_id: productId,
    item_name: title,
    item_category: category,
  });
}

// 공유 버튼 클릭
export function trackShareClick(productId: string, method: string) {
  trackEvent('share', {
    item_id: productId,
    method,
  });
}

// 찜 추가/제거
export function trackWishlistToggle(productId: string, action: 'add' | 'remove') {
  trackEvent('wishlist_toggle', {
    item_id: productId,
    action,
  });
}

// 찜 탭 전환
export function trackWishlistTab(enabled: boolean) {
  trackEvent('wishlist_tab', {
    action: enabled ? 'open' : 'close',
  });
}

// 최근 본 상품 클릭
export function trackRecentlyViewedClick(productId: string, title: string) {
  trackEvent('recently_viewed_click', {
    item_id: productId,
    item_name: title,
  });
}

// 배너 클릭/닫기
export function trackBannerAction(action: 'close') {
  trackEvent('banner_action', { action });
}

// 사이트 공유
export function trackSiteShare(method: string) {
  trackEvent('site_share', { method });
}

// 채널 유입 추적
export function trackChannelVisit(source: string, medium: string, campaign: string) {
  trackEvent('channel_visit', { source, medium, campaign });
}
