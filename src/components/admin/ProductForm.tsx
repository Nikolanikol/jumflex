"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Category, Brand, Product } from "@/types/database";
import { Save, X } from "lucide-react";
import ImageUpload from "./ImageUpload";
import "easymde/dist/easymde.min.css";

// Динамический импорт markdown редактора (только на клиенте)
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

export default function ProductForm({
  product,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [formData, setFormData] = useState({
    name_ko: product?.name_ko || "",
    name_ru: product?.name_ru || "",
    name_en: product?.name_en || "",
    slug: product?.slug || "",
    description_ko: product?.description_ko || "",
    description_ru: product?.description_ru || "",
    description_en: product?.description_en || "",
    category_id: product?.category_id || "",
    brand_id: product?.brand_id || "",
    price: product?.price || 0,
    discount_price: product?.discount_price || 0,
    stock_quantity: product?.stock_quantity || 0,
    ingredients: product?.ingredients || "",
    usage_instructions: product?.usage_instructions || "",
    is_featured: product?.is_featured || false,
    is_new: product?.is_new || false,
  });

  const [images, setImages] = useState<string[]>(product?.images || []);

  useEffect(() => {
    loadCategories();
    loadBrands();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await fetch("/api/brands");
      const data = await response.json();
      setBrands(data || []);
    } catch (error) {
      console.error("Error loading brands:", error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from name_ru
    if (field === "name_ru" && !isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_ko || !formData.slug || !formData.price) {
      alert("Заполните обязательные поля");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        images: images,
        price: Number(formData.price),
        discount_price: Number(formData.discount_price) || null,
        stock_quantity: Number(formData.stock_quantity),
      };

      const url = isEdit
        ? `/api/admin/products/${product?.id}`
        : "/api/admin/products";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert(isEdit ? "Товар обновлен" : "Товар создан");
        router.push("/admin/products");
      } else {
        const data = await response.json();
        alert(data.error || "Ошибка при сохранении");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          Основная информация
        </h2>

        <div className="space-y-4">
          {/* Names */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* <div>
              <label className="block text-sm font-medium text-white mb-2">
                Название (한국어) *
              </label>
              <input
                type="text"
                value={formData.name_ko}
                onChange={(e) => handleChange("name_ko", e.target.value)}
                className="input-field"
                required
              />
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium text-white mb-2">
                Название (Русский)
              </label>
              <input
                type="text"
                value={formData.name_ru}
                onChange={(e) => handleChange("name_ru", e.target.value)}
                className="input-field"
              />
            </div> */}
            <div className="col-span-3">
              <label className="block  text-sm font-medium text-white mb-2">
                Название
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => handleChange("name_en", e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              URL (slug) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              className="input-field"
              placeholder="product-slug"
              required
            />
            <p className="text-xs text-secondary mt-1">
              Только латинские буквы, цифры и дефисы
            </p>
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Категория
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => handleChange("category_id", e.target.value)}
                className="input-field"
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_ru || cat.name_ko}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Бренд
              </label>
              <select
                value={formData.brand_id}
                onChange={(e) => handleChange("brand_id", e.target.value)}
                className="input-field"
              >
                <option value="">Выберите бренд</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descriptions with Markdown Editor */}
          <div className="space-y-4">
            {/* <div>
              <label className="block text-sm font-medium text-white mb-2">
                Описание (한국어)
              </label>
              <div className="markdown-editor">
                <SimpleMDE
                  value={formData.description_ko}
                  onChange={(value) => handleChange("description_ko", value)}
                />
              </div>
            </div> */}

            {/* <div>
              <label className="block text-sm font-medium text-white mb-2">
                Описание (Русский)
              </label>
              <div className="markdown-editor">
                <SimpleMDE
                  value={formData.description_ru}
                  onChange={(value) => handleChange("description_ru", value)}
                />
              </div>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Описание
              </label>
              <div className="markdown-editor">
                <SimpleMDE
                  value={formData.description_en}
                  onChange={(value) => handleChange("description_en", value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price & Stock */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-6">Цена и остаток</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Цена (₩) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="input-field"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Цена со скидкой (₩)
            </label>
            <input
              type="number"
              value={formData.discount_price}
              onChange={(e) => handleChange("discount_price", e.target.value)}
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Остаток (шт) *
            </label>
            <input
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => handleChange("stock_quantity", e.target.value)}
              className="input-field"
              min="0"
              required
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          Изображения товара
        </h2>
        <ImageUpload images={images} onChange={setImages} maxImages={10} />
      </div>

      {/* Additional Info */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          Дополнительная информация
        </h2>

        <div className="space-y-6">
          {/* Ingredients with Markdown Editor */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Состав
            </label>
            <div className="markdown-editor">
              <SimpleMDE
                value={formData.ingredients}
                onChange={(value) => handleChange("ingredients", value)}
              />
            </div>
            <p className="text-xs text-secondary mt-2">
              💡 Совет: используйте списки для ингредиентов, таблицы для пищевой
              ценности
            </p>
          </div>

          {/* Usage Instructions with Markdown Editor */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Способ применения
            </label>
            <div className="markdown-editor">
              <SimpleMDE
                value={formData.usage_instructions}
                onChange={(value) => handleChange("usage_instructions", value)}
              />
            </div>
            <p className="text-xs text-secondary mt-2">
              💡 Совет: используйте нумерованные списки (1. 2. 3.) для пошаговых
              инструкций
            </p>
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-6">Статусы</h2>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => handleChange("is_featured", e.target.checked)}
              className="w-5 h-5 rounded border-2 border-dark bg-light checked:bg-primary"
            />
            <span className="text-white">Хит продаж (Featured)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_new}
              onChange={(e) => handleChange("is_new", e.target.checked)}
              className="w-5 h-5 rounded border-2 border-dark bg-light checked:bg-primary"
            />
            <span className="text-white">Новинка (New)</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline flex items-center gap-2"
        >
          <X size={18} />
          <span>Отмена</span>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Сохранение...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>{isEdit ? "Сохранить изменения" : "Создать товар"}</span>
            </>
          )}
        </button>
      </div>

      {/* Стили для markdown редактора */}
      <style jsx global>{`
        .markdown-editor .EasyMDEContainer {
          background: var(--color-bg-light);
          border-radius: 12px;
        }

        .markdown-editor .EasyMDEContainer .CodeMirror {
          background: var(--color-bg-light);
          color: var(--color-text-primary);
          border: 1.5px solid var(--color-border);
          border-radius: 12px;
          padding: 10px;
          font-size: 14px;
          min-height: 300px;
        }

        .markdown-editor .editor-toolbar {
          background: var(--color-bg-light);
          border: 1.5px solid var(--color-border);
          border-bottom: none;
          border-radius: 12px 12px 0 0;
        }

        .markdown-editor .editor-toolbar button {
          color: var(--color-text-secondary) !important;
        }

        .markdown-editor .editor-toolbar button:hover,
        .markdown-editor .editor-toolbar button.active {
          background: var(--color-bg-dark);
          border-color: var(--color-primary);
          color: var(--color-primary) !important;
        }

        .markdown-editor .CodeMirror-cursor {
          border-left-color: var(--color-primary);
        }

        .markdown-editor .editor-statusbar {
          color: var(--color-text-secondary);
          background: var(--color-bg-light);
          border: 1.5px solid var(--color-border);
          border-top: none;
          border-radius: 0 0 12px 12px;
        }

        .markdown-editor .editor-preview,
        .markdown-editor .editor-preview-side {
          background: var(--color-bg-light);
          color: var(--color-text-primary);
        }
      `}</style>
    </form>
  );
}
