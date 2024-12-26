import { Metadata } from "next"
import Link from "next/link"
import { 
  ShieldCheckIcon, 
  DocumentTextIcon,
  ScaleIcon,
  UserGroupIcon,
  LockClosedIcon,
  BellAlertIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline"

export const metadata: Metadata = {
  title: "Terms of Service | Travel blog",
  description: "Our comprehensive terms of service outline the rules, guidelines, and agreements that govern the use of our platform, including content creation, monetization, privacy, and user responsibilities.",
  keywords: [
    "terms of service",
    "user agreement",
    "content guidelines",
    "monetization terms",
    "privacy policy",
    "user responsibilities",
    "intellectual property rights",
    "platform rules",
    "content creator terms",
    "travel blog"
  ],
  authors: [{ name: "Bwimba Mihandgo Dimer" }],
  creator: "Bwimba Mihandgo Dimer",
  publisher: "Independent Travel blog ",
  openGraph: {  
    title: "Terms of Service | Independent Travel blog ",
    description: "Our comprehensive terms of service outline the rules, guidelines, and agreements that govern the use of our platform, including content creation, monetization, privacy, and user responsibilities.",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/terms`,
    siteName: "Independent Travel blog ",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/terms-og.jpg",
        width: 1200,
        height: 630,
        alt: "Terms of Service - Independent Travel blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Independent Travel blog",
    description: "Our comprehensive terms of service outline the rules, guidelines, and agreements that govern the use of our platform.",
    images: ["/terms-og.jpg"],
    creator: "@yourplatform",
    site: "@yourplatform",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/terms`,
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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <div className="relative py-24">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
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
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Introduction</h2>
            </div>
            <p className="text-gray-600">
              Welcome to Independent Travel blog. By accessing or using our platform, 
              you agree to be bound by these Terms of Service. Please read these terms carefully 
              before using our services.
            </p>
          </section>

          {/* User Responsibilities */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">User Responsibilities</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Account Creation and Maintenance</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>You may not share your account credentials with others</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Content Guidelines</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>All content must be original or properly attributed</li>
                <li>Content must not violate any applicable laws or regulations</li>
                <li>You must not post harmful, offensive, or inappropriate content</li>
                <li>You are responsible for any content you publish on the platform</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PencilSquareIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Intellectual Property Rights</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Content Ownership</h3>
              <p className="text-gray-600">
                You retain ownership of the content you create and publish on our platform. 
                However, by posting content, you grant us a worldwide, non-exclusive, royalty-free 
                license to use, reproduce, modify, and distribute your content.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Platform Content</h3>
              <p className="text-gray-600">
                All platform features, logos, trademarks, and content created by us are protected 
                by intellectual property laws and remain our exclusive property.
              </p>
            </div>
          </section>

          {/* Privacy and Data Protection */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <LockClosedIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Privacy and Data Protection</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600 mb-4">
                Our privacy practices are governed by our Privacy Policy, which is incorporated 
                into these Terms of Service. By using our platform, you agree to our data 
                collection and use practices as described in the Privacy Policy.
              </p>
              <Link 
                href="/privacy" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View Privacy Policy →
              </Link>
            </div>
          </section>

          {/* Monetization Terms */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ScaleIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Monetization Terms</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Eligibility</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Minimum of 10,000 authentic views required for monetization</li>
                <li>Content must comply with our quality guidelines</li>
                <li>Account must be in good standing</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Payment Terms</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>$0.30 per 1,000 eligible views</li>
                <li>Minimum payout threshold of $50</li>
                <li>Payments processed monthly via PayPal</li>
                <li>We reserve the right to adjust rates with notice</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Termination</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600 mb-4">
                We reserve the right to terminate or suspend your account and access to our 
                services, without prior notice or liability, for any reason, including breach 
                of these Terms. Upon termination, your right to use the platform will immediately cease.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BellAlertIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Changes to Terms</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600">
                We reserve the right to modify these terms at any time. We will notify users 
                of any material changes via email or platform notification. Your continued use 
                of the platform after such modifications constitutes acceptance of the updated terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Contact Information</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <ul className="list-none space-y-2 text-gray-600">
                <li>Email: legal@yourplatform.com</li>
                <li>Address: North Kivu, DRC</li>
              </ul>
            </div>
          </section>
        </div>
      </div>

      {/* Add Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service",
            description: "Our comprehensive terms of service outline the rules, guidelines, and agreements that govern the use of our platform.",
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
                name: "Platform Terms of Service",
                description: "Legal agreement between users and Independent Journalism Platform"
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
                  name: "Terms of Service",
                  item: "https://yourplatform.com/terms"
                }
              ]
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", "h2", "h3"]
            },
            hasPart: [
              {
                "@type": "WebPageElement",
                isAccessibleForFree: "True",
                cssSelector: ".prose"
              }
            ]
          })
        }}
      />

      {/* Add FAQ Schema for common terms questions */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What are the monetization requirements?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "To be eligible for monetization, you need a minimum of 10,000 authentic views, content that complies with our quality guidelines, and an account in good standing. We offer $0.30 per 1,000 eligible views with a minimum payout threshold of $50."
                }
              },
              {
                "@type": "Question",
                name: "Who owns the content I publish?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You retain ownership of the content you create and publish. However, by posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content."
                }
              },
              {
                "@type": "Question",
                name: "What are the account requirements?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You must be at least 18 years old, provide accurate information, maintain account security, and comply with our content guidelines. Sharing account credentials is not permitted."
                }
              }
            ]
          })
        }}
      />
    </div>
  )
} 