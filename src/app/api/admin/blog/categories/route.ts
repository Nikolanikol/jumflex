import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CreateBlogCategoryInput } from '@/types/blog';

// POST - Создание категории
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body: CreateBlogCategoryInput = await request.json();

    // Валидация
    if (!body.name_ko || !body.name_ru || !body.name_en || !body.slug) {
      return NextResponse.json(
        { error: 'All name fields and slug are required' },
        { status: 400 }
      );
    }

    // Проверка уникальности slug
    const { data: existing } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', body.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }

    // Создаем категорию
    const { data: category, error } = await supabase
      .from('blog_categories')
      .insert({
        name_ko: body.name_ko,
        name_ru: body.name_ru,
        name_en: body.name_en,
        slug: body.slug,
        description: body.description || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating blog category:', error);
    return NextResponse.json(
      { error: 'Failed to create blog category' },
      { status: 500 }
    );
  }
}