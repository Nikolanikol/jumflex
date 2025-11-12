"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CartSummary() {
  const router = useRouter();
  const { getTotalPrice, getTotalItems } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= 50000 ? 0 : 5000;
  const total = subtotal - discount + shippingCost;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError("Введите промокод");
      return;
    }

    // TODO: Проверка промокода через API
    // Для примера - фиксированная скидка
    if (promoCode.toUpperCase() === "WELCOME10") {
      const discountAmount = Math.round(subtotal * 0.1);
      setDiscount(discountAmount);
      setPromoApplied(true);
      setPromoError("");
    } else if (promoCode.toUpperCase() === "SAVE5000") {
      setDiscount(5000);
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Неверный промокод");
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setDiscount(0);
    setPromoApplied(false);
    setPromoError("");
  };

  const handleCheckout = () => {
    if (getTotalItems() === 0) {
      alert("Корзина пуста");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="card p-6 sticky top-24">
      <h2 className="text-xl font-bold text-white mb-6">Итого</h2>

      {/* Summary items */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-secondary">
          <span>Товары ({getTotalItems()} шт):</span>
          <span>₩{subtotal.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-green-400">
            <span>Скидка:</span>
            <span>-₩{discount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-secondary">
          <span>Доставка:</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-400">Бесплатно</span>
            ) : (
              `₩${shippingCost.toLocaleString()}`
            )}
          </span>
        </div>

        {subtotal < 50000 && subtotal > 0 && (
          <p className="text-xs text-muted">
            Добавьте товаров на ₩{(50000 - subtotal).toLocaleString()} для
            бесплатной доставки
          </p>
        )}
      </div>

      <div className="divider my-4"></div>

      {/* Total */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-lg font-semibold text-white">Всего:</span>
        <span className="text-2xl font-bold text-primary">
          ₩{total.toLocaleString()}
        </span>
      </div>

      {/* Promo code */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">
          Промокод
        </label>
        {!promoApplied ? (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value.toUpperCase());
                  setPromoError("");
                }}
                placeholder="Введите код"
                className="input-field text-sm pr-10"
              />
              <Tag
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
            <button
              onClick={handleApplyPromo}
              className="btn-secondary text-sm px-4 whitespace-nowrap"
            >
              Применить
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-green-400/10 border border-green-400/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-green-400" />
              <span className="text-sm font-medium text-green-400">
                {promoCode}
              </span>
            </div>
            <button
              onClick={handleRemovePromo}
              className="text-xs text-secondary hover:text-accent transition-colors"
            >
              Удалить
            </button>
          </div>
        )}
        {promoError && <p className="text-xs text-accent mt-2">{promoError}</p>}
      </div>

      {/* Checkout button */}
      <button
        onClick={handleCheckout}
        disabled={getTotalItems() === 0}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Оформить заказ</span>
        <ArrowRight size={18} />
      </button>

      {/* Info */}
      <div className="mt-4 p-4 bg-lighter rounded-lg">
        <p className="text-xs text-secondary leading-relaxed">
          Нажимая "Оформить заказ", вы соглашаетесь с условиями использования и
          политикой конфиденциальности
        </p>
      </div>
    </div>
  );
}
