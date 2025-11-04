import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
    const {slug} = await params

  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name_ko, name_ru, name_en, slug),
        brand:brands(id, name, logo_url),
        reviews(
          id,
          rating,
          comment,
          created_at,
          user:users(name)
        )
      `)
      .eq('slug', slug)
      .eq('reviews.is_approved', true)
      .single()

    if (error) throw error

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}