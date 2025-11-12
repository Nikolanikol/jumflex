"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Save,
  Eye,
  Upload,
  X,
  Tag as TagIcon,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  BlogPost,
  BlogCategory,
  BlogTag,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "@/types/blog";
import "easymde/dist/easymde.min.css";

// Динамический импорт markdown редактора (только на клиенте)
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface BlogPostFormProps {
  post?: BlogPost;
  isEdit?: boolean;
}

export default function BlogPostForm({
  post,
  isEdit = false,
}: BlogPostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [showNewTag, setShowNewTag] = useState(false);

  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    cover_image: post?.cover_image || "",
    category_id: post?.category_id || "",
    status: post?.status || "draft",
    meta_title: post?.meta_title || "",
    meta_description: post?.meta_description || "",
  });

  // Настройки для markdown редактора
  const editorOptions = useMemo(() => {
    return {
      spellChecker: false,
      placeholder: "Начните писать свой пост...",
      status: ["lines", "words", "cursor"],
      autosave: {
        enabled: true,
        uniqueId: isEdit ? `blog-post-${post?.id}` : "blog-post-new",
        delay: 1000,
      },
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "|",
        "guide",
      ],
    };
  }, [isEdit, post?.id]);

  useEffect(() => {
    loadCategories();
    loadTags();
    if (post) {
      loadPostTags();
    }
  }, [post]);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/blog/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadTags = async () => {
    try {
      const response = await fetch("/api/blog/tags");
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  };

  const loadPostTags = async () => {
    if (!post) return;
    try {
      const response = await fetch(`/api/blog/posts/${post.slug}`);
      const data = await response.json();
      if (data.tags) {
        setSelectedTags(data.tags.map((tag: BlogTag) => tag.id));
      }
    } catch (error) {
      console.error("Error loading post tags:", error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from title
    if (field === "title" && !isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-zа-яё0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const slug = newTagName
        .toLowerCase()
        .replace(/[^a-zа-яё0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const response = await fetch("/api/admin/blog/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTagName,
          slug,
        }),
      });

      if (response.ok) {
        const newTag = await response.json();
        setTags((prev) => [...prev, newTag]);
        setSelectedTags((prev) => [...prev, newTag.id]);
        setNewTagName("");
        setShowNewTag(false);
      } else {
        alert("Ошибка при создании тега");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
      alert("Ошибка при создании тега");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.content) {
      alert("Заполните обязательные поля: заголовок, slug и контент");
      return;
    }

    setLoading(true);

    try {
      const postData: CreateBlogPostInput | UpdateBlogPostInput = {
        ...formData,
        tag_ids: selectedTags,
      };

      const url = isEdit
        ? `/api/admin/blog/posts/${post?.id}`
        : "/api/admin/blog/posts";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        router.push("/admin/blog");
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "Ошибка при сохранении поста");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Ошибка при сохранении поста");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin/blog"
              className="text-secondary hover:text-primary transition-colors flex items-center gap-2 mb-2"
            >
              <ArrowLeft size={20} />
              Назад к списку
            </Link>
            <h1 className="text-4xl font-bold text-white">
              {isEdit ? "Редактировать пост" : "Создать пост"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="card p-6 border border-dark">
                <label className="block text-sm font-medium text-white mb-2">
                  Заголовок *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="input-field"
                  placeholder="Введите заголовок поста"
                  required
                />
              </div>

              {/* Slug */}
              <div className="card p-6 border border-dark">
                <label className="block text-sm font-medium text-white mb-2">
                  URL (slug) *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  className="input-field"
                  placeholder="url-friendly-slug"
                  required
                />
                <p className="text-xs text-secondary mt-1">
                  URL поста: /blog/{formData.slug || "your-slug"}
                </p>
              </div>

              {/* Excerpt */}
              <div className="card p-6 border border-dark">
                <label className="block text-sm font-medium text-white mb-2">
                  Краткое описание
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleChange("excerpt", e.target.value)}
                  className="input-field min-h-[100px]"
                  placeholder="Краткое описание поста (опционально)"
                />
              </div>

              {/* Content - Markdown Editor */}
              <div className="card p-6 border border-dark">
                <label className="block text-sm font-medium text-white mb-2">
                  Контент *
                </label>
                <div className="markdown-editor">
                  <SimpleMDE
                    value={formData.content}
                    onChange={(value) => handleChange("content", value)}
                    // options={editorOptions}
                  />
                </div>
              </div>

              {/* SEO Section */}
              <div className="card p-6 border border-dark">
                <h3 className="text-xl font-bold text-white mb-4">
                  SEO настройки
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.meta_title}
                      onChange={(e) =>
                        handleChange("meta_title", e.target.value)
                      }
                      className="input-field"
                      placeholder="SEO заголовок (опционально)"
                      maxLength={60}
                    />
                    <p className="text-xs text-secondary mt-1">
                      {formData.meta_title.length}/60 символов
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.meta_description}
                      onChange={(e) =>
                        handleChange("meta_description", e.target.value)
                      }
                      className="input-field min-h-[80px]"
                      placeholder="SEO описание (опционально)"
                      maxLength={160}
                    />
                    <p className="text-xs text-secondary mt-1">
                      {formData.meta_description.length}/160 символов
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Actions */}
              <div className="card p-6 border border-dark">
                <h3 className="text-lg font-bold text-white mb-4">
                  Публикация
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Статус
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="input-field"
                    >
                      <option value="draft">Черновик</option>
                      <option value="published">Опубликован</option>
                      <option value="archived">Архив</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1"
                    >
                      {loading ? (
                        "Сохранение..."
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Сохранить</span>
                        </>
                      )}
                    </button>
                    {formData.slug && (
                      <Link
                        href={`/blog/${formData.slug}`}
                        target="_blank"
                        className="btn-outline"
                        title="Предпросмотр"
                      >
                        <Eye size={18} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="card p-6 border border-dark">
                <h3 className="text-lg font-bold text-white mb-4">Обложка</h3>

                <div className="space-y-4">
                  {formData.cover_image && (
                    <div className="relative">
                      <img
                        src={formData.cover_image}
                        alt="Cover"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleChange("cover_image", "")}
                        className="absolute top-2 right-2 p-2 bg-dark/80 hover:bg-dark rounded-lg transition-colors"
                      >
                        <X size={18} className="text-white" />
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      URL изображения
                    </label>
                    <input
                      type="url"
                      value={formData.cover_image}
                      onChange={(e) =>
                        handleChange("cover_image", e.target.value)
                      }
                      className="input-field"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-secondary mt-1">
                      Вставьте URL изображения или загрузите через Supabase
                      Storage
                    </p>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="card p-6 border border-dark">
                <h3 className="text-lg font-bold text-white mb-4">Категория</h3>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleChange("category_id", e.target.value)}
                  className="input-field"
                >
                  <option value="">Без категории</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_ru}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="card p-6 border border-dark">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Теги</h3>
                  <button
                    type="button"
                    onClick={() => setShowNewTag(!showNewTag)}
                    className="text-primary hover:text-primary-dark transition-colors text-sm flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Новый тег
                  </button>
                </div>

                {showNewTag && (
                  <div className="mb-4 p-3 bg-light rounded-lg border border-dark">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Название тега"
                      className="input-field mb-2"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateTag();
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCreateTag}
                        className="btn-primary text-sm flex-1"
                      >
                        Создать
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewTag(false);
                          setNewTagName("");
                        }}
                        className="btn-outline text-sm"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm border transition-all ${
                        selectedTags.includes(tag.id)
                          ? "bg-primary/20 text-primary border-primary"
                          : "bg-dark text-secondary border-dark hover:border-primary"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>

                {tags.length === 0 && (
                  <p className="text-secondary text-sm text-center py-4">
                    Теги еще не созданы
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

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
          min-height: 400px;
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
    </div>
  );
}
