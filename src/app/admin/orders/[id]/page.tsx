"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    id: string;
    name_ko: string;
    name_ru: string;
    slug: string;
    images: string[];
    brand: { name: string };
  };
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  total_amount: number;
  discount_amount: number;
  shipping_cost: number;
  payment_method: string;
  status: string;
  payment_status: string;
  notes: string;
  created_at: string;
  items: OrderItem[];
}

const statusOptions = [
  { value: "pending", label: "Ожидает" },
  { value: "processing", label: "В обработке" },
  { value: "shipped", label: "Отправлен" },
  { value: "delivered", label: "Доставлен" },
  { value: "cancelled", label: "Отменен" },
];

const paymentStatusOptions = [
  { value: "pending", label: "Ожидает оплаты" },
  { value: "paid", label: "Оплачен" },
  { value: "failed", label: "Ошибка оплаты" },
];

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    loadOrder();
  }, []);

  useEffect(() => {
    if (order?.created_at) {
      setFormattedDate(
        new Date(order.created_at).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  }, [order?.created_at]);

  const loadOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`);
      const data = await response.json();
      setOrder(data);
      setStatus(data.status);
      setPaymentStatus(data.payment_status);
      setNotes(data.notes || "");
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          payment_status: paymentStatus,
          notes,
        }),
      });

      if (response.ok) {
        alert("Заказ обновлен");
        loadOrder();
      } else {
        alert("Ошибка при обновлении");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Ошибка при обновлении");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-white mb-4">Заказ не найден</h1>
        <Link href="/admin/orders" className="btn-primary">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span>Назад к списку</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Заказ {order.order_number}
            </h1>
            <p className="text-secondary">{formattedDate}</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Сохранить изменения</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order items */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Package size={20} />
              Товары в заказе
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-lighter rounded-xl"
                >
                  <div className="relative w-20 h-20 bg-dark rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name_ru || item.product.name_ko}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      target="_blank"
                      className="font-semibold text-white hover:text-primary transition-colors"
                    >
                      {item.product.name_ru || item.product.name_ko}
                    </Link>
                    <p className="text-sm text-secondary">
                      {item.product.brand.name}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-sm text-secondary">
                        Количество: {item.quantity}
                      </p>
                      <p className="text-sm text-secondary">
                        Цена: ₩{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">
                      ₩{item.subtotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order total */}
            <div className="mt-6 pt-6 border-t border-dark space-y-2">
              <div className="flex justify-between text-secondary">
                <span>Товары:</span>
                <span>
                  ₩
                  {(
                    order.total_amount -
                    order.shipping_cost +
                    order.discount_amount
                  ).toLocaleString()}
                </span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Скидка:</span>
                  <span>-₩{order.discount_amount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-secondary">
                <span>Доставка:</span>
                <span>₩{order.shipping_cost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-dark">
                <span>Итого:</span>
                <span className="text-primary">
                  ₩{order.total_amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Заметки администратора
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="input-field resize-none"
              placeholder="Добавьте заметки о заказе..."
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Status */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Статус заказа</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Статус заказа
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-field"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Статус оплаты
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="input-field"
                >
                  {paymentStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <User size={20} />
              Информация о клиенте
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-secondary mb-1">Имя</p>
                <p className="text-white font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-secondary mb-1">Email</p>
                <p className="text-white">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-sm text-secondary mb-1">Телефон</p>
                <p className="text-white">{order.customer_phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Адрес доставки
            </h2>
            <div className="space-y-2 text-secondary">
              <p>{order.shipping_address?.address}</p>
              <p>
                {order.shipping_address?.city},{" "}
                {order.shipping_address?.postal_code}
              </p>
            </div>
          </div>

          {/* Payment info */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              Способ оплаты
            </h2>
            <p className="text-secondary">
              {order.payment_method === "card"
                ? "Банковская карта"
                : "Банковский перевод"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
