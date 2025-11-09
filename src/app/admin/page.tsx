import { requireAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import OrdersClientView from "@/components/admin/OrdersClientView";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const statusFilter = params.status || "all";

  // Загружаем заказы на сервере
  let query = supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      customer_name,
      customer_email,
      customer_phone,
      total_amount,
      status,
      payment_status,
      created_at
    `
    )
    .order("created_at", { ascending: false });

  // Применяем фильтр если нужно
  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data: orders, error } = await query;

  if (error) {
    console.error("Ошибка загрузки заказов:", error);
  }

  // Считаем статистику
  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter((o) => o.status === "pending").length || 0,
    processing: orders?.filter((o) => o.status === "processing").length || 0,
    shipped: orders?.filter((o) => o.status === "shipped").length || 0,
    delivered: orders?.filter((o) => o.status === "delivered").length || 0,
  };

  return (
    <OrdersClientView
      initialOrders={orders || []}
      stats={stats}
      currentStatusFilter={statusFilter}
    />
  );
}
