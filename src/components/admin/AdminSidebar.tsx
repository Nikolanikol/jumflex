"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Дашборд", href: "/admin", icon: "📊" },
  { name: "Товары", href: "/admin/products", icon: "📦" },
  { name: "Заказы", href: "/admin/orders", icon: "🛒" },
  { name: "Пользователи", href: "/admin/users", icon: "👥" },
  { name: "Категории", href: "/admin/categories", icon: "📁" },
  { name: "Настройки", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${
              isActive(item.href)
                ? "bg-gray-800 text-yellow-400"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
