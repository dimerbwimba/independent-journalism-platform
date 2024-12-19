import 'next-auth'
import { JWT } from 'next-auth/jwt'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    role?: UserRole
    status: string
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      role: UserRole
      status: "ACTIVE" | "SUSPENDED" | "BANNED"
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role?: UserRole
    status: string
  }
} 