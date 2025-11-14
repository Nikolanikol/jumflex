import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, Eye, Tag, ArrowLeft, Share2 } from "lucide-react";
import BlogPostContent from "@/components/blog/BlogPostContent";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { BlogPostWithRelations } from "@/types/blog";
import { Metadata } from "next";
import {
  generateMetadata as generateSEOMetadata,
  generateArticleSchema,
} from "@/lib/seo-utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Пост не найден | FitStore Blog",
      robots: { index: false, follow: false },
    };
  }

  return generateSEOMetadata({
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    image: post.cover_image,
    url: `/blog/${post.slug}`,
    type: "article",
    author: post.author.name,
    publishedTime: post.published_at,
    modifiedTime: post.updated_at,
  });
}
// Помечаем как динамическую страницу
export const dynamic = "force-dynamic";

async function getPost(slug: string): Promise<BlogPostWithRelations | null> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/api/blog/posts/${slug}`,
      { cache: "no-store" }
    );

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  const articleSchema = generateArticleSchema({
    headline: post?.title || "headline",
    description: post?.excerpt || "",
    image: post?.cover_image || "",
    datePublished: post?.published_at || "datePublished",
    dateModified: post?.updated_at || "dateModified",
    author: post?.author.name || "author",
    url: `/blog/${post?.slug}`,
  });

  if (!post || post.status !== "published") {
    notFound();
  }

  const publishedDate = new Date(
    post.published_at || post.created_at
  ).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Подсчет времени чтения (примерно 200 слов в минуту)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Hero Section */}
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Назад к блогу
          </Link>

          {/* Category Badge */}
          {post.category && (
            <Link
              href={`/blog/category/${post.category.slug}`}
              className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold hover:bg-primary/30 transition-colors mb-4"
            >
              {post.category.name_ru}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-secondary">
            <div className="flex items-center gap-2">
              <User size={20} />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>{publishedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={20} />
              <span>{post.views_count} просмотров</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📖</span>
              <span>{readingTime} мин чтения</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post Content */}
          <div className="lg:col-span-2">
            {/* Cover Image */}
            {post.cover_image && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Content */}
            <article className="card p-8 border border-dark mb-8">
              <BlogPostContent content={post.content} />
            </article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="card p-6 border border-dark mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={20} className="text-primary" />
                  <h3 className="text-lg font-bold text-white">Теги</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog/tag/${tag.slug}`}
                      className="px-4 py-2 bg-dark border border-dark hover:border-primary text-secondary hover:text-primary rounded-full transition-all text-sm"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            <div className="card p-6 border border-dark bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User size={32} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Автор: {post.author.name}
                  </h3>
                  <p className="text-secondary text-sm">
                    Эксперт в области спортивного питания и здорового образа
                    жизни
                  </p>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="card p-6 border border-dark mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 size={20} className="text-primary" />
                  <span className="text-white font-semibold">
                    Поделиться статьей
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="btn-outline text-sm">Facebook</button>
                  <button className="btn-outline text-sm">Twitter</button>
                  <button className="btn-outline text-sm">Копировать</button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
