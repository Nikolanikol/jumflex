"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, ArrowLeft, FileText } from "lucide-react";
import { BlogCategory, CreateBlogCategoryInput } from "@/types/blog";

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null
  );
  const [formData, setFormData] = useState({
    name_ko: "",
    name_ru: "",
    name_en: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blog/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_ko || !formData.name_ru || !formData.slug) {
      alert("Заполните обязательные поля");
      return;
    }

    try {
      const url = editingCategory
        ? `/api/admin/blog/categories/${editingCategory.id}`
        : "/api/admin/blog/categories";

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        loadCategories();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Ошибка при сохранении категории");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Ошибка при сохранении категории");
    }
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormData({
      name_ko: category.name_ko,
      name_ru: category.name_ru,
      name_en: category.name_en,
      slug: category.slug,
      description: category.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту категорию?")) return;

    try {
      const response = await fetch(`/api/admin/blog/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadCategories();
      } else {
        const error = await response.json();
        alert(error.error || "Ошибка при удалении категории");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Ошибка при удалении категории");
    }
  };

  const resetForm = () => {
    setFormData({
      name_ko: "",
      name_ru: "",
      name_en: "",
      slug: "",
      description: "",
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/blog"
            className="text-secondary hover:text-primary transition-colors flex items-center gap-2 mb-2"
          >
            <ArrowLeft size={20} />
            Назад к блогу
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Управление категориями
              </h1>
              <p className="text-secondary">
                Добавляйте и редактируйте категории блога
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
            >
              <Plus size={20} />
              <span>Добавить категорию</span>
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card p-6 border border-dark mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingCategory ? "Редактировать категорию" : "Новая категория"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Название (한국어) *
                  </label>
                  <input
                    type="text"
                    value={formData.name_ko}
                    onChange={(e) =>
                      setFormData({ ...formData, name_ko: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Название (Русский) *
                  </label>
                  <input
                    type="text"
                    value={formData.name_ru}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        name_ru: value,
                        slug: editingCategory
                          ? formData.slug
                          : value
                              .toLowerCase()
                              .replace(/[^a-zа-яё0-9]+/g, "-")
                              .replace(/(^-|-$)/g, ""),
                      });
                    }}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Название (English) *
                  </label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) =>
                      setFormData({ ...formData, name_en: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input-field min-h-[80px]"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  {editingCategory ? "Обновить" : "Создать"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-outline"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="card border border-dark overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-secondary">Загрузка...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="text-secondary mx-auto mb-4" />
              <p className="text-white text-lg mb-2">Категорий пока нет</p>
              <p className="text-secondary mb-6">
                Создайте первую категорию блога
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light border-b border-dark">
                  <tr>
                    <th className="text-left p-4 text-white font-semibold">
                      Название (RU)
                    </th>
                    <th className="text-left p-4 text-white font-semibold">
                      Slug
                    </th>
                    <th className="text-left p-4 text-white font-semibold">
                      Постов
                    </th>
                    <th className="text-right p-4 text-white font-semibold">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category: any) => (
                    <tr
                      key={category.id}
                      className="border-b border-dark hover:bg-light transition-colors"
                    >
                      <td className="p-4">
                        <p className="text-white font-medium">
                          {category.name_ru}
                        </p>
                        {category.description && (
                          <p className="text-secondary text-sm mt-1">
                            {category.description}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-secondary text-sm">
                          {category.slug}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-secondary text-sm">
                          {category.posts_count || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 hover:bg-dark rounded-lg transition-colors text-secondary hover:text-primary"
                            title="Редактировать"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 hover:bg-dark rounded-lg transition-colors text-secondary hover:text-accent"
                            title="Удалить"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
