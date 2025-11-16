"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/types/database";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const loadProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`);

      if (!response.ok) {
        throw new Error("Товар не найден");
      }

      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
      setError(
        error instanceof Error ? error.message : "Ошибка загрузки товара"
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary">Загрузка товара...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Товар не найден
          </h2>
          <p className="text-secondary mb-6">
            {error || "Запрашиваемый товар не существует или был удален"}
          </p>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Вернуться к списку товаров</span>
          </Link>
        </div>
      </div>
    );
  }

  // Success state - show form
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
        <h1 className="text-4xl font-bold text-white mb-2">
          Редактировать товар
        </h1>
        <p className="text-secondary">
          Редактирование: {product.name_ru || product.name_ko}
        </p>
      </div>

      <ProductForm product={product} isEdit={true} />
    </div>
  );
}
