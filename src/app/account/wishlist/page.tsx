"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
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
    // Показываем уведомление
    const notification = document.createElement("div");
    notification.className =
      "fixed top-24 right-4 bg-primary text-black px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right";
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
        </svg>
        <span class="font-medium">Добавлено в корзину!</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addToCart(item.product);
    });
    alert(`✅ ${items.length} товаров добавлено в корзину!`);
  };

  const handleClearWishlist = async () => {
    if (!confirm("Удалить все товары из избранного?")) return;

    for (const item of items) {
      await handleRemove(item.product.id);
    }
  };

  // Подсчет статистики
  const totalValue = items.reduce((sum, item) => {
    const price = item.product.discount_price || item.product.price;
    return sum + price;
  }, 0);

  const totalDiscount = items.reduce((sum, item) => {
    if (item.product.discount_price) {
      return sum + (item.product.price - item.product.discount_price);
    }
    return sum;
  }, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-6">
          <div className="h-8 bg-lighter rounded animate-pulse w-48 mb-2"></div>
          <div className="h-4 bg-lighter rounded animate-pulse w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4">
              <div className="h-48 bg-lighter rounded-lg animate-pulse mb-4"></div>
              <div className="h-4 bg-lighter rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-lighter rounded animate-pulse w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="card p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Избранное</h1>
          <p className="text-secondary">Сохраняйте понравившиеся товары</p>
        </div>

        {/* Empty State */}
        <div className="card p-12 text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Heart size={64} className="text-primary/50" />
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-primary/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-accent/20 rounded-full animate-pulse delay-150"></div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            Ваше избранное пусто
          </h2>
          <p className="text-secondary mb-8 max-w-md mx-auto">
            Добавляйте товары в избранное, чтобы не потерять их и вернуться к
            покупке позже
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="btn-primary flex items-center gap-2"
            >
              <ShoppingBag size={20} />
              Перейти в каталог
            </Link>
            <Link href="/" className="btn-outline">
              На главную
            </Link>
          </div>

          {/* Преимущества */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-dark">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart size={24} className="text-primary" />
              </div>
              <h3 className="font-bold text-white mb-2">Быстрый доступ</h3>
              <p className="text-sm text-secondary">
                Сохраните товары для быстрой покупки
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles size={24} className="text-primary" />
              </div>
              <h3 className="font-bold text-white mb-2">Следите за ценой</h3>
              <p className="text-sm text-secondary">
                Получайте уведомления о скидках
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ShoppingCart size={24} className="text-primary" />
              </div>
              <h3 className="font-bold text-white mb-2">Удобство</h3>
              <p className="text-sm text-secondary">
                Добавляйте все в корзину одним кликом
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Heart className="text-primary fill-primary" size={32} />
              Избранное
            </h1>
            <p className="text-secondary">
              {items.length} {items.length === 1 ? "товар" : "товаров"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddAllToCart}
              className="btn-primary flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              Добавить все в корзину
            </button>
            <button
              onClick={handleClearWishlist}
              className="btn-outline flex items-center gap-2 text-accent hover:bg-accent/10"
            >
              <Trash2 size={18} />
              Очистить
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-dark">
          <div className="text-center p-3 rounded-lg bg-light">
            <p className="text-sm text-secondary mb-1">Товаров</p>
            <p className="text-2xl font-bold text-white">{items.length}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-light">
            <p className="text-sm text-secondary mb-1">Общая стоимость</p>
            <p className="text-2xl font-bold text-primary">
              ₩{totalValue.toLocaleString()}
            </p>
          </div>
          {totalDiscount > 0 && (
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10">
              <p className="text-sm text-secondary mb-1">Экономия</p>
              <p className="text-2xl font-bold text-accent">
                ₩{totalDiscount.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const product = item.product;
          const price = product.discount_price || product.price;
          const hasDiscount =
            product.discount_price && product.discount_price < product.price;
          const discountPercent = hasDiscount
            ? Math.round(
                ((product.price - product.discount_price!) / product.price) *
                  100
              )
            : 0;

          return (
            <div
              key={item.id}
              className="card overflow-hidden group hover:border-primary/50 transition-all"
            >
              {/* Image */}
              <Link
                href={`/products/${product.slug}`}
                className="relative block aspect-square bg-lighter overflow-hidden"
              >
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name_ru || product.name_ko}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag size={48} className="text-muted" />
                  </div>
                )}

                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute top-3 left-3 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    -{discountPercent}%
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(product.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                  title="Удалить из избранного"
                >
                  <Trash2 size={18} className="text-white" />
                </button>
              </Link>

              {/* Content */}
              <div className="p-4">
                {/* Brand */}
                {product.brand && (
                  <p className="text-xs text-muted uppercase tracking-wide mb-1">
                    {product.brand.name}
                  </p>
                )}

                {/* Title */}
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-bold text-white mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {product.name_ru || product.name_ko}
                  </h3>
                </Link>

                {/* Category */}
                {product.category && (
                  <p className="text-sm text-secondary mb-3">
                    {product.category.name_ru || product.category.name_ko}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-white">
                    ₩{price.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-muted line-through">
                      ₩{product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />В корзину
                  </button>
                  <Link
                    href={`/products/${product.slug}`}
                    className="btn-outline px-4"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="card p-6 text-center bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="text-xl font-bold text-white mb-2">Готовы к покупке?</h3>
        <p className="text-secondary mb-4">
          Добавьте все товары в корзину и оформите заказ
        </p>
        <button
          onClick={handleAddAllToCart}
          className="btn-primary mx-auto flex items-center gap-2"
        >
          <ShoppingCart size={20} />
          Добавить все в корзину
        </button>
      </div>
    </div>
  );
}
