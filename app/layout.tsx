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
      <main className={!isDashboard ? "pt-12" : ""}>
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
          <Suspense fallback={<div>Loading...</div>}>
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
