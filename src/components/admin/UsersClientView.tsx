"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Eye, Shield, User as UserIcon } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  created_at: string;
  orders_count: number;
  total_spent: number;
}

interface Stats {
  total: number;
  customers: number;
  admins: number;
}

export default function UsersClientView({
  initialUsers,
  stats,
}: {
  initialUsers: User[];
  stats: Stats;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Фильтрация на клиенте
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return initialUsers;

    const query = searchQuery.toLowerCase();
    return initialUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query)
    );
  }, [initialUsers, searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Пользователи</h1>
        <p className="text-gray-400">Управление пользователями магазина</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Всего пользователей</span>
            <UserIcon size={24} className="text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Клиенты</span>
            <UserIcon size={24} className="text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.customers}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Администраторы</span>
            <Shield size={24} className="text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.admins}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени, email или телефону..."
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 pr-10 text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-400"
          />
          <Search
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-950 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Пользователь
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Контакты
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Роль
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Заказы
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Потрачено
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Дата регистрации
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Пользователи не найдены
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                          <span className="text-yellow-400 font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-300">{user.email}</p>
                        {user.phone && (
                          <p className="text-sm text-gray-400">{user.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-red-500/20 text-red-400 border border-red-500/20"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <>
                            <Shield size={14} />
                            <span>Админ</span>
                          </>
                        ) : (
                          <>
                            <UserIcon size={14} />
                            <span>Клиент</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">
                        {user.orders_count}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-yellow-400">
                        {formatPrice(user.total_spent)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400">
                        {formatDate(user.created_at)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <Link
                          href={`/admin/users/${user.id}`}
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
