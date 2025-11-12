import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { BlogPostsResponse, BlogPostPreview } from '@/types/blog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Параметры пагинации
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Параметры фильтрации
    const status = searchParams.get('status') || 'published';
    const categoryId = searchParams.get('category_id');
    const tagId = searchParams.get('tag_id');
    const authorId = searchParams.get('author_id');
    const search = searchParams.get('search');

    // Параметры сортировки
    const sortField = searchParams.get('sort') || 'published_at';
    const sortOrder = searchParams.get('order') || 'desc';

    // Начинаем запрос
    let query = supabase
      .from('blog_posts')
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        cover_image,
        status,
        views_count,
        published_at,
        created_at,
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
          slug
        )
      `,
        { count: 'exact' }
      );

    // Фильтр по статусу
    if (status) {
      query = query.eq('status', status);
    }

    // Фильтр по категории
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    // Фильтр по автору
    if (authorId) {
      query = query.eq('author_id', authorId);
    }

    // Фильтр по тегу (требует join)
    if (tagId) {
      const { data: postIds } = await supabase
        .from('blog_post_tags')
        .select('post_id')
        .eq('tag_id', tagId);

      if (postIds && postIds.length > 0) {
        const ids = postIds.map((item) => item.post_id);
        query = query.in('id', ids);
      } else {
        // Если нет постов с этим тегом, возвращаем пустой результат
        return NextResponse.json({
          posts: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        });
      }
    }

    // Поиск по заголовку и excerpt
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Сортировка
    query = query.order(sortField, { ascending: sortOrder === 'asc' });

    // Пагинация
    query = query.range(offset, offset + limit - 1);

    const { data: posts, error, count } = await query;

    if (error) throw error;

    // Для каждого поста получаем теги (опционально, если нужно)
    // Можно закомментировать для ускорения, если теги не нужны в списке
    /*
    if (posts) {
      for (const post of posts) {
        const { data: tagRelations } = await supabase
          .from('blog_post_tags')
          .select('tag_id, blog_tags(id, name, slug)')
          .eq('post_id', post.id);
        
        post.tags = tagRelations?.map(rel => rel.blog_tags) || [];
      }
    }
    */

    const totalPages = Math.ceil((count || 0) / limit);

    const response: BlogPostsResponse = {
      posts: (posts || []) as unknown as BlogPostPreview[],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}