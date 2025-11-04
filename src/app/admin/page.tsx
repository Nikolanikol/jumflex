import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// Пример данных (позже загружать из API)
const stats = [
  {
    name: "Общая выручка",
    value: "₩2,450,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-400",
  },
  {
    name: "Заказы",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-blue-400",
  },
  {
    name: "Товары",
    value: "324",
    change: "+5",
    trend: "up",
    icon: Package,
    color: "text-primary",
  },
  {
    name: "Пользователи",
    value: "1,234",
    change: "-2.3%",
    trend: "down",
    icon: Users,
    color: "text-purple-400",
  },
];

const recentOrders = [
  { id: "ORD-001", customer: "Иван Иванов", amount: 125000, status: "pending" },
  {
    id: "ORD-002",
    customer: "Мария Петрова",
    amount: 89000,
    status: "processing",
  },
  {
    id: "ORD-003",
    customer: "Алексей Сидоров",
    amount: 156000,
    status: "shipped",
  },
  {
    id: "ORD-004",
    customer: "Елена Кузнецова",
    amount: 78000,
    status: "delivered",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400",
  processing: "bg-blue-400/10 text-blue-400",
  shipped: "bg-purple-400/10 text-purple-400",
  delivered: "bg-green-400/10 text-green-400",
  cancelled: "bg-red-400/10 text-red-400",
};

const statusLabels: Record<string, string> = {
  pending: "Ожидает",
  processing: "В обработке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменен",
};

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Дашборд</h1>
        <p className="text-secondary">Общая статистика магазина</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUp : ArrowDown;

          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-lighter flex items-center justify-center`}
                >
                  <Icon size={24} className={stat.color} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  <TrendIcon size={16} />
                  <span>{stat.change}</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-secondary">{stat.name}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Последние заказы</h2>
            <a
              href="/admin/orders"
              className="text-sm text-primary hover:underline"
            >
              Смотреть все
            </a>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-lighter rounded-xl"
              >
                <div>
                  <p className="font-semibold text-white">{order.id}</p>
                  <p className="text-sm text-secondary">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    ₩{order.amount.toLocaleString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      statusColors[order.status]
                    }`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Популярные товары</h2>
            <a
              href="/admin/products"
              className="text-sm text-primary hover:underline"
            >
              Смотреть все
            </a>
          </div>

          <div className="space-y-4">
            {[
              { name: "Gold Standard Whey", sales: 234, revenue: 20706000 },
              { name: "BCAA 6400", sales: 156, revenue: 6084000 },
              { name: "Creatine Powder", sales: 143, revenue: 4277000 },
              { name: "THE Pre-Workout", sales: 98, revenue: 4802000 },
            ].map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-lighter rounded-xl"
              >
                <div>
                  <p className="font-semibold text-white">{product.name}</p>
                  <p className="text-sm text-secondary">
                    {product.sales} продаж
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    ₩{product.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
