"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Category, Brand, Product } from "@/types/database";
import { Save, X, Upload } from "lucide-react";
import ImageUpload from "./ImageUpload";
import toast from "react-hot-toast";

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
    images: product?.images?.join("\n") || "",
    ingredients: product?.ingredients || "",
    usage_instructions: product?.usage_instructions || "",
    is_featured: product?.is_featured || false,
    is_new: product?.is_new || false,
  });
  // Замените состояние images:
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
        toast.success(isEdit ? "Товар обновлен" : "Товар создан");

        router.push("/admin/products");
      } else {
        const data = await response.json();
        toast.error("Ошибка при сохранении товара");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Ошибка при сохранении товара");
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
            <div>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Название (Русский)
              </label>
              <input
                type="text"
                value={formData.name_ru}
                onChange={(e) => handleChange("name_ru", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Название (English)
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

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Описание (한국어)
              </label>
              <textarea
                value={formData.description_ko}
                onChange={(e) => handleChange("description_ko", e.target.value)}
                rows={4}
                className="input-field resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Описание (Русский)
              </label>
              <textarea
                value={formData.description_ru}
                onChange={(e) => handleChange("description_ru", e.target.value)}
                rows={4}
                className="input-field resize-none"
              />
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Состав
            </label>
            <textarea
              value={formData.ingredients}
              onChange={(e) => handleChange("ingredients", e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="Сывороточный протеин, ароматизаторы..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Способ применения
            </label>
            <textarea
              value={formData.usage_instructions}
              onChange={(e) =>
                handleChange("usage_instructions", e.target.value)
              }
              rows={3}
              className="input-field resize-none"
              placeholder="Принимайте 1 порцию после тренировки..."
            />
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
    </form>
  );
}
