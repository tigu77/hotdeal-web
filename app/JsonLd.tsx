export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "핫딜 알리미",
    url: "https://hotdeal-web-peach.vercel.app",
    description:
      "매일 엄선된 쿠팡 최저가 핫딜을 추천합니다. 골드박스, 타임세일, 베스트 상품을 한눈에 비교하고 최대 할인가로 구매하세요.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://hotdeal-web-peach.vercel.app/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ItemListJsonLd({
  items,
}: {
  items: { name: string; url: string; image?: string; position: number }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
      ...(item.image && { image: item.image }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
