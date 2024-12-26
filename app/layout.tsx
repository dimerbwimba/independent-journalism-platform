"use client"
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import MainLayout from '@/components/MainLayout'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { toast, Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const type = searchParams.get('type')

  useEffect(() => {
    if (message) {
      if (type === 'error') {
        toast.error(message)
      } else {
        toast.message(message)
      }
    }
  }, [message, type])

  return (
    <MainLayout>
      {!isDashboard && <MainNav />}
      <main className={!isDashboard ? "" : ""}>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </MainLayout>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-sans">
        <Providers>
          <Toaster />
          <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4" role="status" aria-label="Loading content">
            <div className="flex flex-col items-center space-y-6">
              {/* Pulse animation container */}
              <div className="relative">
                <div className="h-16 w-16">
                  {/* Multiple rings with different animations */}
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200 opacity-20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-l-blue-300 animate-pulse"></div>
                </div>
              </div>

              {/* Loading text with shimmer effect */}
              <div className="relative">
                <span className="text-lg font-medium text-gray-700 bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent animate-pulse">
                  Loading...
                </span>
              </div>
            </div>
          </div>}>
            <MainContent>{children}</MainContent>
          </Suspense>
          <ProgressBar
            height="4px"
            color="#2563eb"
            options={{ showSpinner: false }}
            shallowRouting
          />
        </Providers>
      </body>
    </html>
  )
}
