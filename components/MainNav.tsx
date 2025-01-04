'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut, signIn } from 'next-auth/react'
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
      'fixed top-0  z-50  flex w-full justify-center text-white transition duration-200',
      isScrolled ? 'bg-white text-gray-800 shadow-md' : ' bg-gray-800 text-white'
    )}>
      <div className="h-12 w-full max-w-7xl items-center rounded-b-2xl bg-bluewood px-6 md:rounded-b-3xl md:px-8 min-[1342px]:box-content">
        <div className="flex  pt-2 w-full items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 h-10 w-10">
              <Image src="/logo.png" alt="Logo" width={52} height={52} />

            </div>
            <span className="text-xl hidden sm:flex font-bold ">Travel Wing</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/categories"
              className=" transition-colors"
            >
              Categories
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <span className=" transition-colors">
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
                        <UserIcon className="h-5 w-5 " />
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
                    {(session.user?.role.includes('admin') || session.user?.role.includes('user')) && (
                      <>
                        <div className="space-y-4">
                          <div>
                            <h3 className="px-4 text-lg font-medium text-gray-500">Admin Dashboard</h3>
                            <div className="border-t-2 border-gray-300" />
                            <div className="mt-2 space-y-1">

                              {session.user?.status === 'BANNED' ?
                                <div className="flex bg-red-100 rounded-md p-4 justify-center items-center flex-col space-y-1">
                                  <span className="font-semibold text-red-600">Banned</span>
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    You are banned from the platform
                                  </span>
                                </div>
                                :
                                <Link
                                  href="/dashboard"
                                  className="flex flex-col px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                  <div>
                                    <span className="font-medium">Dashboard</span><br/>
                                    <span className="text-xs text-gray-500">Platform stats and insights</span>
                                  </div>
                                </Link>
                              }
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
                <button
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  className="flex items-center gap-2 rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                  <span className="text-gray-700">sign in</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 