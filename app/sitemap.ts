import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hotdeal-web-peach.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    // 개별 상품 페이지 추가 시:
    // ...products.map((p) => ({
    //   url: `${baseUrl}/deal/${p.id}`,
    //   lastModified: new Date(p.updatedAt),
    //   changeFrequency: "daily" as const,
    //   priority: 0.8,
    // })),
  ];
}
