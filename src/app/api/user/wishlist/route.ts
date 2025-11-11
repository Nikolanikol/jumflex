import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET - получить избранное пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🔍 Session:', JSON.stringify(session, null, 2))
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized', debug: { session } },
        { status: 401 }
      )
    }

    // Получаем user_id по email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    console.log('👤 User:', user)
    console.log('❌ User Error:', userError)

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found', debug: { email: session.user.email, userError } },
        { status: 404 }
      )
    }

    const { data: wishlist, error } = await supabase
      .from('wishlist')
      .select(`
        id,
        user_id,
        product_id,
        created_at,
        product:products(
          id,
          slug,
          name_ko,
          name_ru,
          price,
          discount_price,
          images,
          category:categories(id, name_ko, name_ru, slug),
          brand:brands(id, name, logo_url)
        )
      `)
      .eq('user_id', user.id)

    console.log('💝 Wishlist:', wishlist)
    console.log('❌ Wishlist Error:', error)

    if (error) throw error

    return NextResponse.json({ 
      success: true,
      wishlist: wishlist || [],
      debug: {
        userId: user.id,
        email: session.user.email,
        itemsCount: wishlist?.length || 0
      }
    })
  } catch (error) {
    console.error('❌ Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist', details: error },
      { status: 500 }
    )
  }
}

// POST - добавить в избранное
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🔍 POST Session:', JSON.stringify(session, null, 2))
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized', debug: { session } },
        { status: 401 }
      )
    }

    const { product_id } = await request.json()
    console.log('📦 Product ID:', product_id)

    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      )
    }

    // Получаем user_id по email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    console.log('👤 User:', user)
    console.log('❌ User Error:', userError)

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found', debug: { email: session.user.email, userError } },
        { status: 404 }
      )
    }

    // Проверяем существует ли уже
    const { data: existing } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product_id)
      .single()

    if (existing) {
      console.log('✅ Already in wishlist')
      return NextResponse.json({ success: true, message: 'Already in wishlist' })
    }

    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: user.id,
        product_id
      })
      .select()
      .single()

    console.log('💝 Insert result:', data)
    console.log('❌ Insert error:', error)

    if (error) {
      // Если уже существует, возвращаем успех
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already in wishlist' })
      }
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('❌ Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist', details: error },
      { status: 500 }
    )
  }
}

// DELETE - удалить из избранного
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🔍 DELETE Session:', JSON.stringify(session, null, 2))
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const product_id = searchParams.get('product_id')
    console.log('🗑️ Delete Product ID:', product_id)

    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      )
    }

    // Получаем user_id по email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', product_id)

    console.log('❌ Delete error:', error)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist', details: error },
      { status: 500 }
    )
  }
}