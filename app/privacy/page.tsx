import { Metadata } from "next"
import Link from "next/link"
import { 
  ShieldCheckIcon, 
  LockClosedIcon,
  DocumentTextIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ServerIcon,
  KeyIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline"

export const metadata: Metadata = {
  title: "Privacy Policy | Independent Journalism Platform",
  description: "Our privacy policy explains how we collect, use, and protect your personal information, ensuring transparency and control over your data while using our platform.",
  keywords: [
    "privacy policy",
    "data protection",
    "user privacy",
    "personal data",
    "data security",
    "GDPR compliance",
    "data rights",
    "information collection",
    "data storage",
    "privacy protection"
  ],
  authors: [{ name: "Bwimba Mihandgo Dimer" }],
  creator: "Bwimba Mihandgo Dimer",
  publisher: "Independent Journalism Platform",
  openGraph: {
    title: "Privacy Policy | Independent Journalism Platform",
    description: "Our privacy policy explains how we collect, use, and protect your personal information, ensuring transparency and control over your data.",
    url: "https://yourplatform.com/privacy",
    siteName: "Independent Journalism Platform",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/privacy-og.jpg",
        width: 1200,
        height: 630,
        alt: "Privacy Policy - Independent Journalism Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Independent Journalism Platform",
    description: "Our privacy policy explains how we collect, use, and protect your personal information.",
    images: ["/privacy-og.jpg"],
    creator: "@yourplatform",
    site: "@yourplatform",
  },
  alternates: {
    canonical: "https://yourplatform.com/privacy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <div className="relative py-24">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Last updated: {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-16">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Introduction</h2>
            </div>
            <p className="text-gray-600">
              We are committed to protecting your privacy and personal data. This Privacy Policy 
              explains how we collect, process, and safeguard your information when you use our platform.
            </p>
          </section>

          {/* Data Collection */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Information We Collect</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Name and email address when you create an account</li>
                <li>Profile information you choose to provide</li>
                <li>Payment information for monetization (processed securely via PayPal)</li>
                <li>Content you create and publish on the platform</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Usage Data</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>IP address and device information</li>
                <li>Browser type and settings</li>
                <li>Platform usage statistics and interactions</li>
                <li>Content viewing history and preferences</li>
              </ul>
            </div>
          </section>

          {/* Data Usage */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GlobeAltIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">How We Use Your Data</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>To provide and maintain our services</li>
                <li>To process and manage your account</li>
                <li>To calculate and process monetization payments</li>
                <li>To improve our platform and user experience</li>
                <li>To communicate important updates and announcements</li>
                <li>To prevent fraud and ensure platform security</li>
              </ul>
            </div>
          </section>

          {/* Data Storage and Security */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ServerIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Data Storage and Security</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600 mb-4">
                We implement robust security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Strict access controls and authentication</li>
                <li>Secure data backups and disaster recovery</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <KeyIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Your Rights</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <p className="text-gray-600">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <ArrowPathIcon className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Data Retention</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600">
                We retain your personal data only for as long as necessary to fulfill the purposes 
                outlined in this Privacy Policy. When data is no longer needed, it is securely deleted 
                or anonymized.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg">
                <EnvelopeIcon className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Contact Us</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600 mb-4">
                For any privacy-related questions or to exercise your rights, please contact us at:
              </p>
              <ul className="list-none space-y-2 text-gray-600">
                <li>Email: privacy@yourplatform.com</li>
                <li>Address: North Kivu, DRC</li>
              </ul>
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
            name: "Privacy Policy",
            description: "Our privacy policy explains how we collect, use, and protect your personal information.",
            publisher: {
              "@type": "Organization",
              name: "Independent Journalism Platform",
              logo: {
                "@type": "ImageObject",
                url: "https://yourplatform.com/logo.png"
              }
            },
            mainEntity: {
              "@type": "WebContent",
              about: {
                "@type": "Thing",
                name: "Privacy Policy",
                description: "Information about data collection, usage, and protection"
              },
              dateModified: new Date().toISOString(),
              author: {
                "@type": "Organization",
                name: "Independent Journalism Platform",
                url: "https://yourplatform.com"
              }
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://yourplatform.com"
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Privacy Policy",
                  item: "https://yourplatform.com/privacy"
                }
              ]
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
                name: "What personal information do you collect?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We collect information such as your name, email address, profile information, payment details for monetization, and content you create on the platform."
                }
              },
              {
                "@type": "Question",
                name: "How do you protect my data?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We use encryption for data in transit and at rest, implement strict access controls, conduct regular security audits, and maintain secure backups."
                }
              },
              {
                "@type": "Question",
                name: "What are my privacy rights?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You have the right to access, correct, or delete your personal data, object to data processing, request data portability, and withdraw consent at any time."
                }
              }
            ]
          })
        }}
      />
    </div>
  )
} 