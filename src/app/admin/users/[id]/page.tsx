import { requireAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Shield, User as UserIcon, Mail, Phone, Calendar } from "lucide-react";
import UserRoleChanger from "@/components/admin/UserRoleChanger";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  // Получаем пользователя
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (userError || !user) {
    notFound();
  }

  // Получаем заказы пользователя
  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items(
        *,
        product:products(name_ru, images)
      )
    `
    )
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  // Считаем статистику
  const totalOrders = orders?.length || 0;
  const totalSpent =
    orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
  const completedOrders =
    orders?.filter((o) => o.status === "delivered").length || 0;

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "Новый", color: "bg-yellow-500/20 text-yellow-400" },
    processing: { label: "В обработке", color: "bg-blue-500/20 text-blue-400" },
    shipped: { label: "Отправлено", color: "bg-purple-500/20 text-purple-400" },
    delivered: { label: "Доставлено", color: "bg-green-500/20 text-green-400" },
    cancelled: { label: "Отменено", color: "bg-red-500/20 text-red-400" },
  };

  return (
    <div>
      {/* Хлебные крошки */}
      <div className="mb-6">
        <Link href="/admin/users" className="text-gray-400 hover:text-white">
          ← Назад к пользователям
        </Link>
      </div>

      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center">
            <span className="text-yellow-400 font-bold text-2xl">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <UserRoleChanger userId={user.id} currentRole={user.role} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка - информация о пользователе */}
        <div className="space-y-6">
          {/* Основная информация */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Информация</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Телефон</p>
                    <p className="text-white">{user.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Дата регистрации</p>
                  <p className="text-white">{formatDate(user.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {user.role === "admin" ? (
                  <Shield size={20} className="text-red-400" />
                ) : (
                  <UserIcon size={20} className="text-blue-400" />
                )}
                <div>
                  <p className="text-sm text-gray-400">Роль</p>
                  <p
                    className={`font-medium ${
                      user.role === "admin" ? "text-red-400" : "text-blue-400"
                    }`}
                  >
                    {user.role === "admin" ? "Администратор" : "Клиент"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Статистика</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Всего заказов</p>
                <p className="text-2xl font-bold text-white">{totalOrders}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Завершено</p>
                <p className="text-2xl font-bold text-green-400">
                  {completedOrders}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Потрачено</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {formatPrice(totalSpent)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Правая колонка - история заказов */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              История заказов ({totalOrders})
            </h2>

            {!orders || orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                Заказов пока нет
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusInfo =
                    statusConfig[order.status] || statusConfig.pending;

                  return (
                    <div
                      key={order.id}
                      className="border border-gray-800 rounded-lg p-4 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="font-mono text-sm text-yellow-400 hover:text-yellow-300"
                          >
                            {order.order_number}
                          </Link>
                          <p className="text-sm text-gray-400 mt-1">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">
                            {formatPrice(order.total_amount)}
                          </p>
                          <span
                            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Товары в заказе */}
                      <div className="flex gap-2 mt-3 overflow-x-auto">
                        {order.order_items
                          ?.slice(0, 3)
                          .map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex-shrink-0 w-16 h-16 bg-gray-800 rounded overflow-hidden"
                            >
                              {item.product?.images &&
                                item.product.images[0] && (
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.name_ru}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                            </div>
                          ))}
                        {order.order_items && order.order_items.length > 3 && (
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-sm text-gray-400">
                            +{order.order_items.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
