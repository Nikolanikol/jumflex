import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Получаем все теги
    const { data: tags, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    // Опционально: получаем количество постов для каждого тега
    const tagsWithCount = await Promise.all(
      (tags || []).map(async (tag) => {
        const { count } = await supabase
          .from('blog_post_tags')
          .select('post_id', { count: 'exact', head: true })
          .eq('tag_id', tag.id);

        return {
          ...tag,
          posts_count: count || 0,
        };
      })
    );

    return NextResponse.json(tagsWithCount);
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog tags' },
      { status: 500 }
    );
  }
}