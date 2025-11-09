import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  return null;
}

export async function GET(request: Request) {
  const authError = await checkAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    // Поиск по имени или email
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, error } = await query;

    if (error) {
      console.error("Ошибка загрузки пользователей:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
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

    return NextResponse.json({ users: usersWithStats });
  } catch (error) {
    console.error("Ошибка в API:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
