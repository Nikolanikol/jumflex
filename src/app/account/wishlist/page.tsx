"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { Product } from "@/types/database";
import Image from "next/image";

interface WishlistItem {
  id: string;
  product: Product;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await fetch("/api/user/wishlist");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const response = await fetch(
        `/api/user/wishlist?product_id=${productId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        removeItem(productId);
        setItems(items.filter((item) => item.product.id !== productId));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    alert("Товар добавлен в корзину");
  };

  if (loading) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-secondary">Загрузка избранного...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-24 h-24 bg-lighter rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart size={48} className="text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Избранное пусто</h2>
        <p className="text-secondary mb-8">
          Добавьте товары, которые вам нравятся
        </p>
        <Link href="/products" className="btn-primary">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Избранное</h1>
        <p className="text-secondary">{items.length} товаров в избранном</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const product = item.product;
          const price = product.discount_price || product.price;
          const hasDiscount =
            product.discount_price && product.discount_price < product.price;

          return (
            <div key={item.id} className="card p-4 flex gap-4">
              {/* Image */}
              <Link
                href={`/products/${product.slug}`}
                className="relative w-24 h-24 bg-lighter rounded-lg overflow-hidden flex-shrink-0 group"
              >
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name_ru || product.name_ko}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted text-xs">Нет фото</span>
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${product.slug}`}
                  className="block group"
                >
                  {product.brand && (
                    <p className="text-xs text-muted mb-1">
                      {product.brand.name}
                    </p>
                  )}
                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {product.name_ru || product.name_ko}
                  </h3>
                </Link>

                {/* Price */}
                <div className="mb-3">
                  {hasDiscount && (
                    <span className="text-sm text-muted line-through mr-2">
                      ₩{product.price.toLocaleString()}
                    </span>
                  )}
                  <span className="text-lg font-bold text-primary">
                    ₩{price.toLocaleString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_quantity === 0}
                    className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShoppingCart size={16} />
                    <span>В корзину</span>
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="p-2 bg-accent/10 hover:bg-accent/20 rounded-lg transition-all"
                    title="Удалить"
                  >
                    <Trash2 size={16} className="text-accent" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
