import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { UpdateBlogPostInput } from '@/types/blog';

// PUT - Обновление поста
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body: UpdateBlogPostInput = await request.json();

    // Проверка существования поста
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Проверка уникальности slug (если он изменяется)
    if (body.slug) {
      const { data: slugExists } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single();

      if (slugExists) {
        return NextResponse.json(
          { error: 'Post with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Подготовка данных для обновления
    const updateData: any = {};
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.cover_image !== undefined) updateData.cover_image = body.cover_image;
    if (body.category_id !== undefined) updateData.category_id = body.category_id;
    if (body.status !== undefined) {
      updateData.status = body.status;
      // Если статус меняется на published и published_at пустой, устанавливаем текущую дату
      if (body.status === 'published' && !body.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }
    if (body.published_at !== undefined) updateData.published_at = body.published_at;
    if (body.meta_title !== undefined) updateData.meta_title = body.meta_title;
    if (body.meta_description !== undefined) updateData.meta_description = body.meta_description;

    // Обновляем пост
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (postError) throw postError;

    // Если указаны теги, обновляем связи
    if (body.tag_ids !== undefined) {
      // Удаляем старые связи
      await supabase
        .from('blog_post_tags')
        .delete()
        .eq('post_id', id);

      // Добавляем новые связи
      if (body.tag_ids.length > 0) {
        const tagRelations = body.tag_ids.map((tagId) => ({
          post_id: id,
          tag_id: tagId,
        }));

        const { error: tagsError } = await supabase
          .from('blog_post_tags')
          .insert(tagRelations);

        if (tagsError) {
          console.error('Error updating tags:', tagsError);
        }
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE - Удаление поста
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Проверка существования поста
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Удаляем пост (связи с тегами удалятся автоматически благодаря ON DELETE CASCADE)
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}