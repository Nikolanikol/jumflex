"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, ArrowLeft, Tag } from "lucide-react";
import { BlogTag, CreateBlogTagInput } from "@/types/blog";

export default function BlogTagsPage() {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blog/tags");
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error loading tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      alert("Заполните все поля");
      return;
    }

    try {
      const response = await fetch("/api/admin/blog/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        loadTags();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Ошибка при создании тега");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
      alert("Ошибка при создании тега");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот тег?")) return;

    try {
      const response = await fetch(`/api/admin/blog/tags/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadTags();
      } else {
        const error = await response.json();
        alert(error.error || "Ошибка при удалении тега");
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert("Ошибка при удалении тега");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="container mx-auto px-4 max-w-4xl">
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
                Управление тегами
              </h1>
              <p className="text-secondary">
                Добавляйте и удаляйте теги для постов
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
            >
              <Plus size={20} />
              <span>Добавить тег</span>
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card p-6 border border-dark mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Новый тег</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Название *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        name: value,
                        slug: value
                          .toLowerCase()
                          .replace(/[^a-zа-яё0-9]+/g, "-")
                          .replace(/(^-|-$)/g, ""),
                      });
                    }}
                    className="input-field"
                    placeholder="Название тега"
                    required
                  />
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
                    placeholder="tag-slug"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  Создать
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

        {/* Tags List */}
        <div className="card border border-dark p-6">
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-secondary">Загрузка...</p>
            </div>
          ) : tags.length === 0 ? (
            <div className="py-12 text-center">
              <Tag size={48} className="text-secondary mx-auto mb-4" />
              <p className="text-white text-lg mb-2">Тегов пока нет</p>
              <p className="text-secondary mb-6">Создайте первый тег блога</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {tags.map((tag: any) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 px-4 py-2 bg-light border border-dark rounded-full group hover:border-primary transition-all"
                >
                  <span className="text-white">{tag.name}</span>
                  <span className="text-secondary text-sm">
                    ({tag.posts_count || 0})
                  </span>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="ml-2 p-1 hover:bg-dark rounded-full transition-colors text-secondary hover:text-accent"
                    title="Удалить"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
