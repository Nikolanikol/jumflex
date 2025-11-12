import Link from "next/link";
import { Calendar, User, Eye, ArrowRight } from "lucide-react";
import { BlogPostPreview } from "@/types/blog";

interface BlogPostCardProps {
  post: BlogPostPreview;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="card border border-dark hover:border-primary transition-all group overflow-hidden">
      {/* Cover Image */}
      {post.cover_image && (
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {post.category && (
              <div className="absolute top-4 left-4">
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className="px-3 py-1 bg-primary/90 text-black text-xs font-semibold rounded-full hover:bg-primary transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.category.name_ru}
                </Link>
              </div>
            )}
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-secondary mb-3">
          <div className="flex items-center gap-1">
            <User size={16} />
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>
              {new Date(
                post.published_at || post.created_at
              ).toLocaleDateString("ru-RU")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={16} />
            <span>{post.views_count}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Read More Link */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-sm font-semibold group"
        >
          <span>Читать далее</span>
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </article>
  );
}
