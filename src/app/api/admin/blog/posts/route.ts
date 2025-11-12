import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CreateBlogPostInput } from '@/types/blog';

export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации и прав администратора
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body: CreateBlogPostInput = await request.json();

    // Валидация обязательных полей
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Проверка уникальности slug
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', body.slug)
      .single();

    if (existingPost) {
      return NextResponse.json(
        { error: 'Post with this slug already exists' },
        { status: 400 }
      );
    }

    // Получаем user_id по email из сессии
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Создаем пост
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        content: body.content,
        cover_image: body.cover_image || null,
        author_id: user.id,
        category_id: body.category_id || null,
        status: body.status || 'draft',
        published_at: body.status === 'published' ? (body.published_at || new Date().toISOString()) : null,
        meta_title: body.meta_title || null,
        meta_description: body.meta_description || null,
      })
      .select()
      .single();

    if (postError) throw postError;

    // Если указаны теги, добавляем связи
    if (body.tag_ids && body.tag_ids.length > 0) {
      const tagRelations = body.tag_ids.map((tagId) => ({
        post_id: post.id,
        tag_id: tagId,
      }));

      const { error: tagsError } = await supabase
        .from('blog_post_tags')
        .insert(tagRelations);

      if (tagsError) {
        console.error('Error adding tags:', tagsError);
        // Продолжаем, даже если теги не добавились
      }
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}