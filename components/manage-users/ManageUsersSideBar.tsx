"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  UsersIcon,
  ShieldCheckIcon,
  TrashIcon,
  ShieldExclamationIcon,
  DocumentCheckIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard/manage-users",
    icon: UsersIcon,
    description: "User management dashboard"
  },
  {
    name: "Roles & Permissions",
    href: "/dashboard/manage-users/roles",
    icon: ShieldCheckIcon,
    description: "Manage user roles and permissions"
  },
  {
    name: "Guidelines Enforcement",
    href: "/dashboard/manage-users/enforcement",
    icon: ShieldExclamationIcon,
    description: "Handle content and behavior violations"
  },
  {
    name: "Content Moderation",
    href: "/dashboard/manage-users/moderation",
    icon: DocumentCheckIcon,
    description: "Review and moderate user content"
  },
  {
    name: "Banned Users",
    href: "/dashboard/manage-users/banned",
    icon: TrashIcon,
    description: "Manage banned and suspended accounts"
  },
  {
    name: "Communication",
    href: "/dashboard/manage-users/communication",
    icon: EnvelopeIcon,
    description: "User communications and messages"
  },
];

export default function ManageUsersSideBar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col fixed inset-y-0 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-12 items-center px-4">
        <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col gap-0.5 px-3 py-2 text-sm transition-colors rounded-md",
                "hover:bg-gray-100 hover:text-gray-900",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                isActive ? 
                  "bg-gray-100 text-gray-900" : 
                  "text-gray-700"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
              </div>
              {item.description && (
                <p className="text-xs text-gray-500 ml-8">
                  {item.description}
                </p>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  );
}
