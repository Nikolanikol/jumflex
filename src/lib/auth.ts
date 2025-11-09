import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

// Проверка что пользователь авторизован
export async function getSession() {
  const session = await getServerSession(authOptions)
  return session
}

// Требовать авторизацию
export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return session
}

// Требовать права администратора
export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'admin') {
    redirect('/')
  }

  return session
}

// Проверка роли
export async function checkRole(allowedRoles: string[]) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return false
  }

  return allowedRoles.includes(session.user.role)
}