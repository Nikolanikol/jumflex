"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cart";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    address: "",
    city: "",
    postal_code: "",
    notes: "",
    payment_method: "card",
  });

  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shippingCost;

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (getTotalItems() === 0) {
      alert("Корзина пуста");
      return;
    }

    // Валидация
    if (
      !formData.customer_name ||
      !formData.customer_email ||
      !formData.customer_phone ||
      !formData.address ||
      !formData.city ||
      !formData.postal_code
    ) {
      alert("Заполните все обязательные поля");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.discount_price || item.product.price,
        })),
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address: {
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
        },
        payment_method: formData.payment_method,
        total_amount: total,
        discount_amount: 0,
        shipping_cost: shippingCost,
        notes: formData.notes,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        // Очистить корзину
        clearCart();

        // Перенаправить на страницу успеха
        router.push(`/checkout/success?order=${data.order.order_number}`);
      } else {
        alert(data.error || "Ошибка при создании заказа");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Произошла ошибка. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (getTotalItems() === 0) {
    return (
      <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Корзина пуста
            </h1>
            <p className="text-secondary mb-8">
              Добавьте товары в корзину для оформления заказа
            </p>
            <Link href="/products" className="btn-primary">
              Перейти в каталог
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
            href="/cart"
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Вернуться в корзину</span>
          </Link>
          <h1 className="text-4xl font-bold text-white">Оформление заказа</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Forms */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <ShippingForm
                  formData={formData}
                  onChange={handleFieldChange}
                />
              </div>

              <div className="card p-6">
                <PaymentMethod
                  selectedMethod={formData.payment_method}
                  onChange={(method) =>
                    handleFieldChange("payment_method", method)
                  }
                />
              </div>
            </div>

            {/* Right side - Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Ваш заказ</h2>

                {/* Order items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-lighter rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name_ru || item.product.name_ko}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white line-clamp-2">
                          {item.product.name_ru || item.product.name_ko}
                        </h3>
                        <p className="text-xs text-secondary mt-1">
                          {item.quantity} × ₩
                          {(
                            item.product.discount_price || item.product.price
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="divider mb-6"></div>

                {/* Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-secondary">
                    <span>Товары ({getTotalItems()}):</span>
                    <span>₩{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Доставка:</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-400">Бесплатно</span>
                      ) : (
                        `₩${shippingCost.toLocaleString()}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="divider mb-6"></div>

                {/* Total */}
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-semibold text-white">
                    Итого:
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ₩{total.toLocaleString()}
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Обработка...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>Подтвердить заказ</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-secondary text-center mt-4">
                  Нажимая кнопку, вы соглашаетесь с условиями использования
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
