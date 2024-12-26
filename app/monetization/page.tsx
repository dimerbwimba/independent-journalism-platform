import { Metadata } from "next"
import Link from "next/link"
import { 
  BanknotesIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline"

export const metadata: Metadata = {
  title: "Content Monetization | Independent Travel Blog",
  description: "Learn how to monetize your content on our platform. Discover our transparent revenue sharing model, eligibility requirements, and payment processes.",
  keywords: [
    "content monetization",
    "creator earnings",
    "revenue sharing",
    "payment terms",
    "monetization requirements",
    "content creator",
    "earning potential",
    "payout process",
    "monetization eligibility",
    "creator payments"
  ],
  authors: [{ name: "Bwimba Mihandgo Dimer" }],
  creator: "Bwimba Mihandgo Dimer",
  publisher: "Independent Travel Blog",
  openGraph: {
    title: "Content Monetization | Independent Travel Blog",
    description: "Learn how to monetize your content on our platform. Discover our transparent revenue sharing model, eligibility requirements, and payment processes.",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/monetization`,
    siteName: "Independent Travel Blog",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Content Monetization | Independent Travel Blog",
    description: "Learn how to monetize your content and earn from your articles.",
    creator: "@travelwing",
    site: "@travelwing",
  },
}

export default function MonetizationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <div className="relative py-24">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-6">Content Monetization</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Turn your passion for writing into income. Learn how to monetize your content 
                and earn from your articles.
              </p>
            </div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-16">
        <div className="prose prose-lg max-w-none">
          {/* Overview */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Program Overview</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600 mb-4">
                Our monetization program allows content creators to earn income from their articles 
                through a transparent revenue-sharing model. We offer competitive rates and regular 
                payouts to eligible creators.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <BanknotesIcon className="w-8 h-8 text-green-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">$0.30</h3>
                  <p className="text-sm text-gray-600">Per 1,000 Views</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ClockIcon className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Monthly</h3>
                  <p className="text-sm text-gray-600">Payment Schedule</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <BanknotesIcon className="w-8 h-8 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">$50</h3>
                  <p className="text-sm text-gray-600">Minimum Payout</p>
                </div>
              </div>
            </div>
          </section>

          {/* Eligibility Requirements */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Eligibility Requirements</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Account Requirements</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Verified account with complete profile</li>
                  <li>At least 18 years old</li>
                  <li>Valid PayPal account for payments</li>
                  <li>No community guidelines violations</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Content Requirements</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Minimum of 10,000 authentic views</li>
                  <li>Original, high-quality content</li>
                  <li>Regular publishing schedule</li>
                  <li>Compliance with content guidelines</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Payment Process */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Payment Process</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Earnings Calculation</h3>
                    <p className="text-gray-600">
                      Earnings are calculated based on eligible views at $0.30 per 1,000 views. 
                      Views are counted when a reader spends at least 30 seconds on your article.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Payment Schedule</h3>
                    <p className="text-gray-600">
                      Payments are processed monthly for earnings above $50. Payments are made 
                      via PayPal between the 1st and 5th of each month for the previous month&apos;s earnings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                    <p className="text-gray-600">
                      Currently, we support PayPal as our payment method. Ensure your PayPal 
                      email is correctly set up in your monetization settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Getting Started</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600 mb-6">
                Ready to start earning from your content? Follow these steps:
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Complete your profile</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Verify your account</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Set up your PayPal information</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Start creating quality content</span>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/dashboard/monetization"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Set Up Monetization
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Content Monetization",
            description: "Learn how to monetize your content on our platform.",
            publisher: {
              "@type": "Organization",
              name: "Independent Journalism Platform",
              logo: {
                "@type": "ImageObject",
                url: "https://yourplatform.com/logo.png"
              }
            },
            mainEntity: {
              "@type": "MonetaryAmount",
              currency: "USD",
              value: {
                "@type": "QuantitativeValue",
                value: 0.30,
                unitText: "per thousand views"
              }
            }
          })
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How much can I earn?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You can earn $0.30 per 1,000 eligible views on your articles. Payments are made monthly when your earnings exceed $50."
                }
              },
              {
                "@type": "Question",
                name: "What are the eligibility requirements?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You need a verified account, must be 18+ years old, have at least 10,000 authentic views, and maintain high-quality original content."
                }
              },
              {
                "@type": "Question",
                name: "How do payments work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Payments are processed monthly via PayPal for earnings above $50. Payment processing occurs between the 1st and 5th of each month."
                }
              }
            ]
          })
        }}
      />
    </div>
  )
} 