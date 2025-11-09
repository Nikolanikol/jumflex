"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/database";
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name_ko: "",
    name_ru: "",
    name_en: "",
    slug: "",
    image_url: "",
    description: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Ошибка загрузки категорий");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name_ko: category.name_ko || "",
        name_ru: category.name_ru || "",
        name_en: category.name_en || "",
        slug: category.slug || "",
        image_url: category.image_url || "",
        description: category.description || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name_ko: "",
        name_ru: "",
        name_en: "",
        slug: "",
        image_url: "",
        description: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug from name_ko
    if (field === "name_ko" && !editingCategory) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_ko || !formData.slug) {
      toast.error("Заполните обязательные поля");
      return;
    }

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save category");
      }

      toast.success(
        editingCategory ? "Категория обновлена" : "Категория создана"
      );

      handleCloseModal();
      loadCategories();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(error.message || "Ошибка сохранения");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить категорию? Это действие нельзя отменить.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete category");
      }

      toast.success("Категория удалена");
      loadCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(error.message || "Ошибка удаления");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-secondary">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Управление категориями
          </h1>
          <p className="text-secondary">Всего категорий: {categories.length}</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Добавить категорию
        </button>
      </div>

      {/* Categories Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-darker border-b border-dark">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Изображение
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Название (KO)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Название (RU)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Название (EN)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark">
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-darker transition-colors"
                >
                  <td className="px-6 py-4">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name_ko}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-light rounded-lg flex items-center justify-center">
                        <ImageIcon size={20} className="text-secondary" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">
                      {category.name_ko}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-secondary">
                      {category.name_ru || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-secondary">
                      {category.name_en || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-primary bg-light px-2 py-1 rounded">
                      {category.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(category)}
                        className="p-2 text-secondary hover:text-primary hover:bg-light rounded-lg transition-all"
                        title="Редактировать"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-secondary hover:text-accent hover:bg-light rounded-lg transition-all"
                        title="Удалить"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-secondary">
                      <p className="text-lg mb-2">Категории не найдены</p>
                      <p className="text-sm">
                        Создайте первую категорию для вашего магазина
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-dark">
              <h2 className="text-2xl font-bold text-white">
                {editingCategory
                  ? "Редактировать категорию"
                  : "Новая категория"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-secondary hover:text-primary hover:bg-light rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Korean Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Название (Корейский) *
                </label>
                <input
                  type="text"
                  value={formData.name_ko}
                  onChange={(e) => handleChange("name_ko", e.target.value)}
                  className="input-field"
                  placeholder="단백질"
                  required
                />
              </div>

              {/* Russian Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Название (Русский)
                </label>
                <input
                  type="text"
                  value={formData.name_ru}
                  onChange={(e) => handleChange("name_ru", e.target.value)}
                  className="input-field"
                  placeholder="Протеин"
                />
              </div>

              {/* English Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Название (Английский)
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => handleChange("name_en", e.target.value)}
                  className="input-field"
                  placeholder="Protein"
                />
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
                  placeholder="protein"
                  required
                />
                <p className="text-xs text-secondary mt-1">
                  Только латинские буквы, цифры и дефисы
                </p>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  URL изображения
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => handleChange("image_url", e.target.value)}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <div className="mt-3">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="input-field min-h-[100px]"
                  placeholder="Описание категории..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-6 border-t border-dark">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={20} />
                  {editingCategory ? "Сохранить" : "Создать"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
