import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // TODO: Проверка прав администратора
    // const session = await getServerSession()
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const { name_ko, name_ru, name_en, slug, image_url, description } = body

    if (!name_ko || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('categories')
      .update({
        name_ko,
        name_ru,
        name_en,
        slug,
        image_url,
        description,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error updating category:', error)
    
    // Проверка на уникальность slug
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // TODO: Проверка прав администратора
    // const session = await getServerSession()
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Проверяем, есть ли товары в этой категории
    const { data: products, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1)

    if (checkError) throw checkError

    if (products && products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing products' },
        { status: 409 }
      )
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}