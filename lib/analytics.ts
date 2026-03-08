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
export function trackProductClick(productId: string, title: string, category?: string, source?: string) {
  trackEvent('select_item', {
    item_list_name: 'hotdeal_list',
    items: [{ item_id: productId, item_name: title, item_category: category }],
    source: source || 'unknown',
  });
}

// 구매 버튼 클릭
export function trackPurchaseClick(productId: string, title: string, price: number, category?: string, source?: string) {
  trackEvent('purchase_click', {
    item_id: productId,
    item_name: title,
    item_category: category,
    value: price,
    currency: 'KRW',
    source: source || 'unknown',
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
export function trackRecommendClick(productId: string, title: string, source?: string) {
  trackEvent('recommend_click', {
    item_id: productId,
    item_name: title,
    source: source || 'unknown',
  });
}

// 상세 페이지 조회
export function trackDetailView(productId: string, title: string, category?: string, source?: string) {
  trackEvent('view_item', {
    item_id: productId,
    item_name: title,
    item_category: category,
    source: source || 'unknown',
  });
}

// 공유 버튼 클릭
export function trackShareClick(productId: string, method: string, source?: string) {
  trackEvent('share', {
    item_id: productId,
    method,
    source: source || 'unknown',
  });
}

// 찜 추가/제거
export function trackWishlistToggle(productId: string, action: 'add' | 'remove', source?: string) {
  trackEvent('wishlist_toggle', {
    item_id: productId,
    action,
    source: source || 'unknown',
  });
}

// 찜 탭 전환
export function trackWishlistTab(enabled: boolean) {
  trackEvent('wishlist_tab', {
    action: enabled ? 'open' : 'close',
  });
}

// 최근 본 상품 클릭
export function trackRecentlyViewedClick(productId: string, title: string, source?: string) {
  trackEvent('recently_viewed_click', {
    item_id: productId,
    item_name: title,
    source: source || 'unknown',
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

// 소스 필터 변경
export function trackSourceFilter(source: string) {
  trackEvent('source_filter', { source: source || '전체' });
}

// 채널 유입 추적
export function trackChannelVisit(source: string, medium: string, campaign: string) {
  trackEvent('channel_visit', { source, medium, campaign });
}

// 스크롤 깊이 (25/50/75/100%)
const scrolledDepths = new Set<number>();
export function trackScrollDepth(percent: number) {
  if (scrolledDepths.has(percent)) return;
  scrolledDepths.add(percent);
  trackEvent('scroll', { percent_scrolled: percent });
}

// 체류 시간 (10/30/60초)
const engagementFired = new Set<number>();
export function trackPageEngagement(sec: number) {
  if (engagementFired.has(sec)) return;
  engagementFired.add(sec);
  trackEvent('page_engagement', { engagement_time_sec: sec });
}

// 이미지 클릭
export function trackImageClick(productId: string, title: string) {
  trackEvent('image_click', { item_id: productId, item_name: title });
}

// 카운트다운 만료
const countdownExpiredIds = new Set<string>();
export function trackCountdownExpire(productId: string, title: string) {
  if (countdownExpiredIds.has(productId)) return;
  countdownExpiredIds.add(productId);
  trackEvent('countdown_expire', { item_id: productId, item_name: title });
}

// 품절 상품 노출
const soldOutViewedIds = new Set<string>();
export function trackSoldOutView(productId: string, title: string) {
  if (soldOutViewedIds.has(productId)) return;
  soldOutViewedIds.add(productId);
  trackEvent('sold_out_view', { item_id: productId, item_name: title });
}

// 빈 찜 탭 노출
let wishlistEmptyFired = false;
export function trackWishlistEmptyView() {
  if (wishlistEmptyFired) return;
  wishlistEmptyFired = true;
  trackEvent('wishlist_empty_view');
}

// 외부 링크 클릭 (쿠팡/네이버)
export function trackExternalLinkClick(productId: string, destination: 'coupang' | 'naver', url: string) {
  trackEvent('external_link_click', { item_id: productId, destination, url });
}
