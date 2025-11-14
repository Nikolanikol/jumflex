import { supabase } from "@/lib/supabase";
import { Category } from "@/types/database";

export async function getCategory(
  categorySlug: string
): Promise<Category | null> {
  try {
    const { data: category, error } = await supabase
      .from("categories")
      .select(
        `
        id,
        name_ko,
        name_ru,
        name_en,
        slug,
        image_url,
        description,
        created_at
      `
      )
      .eq("slug", categorySlug)
      .single();

    if (error) {
      console.error("Error fetching category:", error);
      return null;
    }

    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}
