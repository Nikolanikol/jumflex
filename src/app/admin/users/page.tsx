import { requireAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import UsersClientView from "@/components/admin/UsersClientView";

export default async function AdminUsersPage() {
  await requireAdmin();

  // Загружаем пользователей на сервере
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка загрузки пользователей:", error);
  }

  // Получаем количество заказов для каждого пользователя
  const usersWithStats = await Promise.all(
    (users || []).map(async (user) => {
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("user_id", user.id);

      const totalSpent =
        orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      return {
        ...user,
        orders_count: count || 0,
        total_spent: totalSpent,
      };
    })
  );

  // Считаем статистику
  const stats = {
    total: usersWithStats.length,
    customers: usersWithStats.filter((u) => u.role === "customer").length,
    admins: usersWithStats.filter((u) => u.role === "admin").length,
  };

  return <UsersClientView initialUsers={usersWithStats} stats={stats} />;
}
