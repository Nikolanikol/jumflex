"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Menu,
  User,
  X,
  LogOut,
  Heart,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useWishlistStore } from "@/store/wishlist";

export default function Header() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Получаем данные из store только на клиенте
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalWishlist = useWishlistStore((state) => state.getTotalItems());

  // Устанавливаем флаг после монтирования на клиенте
  useEffect(() => {
    setMounted(true);
  }, []);

  // До монтирования показываем placeholder
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-darker/95 backdrop-blur-lg border-b border-dark shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl md:text-3xl font-bold flex items-center gap-3"
            >
              <span className="text-primary">FIT</span>
              <span className="text-white">STORE</span>
            </Link>

            {/* Search bar - desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  className="input-field pr-12"
                  disabled
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Right icons - placeholder */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-secondary">
                <div className="p-2 rounded-full border-2 border-gray-200">
                  <User size={20} />
                </div>
              </div>

              <div className="relative p-2 rounded-lg bg-light">
                <ShoppingCart size={20} className="text-secondary" />
              </div>

              <div className="relative p-2 rounded-full border-2 border-gray-200">
                <Heart size={20} className="text-secondary" />
              </div>

              <button className="md:hidden p-2 rounded-lg bg-light">
                <Menu size={20} className="text-secondary" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 py-3 border-t border-dark">
            {/* Каталог с dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-light transition-all">
                Каталог
                <svg
                  className="w-4 h-4 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown меню */}
              <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100   group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {[
                    { name: "Протеин", slug: "protein", icon: "💪" },
                    { name: "Аминокислоты", slug: "amino-acids", icon: "🧬" },
                    { name: "Гейнеры", slug: "gainers", icon: "📈" },
                    { name: "Креатин", slug: "creatine", icon: "⚡" },
                    { name: "Предтреники", slug: "pre-workout", icon: "🔥" },
                    { name: "Все продукты", slug: "", icon: "🛍️" },
                  ].map((item) => (
                    <Link
                      key={item.slug}
                      href={`/products${
                        item.slug ? `?category=${item.slug}` : ""
                      }`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-secondary hover:text-primary hover:bg-light transition-all"
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Блог */}
            <Link
              href="/blog"
              className="px-4 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-light transition-all"
            >
              Блог
            </Link>

            {/* Дополнительные разделы (опционально) */}
            <Link
              href="/about"
              className="px-4 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-light transition-all"
            >
              О нас
            </Link>

            {/* <Link
              href="/contacts"
              className="px-4 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-light transition-all"
            >
              Контакты
            </Link> */}
          </nav>
        </div>
      </header>
    );
  }

  // После монтирования показываем полную версию
  return (
    <header className="sticky top-0 z-50 bg-darker/95 backdrop-blur-lg border-b border-dark shadow-lg">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl md:text-3xl font-bold flex items-center gap-3"
          >
            <span className="text-primary">FIT</span>
            <span className="text-white">STORE</span>
          </Link>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск товаров..."
                className="input-field pr-12"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary-dark transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/account"
                  className="flex items-center gap-2 hover:text-primary transition-all group"
                >
                  <div className="p-2 rounded-full border-2 border-gray-200 group-hover:border-primary transition-all">
                    <User size={20} />
                  </div>
                  <span className="text-sm font-medium">
                    {session.user?.name || "Аккаунт"}
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 rounded-full hover:bg-light transition-all"
                  title="Выйти"
                >
                  <LogOut
                    size={20}
                    className="text-secondary hover:text-accent"
                  />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="hidden md:flex items-center gap-2 text-secondary hover:text-primary transition-all group"
              >
                <div className="p-2 rounded-full border-2 border-gray-200 group-hover:border-primary transition-all">
                  <User size={20} />
                </div>
                <span className="text-sm font-medium">Войти</span>
              </Link>
            )}

            <Link
              href="/cart"
              className="relative p-2 rounded-lg bg-light hover:bg-lighter transition-all"
            >
              <ShoppingCart
                size={20}
                className="text-secondary hover:text-primary transition-colors"
              />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-glow">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 rounded-lg bg-light hover:bg-lighter transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X size={20} className="text-primary" />
              ) : (
                <Menu size={20} className="text-secondary" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex md:flex items-center gap-6 py-3 border-t border-dark">
          {/* Каталог с dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-light transition-all">
              Каталог
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown меню */}
            <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                {[
                  { name: "Протеин", slug: "protein", icon: "💪" },
                  { name: "Аминокислоты", slug: "amino-acids", icon: "🧬" },
                  { name: "Гейнеры", slug: "gainers", icon: "📈" },
                  { name: "Креатин", slug: "creatine", icon: "⚡" },
                  { name: "Предтреники", slug: "pre-workout", icon: "🔥" },
                  { name: "Все продукты", slug: "", icon: "🛍️" },
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/products${
                      item.slug ? `?category=${item.slug}` : ""
                    }`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-secondary hover:text-primary hover:bg-light transition-all"
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Блог */}
          <Link
            href="/blog"
            className="px-4 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-light transition-all"
          >
            Блог
          </Link>

          {/* Дополнительные разделы (опционально) */}
          <Link
            href="/about"
            className="px-4 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-light transition-all"
          >
            О нас
          </Link>

          {/* <Link
            href="/contacts"
            className="px-4 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-light transition-all"
          >
            Контакты
          </Link> */}
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark">
            {/* Mobile search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск товаров..."
                  className="input-field pr-12"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Mobile navigation */}
            <div className="flex flex-col gap-2">
              {[
                { name: "Протеин", slug: "protein" },
                { name: "Аминокислоты", slug: "amino-acids" },
                { name: "Гейнеры", slug: "gainers" },
                { name: "Креатин", slug: "creatine" },
                { name: "Предтреники", slug: "pre-workout" },
                { name: "Витамины", slug: "vitamins" },
              ].map((item) => (
                <Link
                  key={item.slug}
                  href={`/products?category=${item.slug}`}
                  className="py-3 px-4 rounded-lg bg-light hover:bg-lighter hover:text-primary transition-all font-medium text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/account"
                className="py-3 px-4 rounded-lg bg-light hover:bg-lighter hover:text-primary transition-all font-medium text-sm border-t border-dark mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Мой аккаунт
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
