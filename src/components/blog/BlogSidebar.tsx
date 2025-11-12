"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tag, FolderOpen } from "lucide-react";
import { BlogCategory, BlogTag } from "@/types/blog";

export default function BlogSidebar() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        fetch("/api/blog/categories"),
        fetch("/api/blog/tags"),
      ]);

      const [categoriesData, tagsData] = await Promise.all([
        categoriesRes.json(),
        tagsRes.json(),
      ]);

      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error("Error loading sidebar data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <aside className="space-y-6">
        <div className="card p-6 border border-dark animate-pulse">
          <div className="h-6 bg-light rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-light rounded"></div>
            <div className="h-4 bg-light rounded"></div>
            <div className="h-4 bg-light rounded"></div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="space-y-6">
      {/* Categories */}
      {categories.length > 0 && (
        <div className="card p-6 border border-dark">
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen size={20} className="text-primary" />
            <h3 className="text-xl font-bold text-white">Категории</h3>
          </div>
          <div className="space-y-2">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-light transition-colors group"
              >
                <span className="text-secondary group-hover:text-primary transition-colors">
                  {category.name_ru}
                </span>
                <span className="text-xs text-secondary bg-dark px-2 py-1 rounded-full">
                  {category.posts_count || 0}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular Tags */}
      {tags.length > 0 && (
        <div className="card p-6 border border-dark">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={20} className="text-primary" />
            <h3 className="text-xl font-bold text-white">Популярные теги</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags
              .filter((tag: any) => tag.posts_count > 0)
              .slice(0, 15)
              .map((tag: any) => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="px-3 py-1 bg-dark border border-dark hover:border-primary text-secondary hover:text-primary text-sm rounded-full transition-all"
                >
                  {tag.name}
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="card p-6 border border-dark bg-primary/5">
        <h3 className="text-xl font-bold text-white mb-3">О блоге</h3>
        <p className="text-secondary text-sm leading-relaxed mb-4">
          Блог FIT STORE - ваш источник информации о спортивном питании,
          тренировках и здоровом образе жизни.
        </p>
        <Link
          href="/about"
          className="text-primary hover:text-primary-dark text-sm font-semibold"
        >
          Узнать больше →
        </Link>
      </div>
    </aside>
  );
}
