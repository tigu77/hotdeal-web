export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="font-bold text-gray-700">핫딜 알리미</span>
          </div>
          <p className="text-sm text-gray-500">
            매일 엄선된 최저가 상품을 추천합니다
          </p>
          <a
            href="https://t.me/hotdeal_alimi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sky-500 text-sm hover:text-sky-600"
          >
            📢 텔레그램에서 실시간 알림 받기
          </a>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              © 2026 핫딜 알리미. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
