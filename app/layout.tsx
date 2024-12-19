"use client"
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import MainLayout from '@/components/MainLayout'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast, Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-sans">
        <Providers>
          <MainLayout>
            {!isDashboard && <MainNav />}
            <main className={!isDashboard ? "pt-12" : ""}>
              <Toaster /> 
              {children}
            </main>
            {!isDashboard && <Footer />}
          </MainLayout>
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
