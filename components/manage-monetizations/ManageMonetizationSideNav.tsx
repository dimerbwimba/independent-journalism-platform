"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    UsersIcon,
} from "@heroicons/react/24/outline";

const navigation = [
    {
        name: "Overview",
        href: "/dashboard/manage-monetization",
        icon: UsersIcon,
        description: "Monetization management dashboard"
    },
    {
        name: "Monetization Requests",
        href: "/dashboard/manage-monetization/requests",
        icon: UsersIcon,
        description: "Review and approve monetization applications"
    },
    {
        name: "Pending Payments",
        href: "/dashboard/manage-monetization/payments",
        icon: UsersIcon,
        description: "Process pending creator payouts"
    },

];

export default function ManageMonetizationSideNav() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col fixed inset-y-0 bg-white border-r border-gray-200">
            {/* Logo */}
            <div className="flex h-12 items-center px-4">
                <h2 className="text-lg font-semibold text-gray-900">Monetization Management</h2>
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
