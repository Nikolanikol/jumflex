import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

// GET - Получить рейтинг текущего пользователя для продукта
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ rating: null });
    }

    const { productId } = await params;

    // Получаем user_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ rating: null });
    }

    // Получаем рейтинг пользователя
    const { data: rating, error } = await supabase
      .from('product_ratings')
      .select('rating')
      .eq('product_id', productId)
      .eq('user_id', userData.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({ rating: rating?.rating || null });
  } catch (error) {
    console.error('Error fetching user rating:', error);
    return NextResponse.json({ rating: null });
  }
}