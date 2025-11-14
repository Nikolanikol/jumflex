import { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Страница не найдена | FitStore",
  description: "Запрашиваемая страница не найдена",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-darker flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">
          Страница не найдена
        </h2>
        <p className="text-secondary mb-8">
          К сожалению, запрашиваемая страница не существует или была удалена
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          <Home size={20} />
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
