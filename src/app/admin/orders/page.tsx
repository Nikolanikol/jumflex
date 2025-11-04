"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Eye, Filter } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  processing: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  shipped: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  delivered: "bg-green-400/10 text-green-400 border-green-400/20",
  cancelled: "bg-red-400/10 text-red-400 border-red-400/20",
};

const statusLabels: Record<string, string> = {
  pending: "Ожидает",
  processing: "В обработке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменен",
};

const paymentStatusColors: Record<string, string> = {
  pending: "text-yellow-400",
  paid: "text-green-400",
  failed: "text-red-400",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "Ожидает оплаты",
  paid: "Оплачен",
  failed: "Ошибка оплаты",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Заказы</h1>
        <p className="text-secondary">Управление заказами магазина</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <button
          onClick={() => setStatusFilter("all")}
          className={`card p-4 text-center transition-all ${
            statusFilter === "all" ? "border-2 border-primary" : ""
          }`}
        >
          <p className="text-2xl font-bold text-white mb-1">{stats.total}</p>
          <p className="text-sm text-secondary">Всего</p>
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`card p-4 text-center transition-all ${
            statusFilter === "pending" ? "border-2 border-yellow-400" : ""
          }`}
        >
          <p className="text-2xl font-bold text-yellow-400 mb-1">
            {stats.pending}
          </p>
          <p className="text-sm text-secondary">Ожидает</p>
        </button>
        <button
          onClick={() => setStatusFilter("processing")}
          className={`card p-4 text-center transition-all ${
            statusFilter === "processing" ? "border-2 border-blue-400" : ""
          }`}
        >
          <p className="text-2xl font-bold text-blue-400 mb-1">
            {stats.processing}
          </p>
          <p className="text-sm text-secondary">В обработке</p>
        </button>
        <button
          onClick={() => setStatusFilter("shipped")}
          className={`card p-4 text-center transition-all ${
            statusFilter === "shipped" ? "border-2 border-purple-400" : ""
          }`}
        >
          <p className="text-2xl font-bold text-purple-400 mb-1">
            {stats.shipped}
          </p>
          <p className="text-sm text-secondary">Отправлен</p>
        </button>
        <button
          onClick={() => setStatusFilter("delivered")}
          className={`card p-4 text-center transition-all ${
            statusFilter === "delivered" ? "border-2 border-green-400" : ""
          }`}
        >
          <p className="text-2xl font-bold text-green-400 mb-1">
            {stats.delivered}
          </p>
          <p className="text-sm text-secondary">Доставлен</p>
        </button>
      </div>

      {/* Search */}
      <div className="card p-6 mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по номеру заказа, имени или email..."
            className="input-field pr-10"
          />
          <Search
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-lighter border-b border-dark">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Заказ
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Клиент
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Сумма
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Оплата
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Дата
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-secondary"
                  >
                    Загрузка...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-secondary"
                  >
                    Заказы не найдены
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-lighter transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">
                        {order.order_number}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">
                          {order.customer_name}
                        </p>
                        <p className="text-sm text-secondary">
                          {order.customer_email}
                        </p>
                        <p className="text-sm text-secondary">
                          {order.customer_phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-primary">
                        ₩{order.total_amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full border ${
                          statusColors[order.status]
                        }`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          paymentStatusColors[order.payment_status]
                        }`}
                      >
                        {paymentStatusLabels[order.payment_status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-secondary">
                        {new Date(order.created_at).toLocaleDateString(
                          "ru-RU",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 hover:bg-lighter rounded-lg transition-colors"
                          title="Просмотр"
                        >
                          <Eye size={18} className="text-primary" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
