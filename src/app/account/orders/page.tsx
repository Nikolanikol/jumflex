"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Eye, Clock } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  items: Array<{
    quantity: number;
    price: number;
    product: {
      id: string;
      name_ko: string;
      name_ru: string;
      slug: string;
      images: string[];
    };
  }>;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  processing: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  shipped: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  delivered: "bg-green-400/10 text-green-400 border-green-400/20",
  cancelled: "bg-red-400/10 text-red-400 border-red-400/20",
};

const statusLabels: Record<string, string> = {
  pending: "Ожидает обработки",
  processing: "В обработке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменен",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch("/api/user/orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-secondary">Загрузка заказов...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-24 h-24 bg-lighter rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={48} className="text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Нет заказов</h2>
        <p className="text-secondary mb-8">У вас еще нет заказов</p>
        <Link href="/products" className="btn-primary">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  console.log(orders, "orders");
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Мои заказы</h1>
        <p className="text-secondary">История всех ваших заказов</p>
      </div>

      <div className="space-y-4">
        {orders.length > 0 &&
          orders.map((order) => (
            <div key={order.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Заказ {order.order_number}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(order.created_at).toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{order.items.length} товаров</span>
                  </div>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full border ${
                    statusColors[order.status]
                  }`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>

              {/* Order items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-3 bg-lighter rounded-lg"
                  >
                    <div className="relative w-16 h-16 bg-dark rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name_ru || item.product.name_ko}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-medium text-white hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.product.name_ru || item.product.name_ko}
                      </Link>
                      <p className="text-sm text-secondary mt-1">
                        {item.quantity} × ₩{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        ₩{(item.quantity * item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order footer */}
              <div className="flex items-center justify-between pt-4 border-t border-dark">
                <div>
                  <p className="text-sm text-secondary mb-1">Итого:</p>
                  <p className="text-2xl font-bold text-primary">
                    ₩{order.total_amount.toLocaleString()}
                  </p>
                </div>
                {/* <Link
                href={`/account/orders/${order.id}`}
                className="btn-outline flex items-center gap-2"
              >
                <Eye size={18} />
                <span>Подробнее</span>
              </Link> */}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
