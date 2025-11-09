import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(request: Request) {
  try {
    // TODO: Проверка прав администратора через сессию
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
      .insert([
        {
          name_ko,
          name_ru,
          name_en,
          slug,
          image_url,
          description,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    
    // Проверка на уникальность slug
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}