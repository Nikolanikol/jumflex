import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('🔍 Checking user rating - Session:', session?.user?.email); // Лог 1
    
    if (!session?.user?.email) {
      console.log('❌ No session'); // Лог 2
      return NextResponse.json({ rating: null });
    }

    const { productId } = await params;
    console.log('🔍 Product ID:', productId); // Лог 3

    // Получаем user_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    console.log('🔍 User data:', userData, 'Error:', userError); // Лог 4

    if (userError || !userData) {
      console.log('❌ No user data'); // Лог 5
      return NextResponse.json({ rating: null });
    }

    // Получаем рейтинг пользователя
    const { data: rating, error } = await supabase
      .from('product_ratings')
      .select('rating')
      .eq('product_id', productId)
      .eq('user_id', userData.id)
      .single();

    console.log('🔍 Rating data:', rating, 'Error:', error); // Лог 6

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({ rating: rating?.rating || null });
  } catch (error) {
    console.error('❌ Error fetching user rating:', error);
    return NextResponse.json({ rating: null });
  }
}