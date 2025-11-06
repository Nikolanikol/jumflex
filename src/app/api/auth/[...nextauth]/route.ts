import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Введите email и пароль')
        }

        // Поиск пользователя
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single()

        if (error || !user) {
          throw new Error('Пользователь не найден')
        }

        // Проверка пароля только если он есть
        if (user.password_hash) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password_hash
          )

          if (!isPasswordValid) {
            throw new Error('Неверный пароль')
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Если вход через Google
      if (account?.provider === 'google' && user.email) {
        try {
          // Проверяем, существует ли пользователь
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single()

          // Если пользователь не существует, создаем его
          if (fetchError && fetchError.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                email: user.email,
                name: user.name || '',
                password_hash: null, // Google users don't have password
                role: 'customer',
              })

            if (insertError) {
              console.error('Error creating user:', insertError)
              return false
            }
          }

          return true
        } catch (error) {
          console.error('Sign in error:', error)
          return false
        }
      }

      return true
    },
    async jwt({ token, user, account }) {
      // При первом входе или входе через credentials
      if (user) {
        token.role = user.role
        token.id = user.id
      }

      // При входе через Google получаем данные пользователя из БД
      if (account?.provider === 'google' && token.email) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', token.email)
          .single()

        if (dbUser) {
          token.role = dbUser.role
          token.id = dbUser.id
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }