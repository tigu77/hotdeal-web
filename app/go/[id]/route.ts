import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hotdeal-alimi.vercel.app';

// 런타임에 products.json 읽기 (배포 후 업데이트 반영)
function findProduct(id: string) {
  try {
    const filePath = join(process.cwd(), 'data', 'products.json');
    const products = JSON.parse(readFileSync(filePath, 'utf-8')) as any[];
    return products.find(p => p.shortId === id) || products.find(p => p.id === id) || null;
  } catch {
    return null;
  }
}

export const dynamic = 'force-dynamic';

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
