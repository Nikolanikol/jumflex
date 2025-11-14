import { Product } from "@/types/database";

interface ProductStructuredDataProps {
  product: Product;
  averageRating?: number;
  reviewCount?: number;
}

export default function ProductStructuredData({
  product,
  averageRating,
  reviewCount,
}: ProductStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fitstore.kr";
  const price = product.discount_price || product.price;
  const availability = product.stock > 0 ? "InStock" : "OutOfStock";

  // Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name_ru,
    image: product.images?.map((img) => `${baseUrl}${img}`) || [],
    description:
      product.description_ru?.replace(/<[^>]*>/g, "") || product.name_ru,
    sku: product.id,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand.name,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: "KRW",
      price: price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability: `https://schema.org/${availability}`,
      seller: {
        "@type": "Organization",
        name: "FitStore",
      },
    },
    ...(averageRating && reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: reviewCount,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    category: product.category?.name_ru || "Спортивное питание",
  };

  // Удаляем undefined значения
  const cleanSchema = JSON.parse(JSON.stringify(productSchema));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}
