import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-light flex items-center justify-center">
          <SearchX size={48} className="text-muted" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Товар не найден</h1>
        <p className="text-secondary mb-8">
          Этот товар не существует или был удален
        </p>
        <Link href="/products" className="btn-primary">
          Вернуться в каталог
        </Link>
      </div>
    </div>
  );
}
