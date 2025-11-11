import { supabase } from '@/lib/supabase'
import { sanitizeSearchQuery } from '@/utils/sanitize'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Параметры фильтрации
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'
    const featured = searchParams.get('featured')
    const isNew = searchParams.get('new')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    
    // Начинаем запрос
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name_ko, name_ru, name_en, slug),
        brand:brands(id, name, logo_url)
      `, { count: 'exact' })

    // Фильтрация по категории (по slug)
    if (category) {
      // Сначала получаем ID категории по slug
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()
      
      if (categoryData) {
        query = query.eq('category_id', categoryData.id)
      }
    }

    // Фильтрация по бренду
   if (brand) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (uuidRegex.test(brand)) {
    query = query.eq('brand_id', brand)
  }
}

    // Фильтрация по цене
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }

    // Поиск по названию

if (search && search.trim()) {
  const sanitizedSearch = sanitizeSearchQuery(search)
  
  if (sanitizedSearch) {
    query = query.or(
      `name_ko.ilike.%${sanitizedSearch}%,` +
      `name_ru.ilike.%${sanitizedSearch}%,` +
      `name_en.ilike.%${sanitizedSearch}%`
    )
  }
}

    // Фильтр популярных товаров
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    // Фильтр новинок
    if (isNew === 'true') {
      query = query.eq('is_new', true)
    }

    // Сортировка
    const sortOrder = order === 'asc' ? true : false
    query = query.order(sort, { ascending: sortOrder })

    // Пагинация
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: products, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}