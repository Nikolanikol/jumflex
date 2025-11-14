import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fitstore.kr";

  // Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Получаем все продукты
  const { data: products } = await supabase
    .from("products")
    .select("id, slug, updated_at")
    .order("updated_at", { ascending: false });

  const productPages: MetadataRoute.Sitemap =
    products?.map((product) => ({
      url: `${baseUrl}/products/${product.slug || product.id}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  // Получаем все категории (БЕЗ updated_at, так как его нет в таблице)
  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, created_at")
    .order("created_at", { ascending: false });

  const categoryPages: MetadataRoute.Sitemap =
    categories?.map((category) => ({
      url: `${baseUrl}/products?category=${category.id}`,
      lastModified: new Date(category.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || [];

  // Получаем все опубликованные посты блога
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  const blogPages: MetadataRoute.Sitemap =
    posts?.map((post) => ({
      url: `${baseUrl}/blog/${post.slug || post.id}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })) || [];

  // Получаем категории блога
  const { data: blogCategories } = await supabase
    .from("blog_categories")
    .select("id, slug, created_at")
    .order("created_at", { ascending: false });

  const blogCategoryPages: MetadataRoute.Sitemap =
    blogCategories?.map((category) => ({
      url: `${baseUrl}/blog?category=${category.id}`,
      lastModified: new Date(category.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages, ...blogCategoryPages];
}
