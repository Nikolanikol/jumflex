import { redirect } from "next/navigation";

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Получаем тег по slug
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/api/blog/tags`,
      { cache: "no-store" }
    );
    const tags = await response.json();
    const tag = tags.find((t: any) => t.slug === slug);

    if (tag) {
      // Редирект на главную страницу блога с фильтром по тегу
      redirect(`/blog?tag=${tag.id}`);
    } else {
      redirect("/blog");
    }
  } catch (error) {
    redirect("/blog");
  }
}
