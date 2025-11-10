import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabase } from '@/lib/supabase'

// GET - получить все адреса пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: addresses, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(addresses || [])
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

// POST - создать новый адрес
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      label,
      recipient_name,
      recipient_phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      is_default
    } = body

    // Валидация
    if (!label || !recipient_name || !recipient_phone || !address_line1 || !city || !postal_code) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    // Если новый адрес по умолчанию, убираем флаг у других
    if (is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', session.user.id)
    }

    const { data: address, error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: session.user.id,
        label,
        recipient_name,
        recipient_phone,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country: country || 'South Korea',
        is_default: is_default || false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(address)
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    )
  }
}