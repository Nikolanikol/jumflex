
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabase } from '@/lib/supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Вход только через Google
      if (account?.provider === 'google' && user.email) {
        try {
          // Проверяем, существует ли пользователь
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single()

          // Если пользователя нет - создаем нового
          if (fetchError && fetchError.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                email: user.email,
                name: user.name || profile?.name || 'User',
                password_hash: null, // Google users не имеют пароля
                role: 'customer',
              })

            if (insertError) {
              console.error('❌ Ошибка создания пользователя:', insertError)
              return false
            }
            
            console.log('✅ Новый пользователь создан:', user.email)
          } else if (existingUser) {
            console.log('✅ Существующий пользователь вошел:', user.email)
          }

          return true
        } catch (error) {
          console.error('❌ Ошибка при входе:', error)
          return false
        }
      }

      return false // Блокируем любые другие методы входа
    },
    
    async jwt({ token, user, account }) {
      // При первом входе через Google
      if (account?.provider === 'google' && token.email) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id, email, name, role')
          .eq('email', token.email)
          .single()

        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.name = dbUser.name
        }
      }

      return token
    },
    
    async session({ session, token }) {
      // Добавляем данные пользователя в сессию
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }