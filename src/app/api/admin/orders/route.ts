import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabase } from '@/lib/supabase'

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Доступ запрещен' },
      { status: 403 }
    )
  }
  
  return null
}

export async function GET(request: Request) {
  const authError = await checkAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        total_amount,
        status,
        payment_status,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('Ошибка загрузки заказов:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ orders: orders || [] })
  } catch (error) {
    console.error('Ошибка в API:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}