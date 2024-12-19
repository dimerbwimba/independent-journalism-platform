'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { UserIcon } from "lucide-react"

export default function MainNav() {
  const { data: session } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <nav className={cn(
      'fixed top-0 left-0 border-b-2 border-black right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    )}>
      <div className="container  mx-auto px-4">
        <div className="flex h-12  items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="h-8 w-8 rounded-lg bg-blue-600" />
            <span className="text-xl font-bold text-gray-900">Blog</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/categories"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <span className="text-gray-700 hover:text-blue-600 transition-colors">
                      Account
                    </span>
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || ''}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>
                      <div className="flex items-center space-x-2">
                        {session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || ''}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{session.user?.name}</p>
                          <p className="text-sm text-gray-500">{session.user?.email}</p>
                        </div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-1">
                    {/* Admin Menu Items */}
                    {session.user?.role === 'admin' && (
                      <>
                        <div className="space-y-4">
                          <div>
                            <h3 className="px-4 text-lg font-medium text-gray-500">Admin Dashboard</h3>
                            <div className="border-t-2 border-gray-300" />

                            <div className="mt-2 space-y-1">
                              <Link
                                href="/dashboard"
                                className="flex flex-col px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                              >
                                <span className="font-medium">Dashboard</span>
                                <span className="text-xs text-gray-500">Platform stats and insights</span>
                              </Link>
                            </div>
                          </div>
                          <div className="border-t border-gray-100" />
                        </div>
                      </>
                    )}

                    {/* User Menu Items */}
                    {session.user?.role === 'user' && (
                       <>
                       <div className="space-y-4">
                         <div>
                           <h3 className="px-4 text-lg font-medium text-gray-500">Admin Dashboard</h3>
                           <div className="border-t-2 border-gray-300" />

                           <div className="mt-2 space-y-1">
                             <Link
                               href="/dashboard"
                               className="flex flex-col px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                             >
                               <span className="font-medium">Dashboard</span>
                               <span className="text-xs text-gray-500">Platform stats and insights</span>
                             </Link>
                           </div>
                         </div>
                         <div className="border-t border-gray-100" />
                       </div>
                     </>
                    )}

                    {/* Common Menu Items */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="px-4 text-lg font-medium text-gray-500">Account Settings</h3>
                        <div className="border-t-2 border-gray-300" />
                        <div className="mt-2 space-y-1">
                          <Link
                            href="/account"
                            className="flex flex-col px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          >
                            <span className="font-medium">Account</span>
                            <span className="text-xs text-gray-500">Your public profile and preferences</span>
                          </Link>
                          <h3 className="px-4 text-lg font-medium text-gray-500">Saved Items</h3>
                          <div className="border-t-2 border-gray-300" />
                          <Link
                            href="/saved"
                            className="flex flex-col px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          >
                            <span className="font-medium">Saved Items</span>
                            <span className="text-xs text-gray-500">Bookmarked articles and collections</span>
                          </Link>
                          <Link
                            href="/newsletters"
                            className="flex flex-col px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          >
                            <span className="font-medium">Newsletters</span>
                            <span className="text-xs text-gray-500">Manage your subscriptions</span>
                          </Link>
                        </div>
                      </div>
                      <div className="border-t border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <span className="font-medium">Sign Out</span>
                        <span className="text-xs ml-2">Log out of your account</span>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 