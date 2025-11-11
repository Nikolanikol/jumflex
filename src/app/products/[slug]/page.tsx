import { notFound } from "next/navigation";
import ProductGallery from "@/components/products/ProductGallery";
import ProductReviews from "@/components/products/ProductReviews";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types/database";
import { Star, Shield, Truck, Package } from "lucide-react";
import AddToCartButton from "@/components/products/AddToCartButton";
import Link from "next/link";
import WishlistButton from "@/components/products/WishlistButton";

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/api/products/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getSimilarProducts(
  categoryId: string,
  currentProductId: string
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/api/products?category=${categoryId}&limit=4`,
      { cache: "no-store" }
    );
    const data = await response.json();
    return (data.products || []).filter(
      (p: Product) => p.id !== currentProductId
    );
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>; // Изменено: Promise
}) {
  const { slug } = await params; // Добавлено: await params

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = product.category_id
    ? await getSimilarProducts(product.category_id, product.id)
    : [];

  const price = product.discount_price || product.price;
  const hasDiscount =
    product.discount_price && product.discount_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discount_price!) / product.price) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-secondary hover:text-primary transition-colors"
          >
            Главная
          </Link>
          <span className="text-muted">/</span>
          <Link
            href="/products"
            className="text-secondary hover:text-primary transition-colors"
          >
            Каталог
          </Link>
          {product.category && (
            <>
              <span className="text-muted">/</span>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-secondary hover:text-primary transition-colors"
              >
                {product.category.name_ru || product.category.name_ko}
              </Link>
            </>
          )}
          <span className="text-muted">/</span>
          <span className="text-white">
            {product.name_ru || product.name_ko}
          </span>
        </div>

        {/* Product info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Gallery */}
          <div>
            <ProductGallery
              images={product.images || []}
              productName={product.name_ru || product.name_ko}
            />
          </div>

          {/* Info */}
          <div>
            <div className="card p-6">
              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-muted mb-2 uppercase tracking-wide font-medium">
                  {product.brand.name}
                </p>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold text-white mb-4">
                {product.name_ru || product.name_ko}
              </h1>
              {/* <WishlistButton productId={product.id} size={24} /> */}

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  <Star size={20} className="fill-primary text-primary" />
                  <span className="text-lg font-semibold text-white">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-secondary">
                  ({product.reviews_count} отзывов)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 p-6 bg-lighter rounded-xl">
                {hasDiscount && (
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl text-muted line-through">
                      ₩{product.price.toLocaleString()}
                    </span>
                    <span className="bg-accent text-white text-sm font-bold px-3 py-1 rounded-lg">
                      -{discountPercent}%
                    </span>
                  </div>
                )}
                <div className="text-4xl font-bold text-primary">
                  ₩{price.toLocaleString()}
                </div>
              </div>

              {/* Stock status */}
              <div className="mb-6">
                {product.stock_quantity > 0 ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <Package size={18} />
                    <span className="font-medium">
                      В наличии: {product.stock_quantity} шт
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-accent">
                    <Package size={18} />
                    <span className="font-medium">Нет в наличии</span>
                  </div>
                )}
              </div>

              {/* Add to cart */}
              <AddToCartButton product={product} />

              {/* Features */}
              <div className="mt-6 pt-6 border-t border-dark space-y-3">
                <div className="flex items-center gap-3 text-secondary">
                  <Shield size={18} className="text-primary" />
                  <span className="text-sm">100% оригинальный товар</span>
                </div>
                <div className="flex items-center gap-3 text-secondary">
                  <Truck size={18} className="text-primary" />
                  <span className="text-sm">
                    Бесплатная доставка от 50,000₩
                  </span>
                </div>
                <div className="flex items-center gap-3 text-secondary">
                  <Package size={18} className="text-primary" />
                  <span className="text-sm">Гарантия возврата денег</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description tabs */}
        <div className="card p-6 mb-12">
          <div className="space-y-6">
            {/* Description */}
            {(product.description_ru || product.description_ko) && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Описание</h2>
                <p className="text-secondary leading-relaxed">
                  {product.description_ru || product.description_ko}
                </p>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <div className="pt-6 border-t border-dark">
                <h2 className="text-xl font-bold text-white mb-4">Состав</h2>
                <p className="text-secondary leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            )}

            {/* Usage */}
            {product.usage_instructions && (
              <div className="pt-6 border-t border-dark">
                <h2 className="text-xl font-bold text-white mb-4">
                  Способ применения
                </h2>
                <p className="text-secondary leading-relaxed">
                  {product.usage_instructions}
                </p>
              </div>
            )}

            {/* Nutrition facts */}
            {product.nutrition_facts && (
              <div className="pt-6 border-t border-dark">
                <h2 className="text-xl font-bold text-white mb-4">
                  Пищевая ценность
                </h2>
                <div className="bg-lighter p-4 rounded-xl">
                  <pre className="text-secondary text-sm overflow-x-auto">
                    {JSON.stringify(product.nutrition_facts, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <ProductReviews
          reviews={product.reviews || []}
          averageRating={product.rating}
          totalReviews={product.reviews_count}
        />

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Похожие товары
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
