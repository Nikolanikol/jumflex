import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  const path = request.nextUrl.pathname

  // Защита админских страниц
  if (path.startsWith('/admin')) {
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(signInUrl)
    }

    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Защита админских API routes
  if (path.startsWith('/api/admin')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    if (token.role !== 'admin') {
      return NextResponse.json(
        { error: 'Доступ запрещен. Требуются права администратора.' },
        { status: 403 }
      )
    }
  }

  return NextResponse.next()
}

// Указываем на какие маршруты применять middleware
export const config = {
  matcher: [
    '/admin/:path*',      // Все страницы /admin/*
    '/api/admin/:path*',  // Все API /api/admin/*
  ]
}