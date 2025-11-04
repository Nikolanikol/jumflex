import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span>Назад к списку</span>
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">Добавить товар</h1>
        <p className="text-secondary">Создание нового товара в каталоге</p>
      </div>

      <ProductForm />
    </div>
  );
}
