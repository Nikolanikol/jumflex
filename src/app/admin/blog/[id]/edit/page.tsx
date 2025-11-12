"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { BlogPost } from "@/types/blog";

export default function EditBlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [params.id]);

  const loadPost = async () => {
    try {
      // Сначала получаем slug по ID
      const response = await fetch(`/api/blog/posts?page=1&limit=1000`);
      const data = await response.json();
      const foundPost = data.posts.find((p: any) => p.id === params.id);

      if (foundPost) {
        // Теперь получаем полный пост по slug
        const postResponse = await fetch(`/api/blog/posts/${foundPost.slug}`);
        const postData = await postResponse.json();
        setPost(postData);
      }
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary">Загрузка поста...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-2">Пост не найден</p>
          <a
            href="/admin/blog"
            className="text-primary hover:text-primary-dark"
          >
            Вернуться к списку
          </a>
        </div>
      </div>
    );
  }

  return <BlogPostForm post={post} isEdit={true} />;
}
