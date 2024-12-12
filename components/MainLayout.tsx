'use client'

import MainNav from '@/components/MainNav'
import { usePathname } from 'next/navigation'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (!pathname) return null

  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <>
      {!isDashboard && <MainNav />}
      <main className="">
        {children}
      </main>
    </>
  )
} 