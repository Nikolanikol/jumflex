import { notFound } from "next/navigation";
import ProductGallery from "@/components/products/ProductGallery";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types/database";
import { Star, Shield, Truck, Package } from "lucide-react";
import AddToCartButton from "@/components/products/AddToCartButton";
import Link from "next/link";
import WishlistButton from "@/components/products/WishlistButton";
import RatingSection from "@/components/products/RatingSection";
import CommentsSection from "@/components/products/CommentsSection";
import { supabase } from "@/lib/supabase";

// Помечаем страницу как динамическую для Vercel
export const dynamic = "force-dynamic";

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(id, name_ko, name_ru, name_en, slug),
        brand:brands(id, name, logo_url),
        reviews(
          id,
          rating,
          comment,
          created_at,
          user:users(name)
        )
      `
      )
      .eq("slug", slug)
      .eq("reviews.is_approved", true)
      .single();

    if (error || !product) {
      console.error("Error fetching product:", error);
      return null;
    }

    return product as unknown as Product;
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
    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(id, name_ko, name_ru, name_en, slug),
        brand:brands(id, name, logo_url)
      `
      )
      .eq("category_id", categoryId)
      .neq("id", currentProductId)
      .limit(4);

    if (error) {
      console.error("Error fetching similar products:", error);
      return [];
    }

    return (products || []) as unknown as Product[];
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  console.log("Product ID:", product.id); // Для отладки

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
        <nav className="mb-8 flex items-center space-x-2 text-sm text-secondary">
          <Link href="/" className="hover:text-white transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">
            Товары
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/products?category=${product.category.id}`}
                className="hover:text-white transition-colors"
              >
                {product.category.name_ru}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-white">{product.name_ru}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Gallery */}
          <div>
            <ProductGallery images={product.images || []} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {product.name_ru}
              </h1>
              {product.brand && (
                <p className="text-secondary">{product.brand.name}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-medium">{product.rating}</span>
              </div>
              <span className="text-secondary">
                {product.reviews_count} отзывов
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-white">
                {price.toLocaleString()} ₩
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-secondary line-through">
                    {product.price.toLocaleString()} ₩
                  </span>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Stock status */}
            <div>
              {product.stock_quantity > 0 ? (
                <span className="text-green-400">В наличии</span>
              ) : (
                <span className="text-red-400">Нет в наличии</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <AddToCartButton product={product} />
              <WishlistButton productId={product.id} />
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-dark-lighter">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-white text-sm font-medium">
                    Гарантия качества
                  </p>
                  <p className="text-secondary text-xs">100% оригинал</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-white text-sm font-medium">
                    Быстрая доставка
                  </p>
                  <p className="text-secondary text-xs">1-3 дня</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-white text-sm font-medium">
                    Безопасная упаковка
                  </p>
                  <p className="text-secondary text-xs">Надежная защита</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description_ru && (
          <div className="mb-12 card">
            <h2 className="text-2xl font-bold text-white mb-4">Описание</h2>
            <div
              className="text-secondary prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description_ru }}
            />
          </div>
        )}

        {/* Ingredients */}
        {product.ingredients && (
          <div className="mb-12 card">
            <h2 className="text-2xl font-bold text-white mb-4">Состав</h2>
            <p className="text-secondary">{product.ingredients}</p>
          </div>
        )}

        {/* Usage Instructions */}
        {product.usage_instructions && (
          <div className="mb-12 card">
            <h2 className="text-2xl font-bold text-white mb-4">
              Способ применения
            </h2>
            <p className="text-secondary">{product.usage_instructions}</p>
          </div>
        )}

        {/* Rating Section */}
        <div className="mb-12">
          <RatingSection productId={product.id} />
        </div>

        {/* Comments Section */}
        <div className="mb-12">
          <CommentsSection productId={product.id} />
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Похожие товары
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
