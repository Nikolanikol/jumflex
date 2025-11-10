// import AdminHeader from "@/components/admin/AdminHeader";
// import AdminSidebar from "@/components/admin/AdminSidebar";
// import { requireAdmin } from "@/lib/auth";

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await requireAdmin();

//   return (
//     <div className="min-h-screen bg-gray-950">
//       <AdminHeader userName={session.user.name || session.user.email} />

//       <div className="flex">
//         <AdminSidebar />
//         <main className="flex-1 p-8">{children}</main>
//       </div>
//     </div>
//   );
// }
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Layers,
} from "lucide-react";

const navigation = [
  { name: "Дашборд", href: "/admin", icon: LayoutDashboard },
  { name: "Товары", href: "/admin/products", icon: Package },
  { name: "Категории", href: "/admin/categories", icon: Layers },
  { name: "Заказы", href: "/admin/orders", icon: ShoppingCart },
  { name: "Пользователи", href: "/admin/users", icon: Users },
  // { name: "Настройки", href: "/admin/settings", icon: Settings }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform">
        <div className="h-full px-3 py-4 overflow-y-auto bg-darker border-r border-dark">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2 mb-8 px-3">
            <span className="text-2xl font-bold text-primary">FIT</span>
            <span className="text-2xl font-bold text-white">ADMIN</span>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-secondary hover:text-primary hover:bg-light rounded-lg transition-all group"
                >
                  <Icon
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="absolute bottom-4 left-0 right-0 px-3">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 text-secondary hover:text-primary hover:bg-light rounded-lg transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Вернуться на сайт</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
