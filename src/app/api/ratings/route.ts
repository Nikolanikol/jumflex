import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

// POST - Создать рейтинг (только один раз)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    // Получаем user_id из базы данных
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { product_id, rating } = body;

    if (!product_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Некорректные данные' },
        { status: 400 }
      );
    }

    // Проверяем, есть ли уже рейтинг от этого пользователя
    const { data: existingRating } = await supabase
      .from('product_ratings')
      .select('id')
      .eq('product_id', product_id)
      .eq('user_id', userData.id)
      .single();

    if (existingRating) {
      return NextResponse.json(
        { error: 'Вы уже оценили этот товар' },
        { status: 400 }
      );
    }

    // Создаем новый рейтинг
    const { data, error } = await supabase
      .from('product_ratings')
      .insert({
        product_id,
        user_id: userData.id,
        rating,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json(
      { error: 'Ошибка при сохранении оценки' },
      { status: 500 }
    );
  }
}