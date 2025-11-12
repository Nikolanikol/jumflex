import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CreateBlogTagInput } from '@/types/blog';

// POST - Создание тега
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body: CreateBlogTagInput = await request.json();

    // Валидация
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Проверка уникальности slug
    const { data: existing } = await supabase
      .from('blog_tags')
      .select('id')
      .eq('slug', body.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Tag with this slug already exists' },
        { status: 400 }
      );
    }

    // Создаем тег
    const { data: tag, error } = await supabase
      .from('blog_tags')
      .insert({
        name: body.name,
        slug: body.slug,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating blog tag:', error);
    return NextResponse.json(
      { error: 'Failed to create blog tag' },
      { status: 500 }
    );
  }
}