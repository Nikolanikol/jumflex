"use client";

import Link from "next/link";

export default function AdminHeader({ userName }: { userName: string }) {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-yellow-400">Админ панель</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{userName}</span>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              На сайт →
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
