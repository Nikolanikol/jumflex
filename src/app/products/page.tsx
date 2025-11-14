import { Suspense } from "react";
import ProductsContent from "./ProductsContent";
import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo-utils";
import { getCategory } from "@/lib/getCategory";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;

  if (!params.category) {
    return generateSEOMetadata({
      title: "Каталог спортивного питания",
      description:
        "Широкий выбор спортивного питания: протеины, креатин, BCAA, витамины",
      url: "/products",
    });
  }

  // Получить категорию из базы
  const category = await getCategory(params.category);
  console.log(category, "category");
  return generateSEOMetadata({
    title: `${
      category?.name_ru || "Спортивное питание"
    } - Купить в интернет-магазине`,
    description: `${category?.name_ru} от ведущих мировых брендов. Гарантия качества, быстрая доставка.`,
    url: `/products?category=${params.category}`,
  });
}
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-dark py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-secondary">Загрузка каталога...</p>
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
