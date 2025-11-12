import { Suspense } from "react";
import BlogContent from "@/components/blog/BlogContent";

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-dark flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-secondary">Загрузка блога...</p>
          </div>
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  );
}
