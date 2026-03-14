import type { SourceAdapter, WebProduct } from './types';
import { aliexpressAdapter } from './aliexpress';
import { coupangAdapter } from './coupang';
import { naverAdapter } from './naver';

export type { WebProduct, SourceAdapter } from './types';

/** 어댑터 레지스트리 — 새 소스 추가 시 여기에 등록 */
const adapters: Record<string, SourceAdapter<any>> = {
  aliexpress: aliexpressAdapter,
  coupang: coupangAdapter,
  naver: naverAdapter,
};

export function getAdapter(source: string): SourceAdapter<any> | undefined {
  return adapters[source];
}

export function getAllAdapters(): SourceAdapter<any>[] {
  return Object.values(adapters);
}

/** 여러 소스의 원본 데이터를 통합 변환 */
export function transformAll(
  sources: { source: string; data: unknown[] }[]
): WebProduct[] {
  const results: WebProduct[] = [];
  for (const { source, data } of sources) {
    const adapter = adapters[source];
    if (!adapter) {
      console.warn(`[adapters] Unknown source: ${source}, skipping`);
      continue;
    }
    results.push(...adapter.transform(data));
  }
  return results;
}
