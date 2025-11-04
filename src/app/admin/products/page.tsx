"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Product } from "@/types/database";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=50");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот товар?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
        alert("Товар удален");
      } else {
        alert("Ошибка при удалении");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Ошибка при удалении");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.name_ru?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (product.name_ko?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Товары</h1>
          <p className="text-secondary">Управление товарами магазина</p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Добавить товар</span>
        </Link>
      </div>

      {/* Search */}
      <div className="card p-6 mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск товаров..."
            className="input-field pr-10"
          />
          <Search
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-lighter border-b border-dark">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Товар
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Категория
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Цена
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Остаток
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Статус
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-secondary"
                  >
                    Загрузка...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-secondary"
                  >
                    Товары не найдены
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-lighter transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-lighter rounded-lg overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name_ru || product.name_ko}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted text-xs">
                              Нет фото
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white line-clamp-1">
                            {product.name_ru || product.name_ko}
                          </p>
                          {product.brand && (
                            <p className="text-sm text-secondary">
                              {product.brand.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-secondary">
                        {product.category?.name_ru ||
                          product.category?.name_ko ||
                          "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">
                          ₩
                          {(
                            product.discount_price || product.price
                          ).toLocaleString()}
                        </p>
                        {product.discount_price && (
                          <p className="text-xs text-muted line-through">
                            ₩{product.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`${
                          product.stock_quantity > 10
                            ? "text-green-400"
                            : product.stock_quantity > 0
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {product.stock_quantity} шт
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.is_featured && (
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                            ХИТ
                          </span>
                        )}
                        {product.is_new && (
                          <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-lighter rounded-lg transition-colors"
                          title="Просмотр"
                        >
                          <Eye size={18} className="text-secondary" />
                        </Link>
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="p-2 hover:bg-lighter rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <Edit size={18} className="text-primary" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-lighter rounded-lg transition-colors"
                          title="Удалить"
                        >
                          <Trash2 size={18} className="text-accent" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
