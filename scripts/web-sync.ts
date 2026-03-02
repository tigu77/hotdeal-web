#!/usr/bin/env node
/**
 * web-sync — 쿠팡/네이버 캐시를 읽어 data/products.json 생성
 * Usage: npx tsx scripts/web-sync.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { transformAll } from '../lib/adapters';

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'data', 'products.json');

interface SourceConfig {
  source: string;
  cachePath: string;
}

const SOURCES: SourceConfig[] = [
  {
    source: 'coupang',
    cachePath: path.resolve(ROOT, '../coupang-deals/data/products_cache.json'),
  },
  {
    source: 'naver',
    cachePath: path.resolve(ROOT, '../naver-connect/data/products_cache.json'),
  },
];

function loadCache(config: SourceConfig): unknown[] {
  try {
    if (!fs.existsSync(config.cachePath)) {
      console.warn(`[web-sync] 캐시 없음: ${config.cachePath}`);
      return [];
    }
    const raw = JSON.parse(fs.readFileSync(config.cachePath, 'utf-8'));
    // 배열이면 그대로, 객체(dict)면 values
    return Array.isArray(raw) ? raw : Object.values(raw);
  } catch (err) {
    console.error(`[web-sync] 캐시 로드 실패 (${config.source}):`, err);
    return [];
  }
}

function main() {
  const sourcesData = SOURCES.map((cfg) => ({
    source: cfg.source,
    data: loadCache(cfg),
  }));

  const products = transformAll(sourcesData);

  // 최신순 정렬
  products.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(products, null, 2), 'utf-8');

  const counts = sourcesData.map((s) => `${s.source}: ${s.data.length}건 로드`);
  console.log(`[web-sync] 완료 — ${products.length}개 상품 저장`);
  console.log(`  ${counts.join(', ')}`);
}

main();
