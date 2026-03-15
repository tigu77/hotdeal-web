import { NextRequest, NextResponse } from 'next/server';
import raw from '@/data/products.json';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hotdeal-alimi.vercel.app';

// products.json에서 shortId/id로 상품 찾기
function findProduct(id: string) {
  const products = raw as any[];
  return products.find(p => p.shortId === id) || products.find(p => p.id === id) || null;
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

  // 클릭 로그 (비동기, 실패해도 리다이렉트에 영향 없음)
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
