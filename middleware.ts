import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAccessingDashboard = req.nextUrl.pathname.startsWith('/dashboard')

    // If user is banned, redirect to banned page with message
    if (token?.status === 'BANNED') {
      const redirectUrl = new URL('/banned', req.url)
      return NextResponse.redirect(redirectUrl)
    }
    // If user is a reader and trying to access dashboard
    if (token?.role === 'reader' && isAccessingDashboard) {
      // Add a searchParam to trigger toast notification
      const redirectUrl = new URL('/', req.url)
      redirectUrl.searchParams.set('message', 'Reader accounts do not have access to the dashboard')
      redirectUrl.searchParams.set('type', 'error')
      return NextResponse.redirect(redirectUrl)
    }

    // If user is trying to access admin routes without admin role
    if (req.nextUrl.pathname.startsWith('/dashboard/posts/pending') && !token?.role?.includes('admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    
    // If user is trying to access admin routes without admin role
    if (req.nextUrl.pathname.startsWith('/dashboard/manage-users') && !token?.role?.includes('admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

// Protect these routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/posts/:path*',
    '/api/manage-users/:path*'
  ]
} 