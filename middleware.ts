import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // Allow public paths
  if (!token) {
    return NextResponse.next()
  }

  // Check if user is banned and trying to access protected routes
  if (token.status === 'BANNED' && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/banned', request.url))
  }

  // For API routes
  if (token.status === 'BANNED' && request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Your account has been suspended' },
      { status: 403 }
    )
  }

  return NextResponse.next()
}

// Specify which routes should be protected
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/dashboard/:path*',
    // '/api/posts/:path*',
    // '/api/comments/:path*',
    '/api/manage-users/:path*',
  ]
} 