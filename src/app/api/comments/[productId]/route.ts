import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Получить все комментарии для продукта
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params; // Добавлено await

    const { data: comments, error } = await supabase
      .from('product_comments')
      .select(`
        *,
        user:users(name, email)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(comments || []);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке комментариев' },
      { status: 500 }
    );
  }
}