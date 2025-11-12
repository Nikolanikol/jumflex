import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Получаем все категории
    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name_ru', { ascending: true });

    if (error) throw error;

    // Опционально: получаем количество постов для каждой категории
    const categoriesWithCount = await Promise.all(
      (categories || []).map(async (category) => {
        const { count } = await supabase
          .from('blog_posts')
          .select('id', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('status', 'published');

        return {
          ...category,
          posts_count: count || 0,
        };
      })
    );

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}