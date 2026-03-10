import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">🔥</span>
          <span className="font-bold text-gray-700">{SITE.name}</span>
        </div>

        <p className="text-sm text-gray-500">{SITE.description}</p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href={SITE.kakao}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-yellow-600 transition-colors"
          >
            <img src="/icons/kakao.svg" alt="카카오톡" className="w-5 h-5" />
            카카오톡 오픈채팅
          </a>
          <a
            href={SITE.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-sky-500 transition-colors"
          >
            <img src="/icons/telegram.svg" alt="텔레그램" className="w-5 h-5" />
            텔레그램 채널
          </a>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <p className="text-xs text-gray-500">
            ℹ️ 이 사이트는 쿠팡 파트너스 및 네이버 쇼핑 커넥트 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
