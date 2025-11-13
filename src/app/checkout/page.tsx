"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import Image from "next/image";
import toast from "react-hot-toast";

interface SavedAddress {
  id: string;
  label: string;
  recipient_name: string;
  recipient_phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

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

  // Загрузка сохраненных адресов
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      loadSavedAddresses();
      // Автозаполнение имени и email из профиля
      setFormData((prev) => ({
        ...prev,
        customer_name: session.user?.name || "",
        customer_email: session.user?.email || "",
      }));
    } else {
      setLoadingAddresses(false);
    }
  }, [status, session]);

  const loadSavedAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await fetch("/api/user/addresses");

      if (response.ok) {
        const addresses = await response.json();
        setSavedAddresses(addresses);

        // Автоматически выбираем адрес по умолчанию
        const defaultAddress = addresses.find(
          (addr: SavedAddress) => addr.is_default
        );
        if (defaultAddress) {
          selectAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const selectAddress = (address: SavedAddress) => {
    setSelectedAddressId(address.id);

    // Автозаполнение формы данными из адреса
    setFormData((prev) => ({
      ...prev,
      customer_name: address.recipient_name,
      customer_phone: address.recipient_phone,
      address: address.address_line2
        ? `${address.address_line1}, ${address.address_line2}`
        : address.address_line1,
      city: address.city,
      postal_code: address.postal_code,
    }));
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Снимаем выбор с адреса если пользователь редактирует вручную
    if (
      field !== "notes" &&
      field !== "payment_method" &&
      field !== "customer_email"
    ) {
      setSelectedAddressId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (getTotalItems() === 0) {
      toast.error("Корзина пуста");

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
      toast.error("Заполните все обязательные поля");

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
        clearCart();
        router.push(`/checkout/success?order=${data.order.order_number}`);
      } else {
        toast.error(data.error || "Ошибка при создании заказа");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Ошибка при создании заказа");
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
                  savedAddresses={savedAddresses}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={selectAddress}
                  loadingAddresses={loadingAddresses}
                  isAuthenticated={status === "authenticated"}
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
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name_ru || item.product.name_ko}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-lighter"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {item.product.name_ru || item.product.name_ko}
                        </p>
                        <p className="text-xs text-secondary">
                          {item.quantity} × ₩
                          {(
                            item.product.discount_price || item.product.price
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-white">
                        ₩
                        {(
                          item.quantity *
                          (item.product.discount_price || item.product.price)
                        ).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="divider"></div>

                {/* Summary */}
                <div className="space-y-3">
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
                  {subtotal < 50000 && (
                    <p className="text-xs text-secondary">
                      Добавьте товаров на ₩{(50000 - subtotal).toLocaleString()}{" "}
                      для бесплатной доставки
                    </p>
                  )}
                  <div className="divider"></div>
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Итого:</span>
                    <span className="text-primary">
                      ₩{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Оформление...
                    </span>
                  ) : (
                    `Оформить заказ на ₩${total.toLocaleString()}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
