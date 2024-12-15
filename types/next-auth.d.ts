import 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    role?: string
    status: string
  }

  interface Session {
    user: User & {
      id: string
      role?: string
      status: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role?: string
    status: string
  }
} 