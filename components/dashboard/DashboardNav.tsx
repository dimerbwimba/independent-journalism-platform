"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { UserAvatar } from "../UserAvatar";
import { BellIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function DashboardNav() {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = session?.user?.role === 'admin';

  if (!pathname) return null;

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex h-16 items-center px-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold text-xl text-gray-800"
                >
                  <span className="h-8 w-8 rounded-lg bg-blue-600" />
                  <span className="text-xl font-bold text-gray-900">Blog</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center">
          {isAdmin && (
              <div className="flex items-center">
                <Link
                  href="/dashboard/manage-users"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md "
                >
                  <UsersIcon className="h-5 w-5 mr-2" />
                  Manage Users
                </Link>
              </div>
            )}
            {/* Notifications */}
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
             {/* Admin-only section */}
             
            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  {session?.user && <UserAvatar user={session.user} />}
                </button>
              </div>

              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

           
          </div>
        </div>
      </div>
    </nav>
  );
}
