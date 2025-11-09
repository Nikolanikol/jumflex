"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Eye } from "lucide-react";

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

interface Stats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
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

export default function OrdersClientView({
  initialOrders,
  stats,
  currentStatusFilter,
}: {
  initialOrders: Order[];
  stats: Stats;
  currentStatusFilter: string;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Фильтрация на клиенте
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return initialOrders;

    const query = searchQuery.toLowerCase();
    return initialOrders.filter(
      (order) =>
        order.order_number.toLowerCase().includes(query) ||
        order.customer_name.toLowerCase().includes(query) ||
        order.customer_email.toLowerCase().includes(query)
    );
  }, [initialOrders, searchQuery]);

  const handleStatusFilter = (status: string) => {
    if (status === "all") {
      router.push("/admin/orders");
    } else {
      router.push(`/admin/orders?status=${status}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Заказы</h1>
        <p className="text-gray-400">Управление заказами магазина</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <button
          onClick={() => handleStatusFilter("all")}
          className={`bg-gray-900 border rounded-lg p-4 text-center transition-all hover:bg-gray-800 ${
            currentStatusFilter === "all"
              ? "border-yellow-400 border-2"
              : "border-gray-800"
          }`}
        >
          <p className="text-2xl font-bold text-white mb-1">{stats.total}</p>
          <p className="text-sm text-gray-400">Всего</p>
        </button>

        <button
          onClick={() => handleStatusFilter("pending")}
          className={`bg-gray-900 border rounded-lg p-4 text-center transition-all hover:bg-gray-800 ${
            currentStatusFilter === "pending"
              ? "border-yellow-400 border-2"
              : "border-gray-800"
          }`}
        >
          <p className="text-2xl font-bold text-yellow-400 mb-1">
            {stats.pending}
          </p>
          <p className="text-sm text-gray-400">Ожидает</p>
        </button>

        <button
          onClick={() => handleStatusFilter("processing")}
          className={`bg-gray-900 border rounded-lg p-4 text-center transition-all hover:bg-gray-800 ${
            currentStatusFilter === "processing"
              ? "border-blue-400 border-2"
              : "border-gray-800"
          }`}
        >
          <p className="text-2xl font-bold text-blue-400 mb-1">
            {stats.processing}
          </p>
          <p className="text-sm text-gray-400">В обработке</p>
        </button>

        <button
          onClick={() => handleStatusFilter("shipped")}
          className={`bg-gray-900 border rounded-lg p-4 text-center transition-all hover:bg-gray-800 ${
            currentStatusFilter === "shipped"
              ? "border-purple-400 border-2"
              : "border-gray-800"
          }`}
        >
          <p className="text-2xl font-bold text-purple-400 mb-1">
            {stats.shipped}
          </p>
          <p className="text-sm text-gray-400">Отправлен</p>
        </button>

        <button
          onClick={() => handleStatusFilter("delivered")}
          className={`bg-gray-900 border rounded-lg p-4 text-center transition-all hover:bg-gray-800 ${
            currentStatusFilter === "delivered"
              ? "border-green-400 border-2"
              : "border-gray-800"
          }`}
        >
          <p className="text-2xl font-bold text-green-400 mb-1">
            {stats.delivered}
          </p>
          <p className="text-sm text-gray-400">Доставлен</p>
        </button>
      </div>

      {/* Search */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по номеру заказа, имени или email..."
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 pr-10 text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-400"
          />
          <Search
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-950 border-b border-gray-800">
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
            <tbody className="divide-y divide-gray-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Заказы не найдены
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white font-mono">
                        {order.order_number}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">
                          {order.customer_name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {order.customer_email}
                        </p>
                        <p className="text-sm text-gray-400">
                          {order.customer_phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-yellow-400">
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
                      <p className="text-sm text-gray-400">
                        {formatDate(order.created_at)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                          title="Просмотр"
                        >
                          <Eye size={18} className="text-yellow-400" />
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
