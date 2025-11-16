import Link from "next/link";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  MapPin,
} from "lucide-react";

const navigation = [
  { name: "Профиль", href: "/account", icon: User },
  { name: "Мои заказы", href: "/account/orders", icon: ShoppingBag },
  // { name: "Избранное", href: "/account/wishlist", icon: Heart },
  //   { name: "Адреса доставки", href: "/account/addresses", icon: MapPin },
  //   { name: "Настройки", href: "/account/settings", icon: Settings },
];
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="card p-4 sticky top-24">
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-primary hover:bg-light rounded-lg transition-all group"
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
            </div>
          </aside>

          {/* Main content */}
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
