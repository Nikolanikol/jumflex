import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { BlogPostWithRelations } from '@/types/blog';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Получаем пост со всеми связями
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(
        `
        *,
        author:users!author_id(
          id,
          name,
          email,
          avatar_url
        ),
        category:blog_categories(
          id,
          name_ko,
          name_ru,
          name_en,
          slug,
          description
        )
      `
      )
      .eq('slug', slug)
      .single();

    if (error || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Получаем теги для этого поста
    const { data: tagRelations } = await supabase
      .from('blog_post_tags')
      .select(
        `
        tag_id,
        blog_tags(
          id,
          name,
          slug
        )
      `
      )
      .eq('post_id', post.id);

    // Формируем массив тегов
    const tags = tagRelations?.map((rel: any) => rel.blog_tags).filter(Boolean) || [];

    // Собираем полный объект поста
    const fullPost: BlogPostWithRelations = {
      ...post,
      tags,
    } as unknown as BlogPostWithRelations;

    // Увеличиваем счетчик просмотров (асинхронно, не ждем результата)
    // Только для опубликованных постов
    if (post.status === 'published') {
      supabase
        .from('blog_posts')
        .update({ views_count: post.views_count + 1 })
        .eq('id', post.id)
        .then();
    }

    return NextResponse.json(fullPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}