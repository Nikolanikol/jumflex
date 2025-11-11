"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types/database";
import { useCartStore } from "@/store/cart";
import WishlistButton from "./WishlistButton";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const price = product.discount_price || product.price;
  const hasDiscount =
    product.discount_price && product.discount_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discount_price!) / product.price) * 100
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success("Товар добавлен в корзину");
  };
  console.log("Product slug:", product.slug); // Для отладки

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card overflow-hidden h-full flex flex-col">
        {/* Wishlist button */}
        {/* <div className="absolute  top-2 right-2 z-50">
          <WishlistButton productId={product.id} size={34} />
        </div> */}
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-lighter">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name_ru || product.name_ko}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-lighter">
              <span className="text-muted text-sm">Нет фото</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-lg">
                НОВИНКА
              </span>
            )}
            {hasDiscount && (
              <span className="bg-primary text-black text-xs font-semibold px-3 py-1 rounded-lg shadow-lg">
                -{discountPercent}%
              </span>
            )}
            {product.is_featured && (
              <span className="bg-darker text-primary text-xs font-semibold px-3 py-1 rounded-lg shadow-lg border border-primary/30">
                ХИТ
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-muted mb-2 font-medium uppercase tracking-wide">
              {product.brand.name}
            </p>
          )}

          {/* Title */}
          <h3 className="font-semibold text-base mb-3 line-clamp-2 text-white group-hover:text-primary transition-colors leading-snug">
            {product.name_ru || product.name_ko}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-primary text-primary" />
              <span className="text-sm font-medium text-white">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-muted">
              ({product.reviews_count})
            </span>
          </div>

          {/* Price */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-4">
              {hasDiscount && (
                <span className="text-sm text-muted line-through">
                  ₩{product.price.toLocaleString()}
                </span>
              )}
              <span className="text-xl font-bold text-white">
                ₩{price.toLocaleString()}
              </span>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingCart size={16} />
              <span>В корзину</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
