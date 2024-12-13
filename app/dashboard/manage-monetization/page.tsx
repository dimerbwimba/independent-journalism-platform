import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/options"
import {
  BanknotesIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default async function ManageMonetizationPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const features = [
    {
      name: "Monetization Requests",
      description: "Review and approve creator monetization applications",
      icon: UserGroupIcon,
    },
    {
      name: "Payment Processing",
      description: "Manage and process creator payouts and payment history",
      icon: BanknotesIcon,
    },
    {
      name: "Revenue Analytics",
      description: "Track platform-wide monetization metrics and performance",
      icon: ChartBarIcon,
    },
    {
      name: "Policy Management",
      description: "Define and update monetization eligibility criteria and guidelines",
      icon: DocumentCheckIcon,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Monetization Management
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Welcome to the monetization management dashboard. Here you can oversee creator monetization requests,
          manage payments, and analyze platform revenue performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 mt-8">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="relative group bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div>
              <feature.icon
                className="h-8 w-8 text-blue-600"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Getting Started
        </h2>
        <div className="prose prose-blue max-w-none text-gray-500">
          <p>
            As an admin, you have full access to manage the platform&apos;s monetization features. Here&apos;s what you can do:
          </p>
          <ul className="mt-4 space-y-2">
            <li>Review and approve creator applications for monetization</li>
            <li>Process monthly payouts to eligible creators</li>
            <li>Monitor platform revenue and creator earnings</li>
            <li>Update monetization policies and eligibility requirements</li>
            <li>Handle creator support inquiries related to payments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

