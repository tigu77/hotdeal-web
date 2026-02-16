import type { MetadataRoute } from "next";
import { getProducts } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hotdeal-web-peach.vercel.app";
  const products = getProducts();

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...products.map((p) => ({
      url: `${baseUrl}/product/${p.id}`,
      lastModified: new Date(p.postedAt),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
