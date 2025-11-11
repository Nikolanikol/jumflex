import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Получить рейтинги и статистику для продукта
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params; // Добавлено await

    // Получаем все рейтинги для продукта
    const { data: ratings, error } = await supabase
      .from('product_ratings')
      .select('rating')
      .eq('product_id', productId);

    if (error) throw error;

    if (!ratings || ratings.length === 0) {
      return NextResponse.json({
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
    }

    // Подсчитываем статистику
    const total = ratings.length;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / total;

    // Распределение оценок
    const distribution = {
      5: ratings.filter((r) => r.rating === 5).length,
      4: ratings.filter((r) => r.rating === 4).length,
      3: ratings.filter((r) => r.rating === 3).length,
      2: ratings.filter((r) => r.rating === 2).length,
      1: ratings.filter((r) => r.rating === 1).length,
    };

    return NextResponse.json({
      average: Math.round(average * 10) / 10,
      total,
      distribution,
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке рейтингов' },
      { status: 500 }
    );
  }
}