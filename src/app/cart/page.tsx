"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const { items, getTotalItems } = useCartStore();

  // Для отладки
  useEffect(() => {
    console.log("Cart items:", items);
  }, [items]);

  if (getTotalItems() === 0) {
    return (
      <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-light flex items-center justify-center">
              <ShoppingCart size={64} className="text-muted" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Корзина пуста
            </h1>
            <p className="text-secondary text-lg mb-8">
              Добавьте товары в корзину, чтобы оформить заказ
            </p>
            <Link
              href="/products"
              className="btn-primary inline-flex items-center gap-2"
            >
              <ShoppingBag size={20} />
              <span>Перейти в каталог</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Продолжить покупки</span>
          </Link>
          <h1 className="text-4xl font-bold text-white">Корзина</h1>
          <p className="text-secondary mt-2">
            {getTotalItems()} {getTotalItems() === 1 ? "товар" : "товаров"} в
            корзине
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingCart size={24} className="text-primary" />
            </div>
            <h3 className="font-bold text-white mb-2">Бесплатная доставка</h3>
            <p className="text-sm text-secondary">При заказе от 100,000₩</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-2">Гарантия качества</h3>
            <p className="text-sm text-secondary">100% оригинальные товары</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-2">Безопасная оплата</h3>
            <p className="text-sm text-secondary">Защищенные платежи</p>
          </div>
        </div>
      </div>
    </div>
  );
}
