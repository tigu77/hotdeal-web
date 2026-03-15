import { NextRequest, NextResponse } from 'next/server';
import raw from '@/data/products.json';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hotdeal-alimi.vercel.app';

const products = raw as any[];
// shortId → product 맵 (빌드 시 1회 생성)
const shortIdMap = new Map(products.map(p => [p.shortId, p]));
const idMap = new Map(products.map(p => [p.id, p]));

function findProduct(id: string) {
  return shortIdMap.get(id) || idMap.get(id) || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = findProduct(id);

  if (!product?.affiliateUrl) {
    return NextResponse.redirect(SITE_URL, 302);
  }

  // 클릭 로그
  try {
    const ua = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
    console.log(JSON.stringify({
      event: 'click',
      shortId: id,
      productId: product.id,
      source: product.source || 'coupang',
      title: (product.title || '').slice(0, 50),
      ua: ua.slice(0, 150),
      referer: referer.slice(0, 200),
      ip,
      ts: new Date().toISOString(),
    }));
  } catch {}

  return NextResponse.redirect(product.affiliateUrl, 302);
}
