import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET - получить избранное пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: wishlist, error } = await supabase
      .from('wishlist')
      .select(`
        id,
        product:products(
          *,
          category:categories(id, name_ko, name_ru, name_en, slug),
          brand:brands(id, name, logo_url)
        )
      `)
      .eq('user_id', session.user.id)

    if (error) throw error

    return NextResponse.json(wishlist || [])
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST - добавить в избранное
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { product_id } = await request.json()

    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: session.user.id,
        product_id
      })
      .select()
      .single()

    if (error) {
      // Если уже существует, возвращаем успех
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already in wishlist' })
      }
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

// DELETE - удалить из избранного
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const product_id = searchParams.get('product_id')

    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', session.user.id)
      .eq('product_id', product_id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}