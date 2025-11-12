import { redirect } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Получаем категорию по slug
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/api/blog/categories`,
      { cache: "no-store" }
    );
    const categories = await response.json();
    const category = categories.find((c: any) => c.slug === slug);

    if (category) {
      // Редирект на главную страницу блога с фильтром по категории
      redirect(`/blog?category=${category.id}`);
    } else {
      redirect("/blog");
    }
  } catch (error) {
    redirect("/blog");
  }
}
