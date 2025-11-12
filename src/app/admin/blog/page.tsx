"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Calendar,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";
import { BlogPostPreview, BlogPostsResponse } from "@/types/blog";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadPosts();
  }, [currentPage, statusFilter]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`/api/blog/posts?${params.toString()}`);
      const data: BlogPostsResponse = await response.json();

      setPosts(data.posts as BlogPostPreview[]);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот пост?")) return;

    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadPosts();
      } else {
        alert("Ошибка при удалении поста");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Ошибка при удалении поста");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: "bg-green-500/20 text-green-400 border-green-500/30",
      draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      archived: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };

    const labels = {
      published: "Опубликован",
      draft: "Черновик",
      archived: "Архив",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Управление блогом
            </h1>
            <p className="text-secondary">
              Создавайте и редактируйте посты блога
            </p>
          </div>
          <Link href="/admin/blog/new" className="btn-primary">
            <Plus size={20} />
            <span>Создать пост</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 border border-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm mb-1">Всего постов</p>
                <p className="text-3xl font-bold text-white">{posts.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <FileText className="text-primary" />
              </div>
            </div>
          </div>

          <div className="card p-6 border border-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm mb-1">Опубликовано</p>
                <p className="text-3xl font-bold text-white">
                  {posts.filter((p) => p.status === "published").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Eye className="text-green-400" />
              </div>
            </div>
          </div>

          <div className="card p-6 border border-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm mb-1">Черновики</p>
                <p className="text-3xl font-bold text-white">
                  {posts.filter((p) => p.status === "draft").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Edit className="text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="card p-6 border border-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm mb-1">Всего просмотров</p>
                <p className="text-3xl font-bold text-white">
                  {posts.reduce((sum, p) => sum + p.views_count, 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <TrendingUp className="text-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 border border-dark mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по заголовку..."
                  className="input-field pr-12"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary-dark transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-secondary" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="input-field min-w-[200px]"
              >
                <option value="all">Все статусы</option>
                <option value="published">Опубликованные</option>
                <option value="draft">Черновики</option>
                <option value="archived">Архив</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="card border border-dark overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-secondary">Загрузка...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="text-secondary mx-auto mb-4" />
              <p className="text-white text-lg mb-2">Постов пока нет</p>
              <p className="text-secondary mb-6">
                Создайте свой первый пост блога
              </p>
              <Link href="/admin/blog/new" className="btn-primary inline-flex">
                <Plus size={20} />
                <span>Создать пост</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-light border-b border-dark">
                    <tr>
                      <th className="text-left p-4 text-white font-semibold">
                        Заголовок
                      </th>
                      <th className="text-left p-4 text-white font-semibold">
                        Автор
                      </th>
                      <th className="text-left p-4 text-white font-semibold">
                        Категория
                      </th>
                      <th className="text-left p-4 text-white font-semibold">
                        Статус
                      </th>
                      <th className="text-left p-4 text-white font-semibold">
                        Просмотры
                      </th>
                      <th className="text-left p-4 text-white font-semibold">
                        Дата
                      </th>
                      <th className="text-right p-4 text-white font-semibold">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr
                        key={post.id}
                        className="border-b border-dark hover:bg-light transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            {post.cover_image && (
                              <img
                                src={post.cover_image}
                                alt={post.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <Link
                                href={`/admin/blog/${post.id}/edit`}
                                className="text-white font-medium hover:text-primary transition-colors line-clamp-2"
                              >
                                {post.title}
                              </Link>
                              {post.excerpt && (
                                <p className="text-secondary text-sm mt-1 line-clamp-1">
                                  {post.excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-white text-sm">
                            {post.author.name}
                          </p>
                        </td>
                        <td className="p-4">
                          {post.category ? (
                            <span className="text-secondary text-sm">
                              {post.category.name_ru}
                            </span>
                          ) : (
                            <span className="text-secondary text-sm italic">
                              Без категории
                            </span>
                          )}
                        </td>
                        <td className="p-4">{getStatusBadge(post.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-secondary">
                            <Eye size={16} />
                            <span className="text-sm">{post.views_count}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-secondary text-sm">
                            <Calendar size={16} />
                            <span>
                              {new Date(
                                post.published_at || post.created_at
                              ).toLocaleDateString("ru-RU")}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-2 hover:bg-dark rounded-lg transition-colors text-secondary hover:text-primary"
                              title="Просмотреть"
                            >
                              <Eye size={18} />
                            </Link>
                            <Link
                              href={`/admin/blog/${post.id}/edit`}
                              className="p-2 hover:bg-dark rounded-lg transition-colors text-secondary hover:text-primary"
                              title="Редактировать"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(post.id)}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-dark flex items-center justify-between">
                  <p className="text-secondary text-sm">
                    Страница {currentPage} из {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Назад
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Вперед
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link
            href="/admin/blog/categories"
            className="card p-6 border border-dark hover:border-primary transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  Управление категориями
                </h3>
                <p className="text-secondary">
                  Добавляйте и редактируйте категории блога
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <FileText className="text-primary" />
              </div>
            </div>
          </Link>

          <Link
            href="/admin/blog/tags"
            className="card p-6 border border-dark hover:border-primary transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  Управление тегами
                </h3>
                <p className="text-secondary">
                  Добавляйте и редактируйте теги для постов
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <FileText className="text-accent" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
