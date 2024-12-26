import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { 
  GlobeAltIcon, 
  NewspaperIcon, 
  UserGroupIcon, 
  BanknotesIcon,
  RocketLaunchIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

// SEO Metadata
export const metadata: Metadata = {
  title: 'About Us | Independent Travel Blog',
  description: 'Founded by Bwimba Mihandgo Dimer, we\'re sharing authentic travel experiences and stories from DRC Congo and beyond, empowering independent voices in travel journalism.',
  openGraph: {
    title: 'About Us | Independent Travel Blog',
    description: 'Founded by Bwimba Mihandgo Dimer, we\'re sharing authentic travel experiences and stories from DRC Congo and beyond, empowering independent voices in travel journalism.',
    images: [
      {
        url: '/about-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'About Us - Independent Travel Blog',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Independent Travel Blog',
    description: 'Founded by Bwimba Mihandgo Dimer, we\'re sharing authentic travel experiences and stories from DRC Congo and beyond.',
    images: ['/about-hero.jpg'],
  },
  keywords: [
    'travel blog',
    'DRC Congo travel',
    'North Kivu',
    'African travel',
    'travel stories',
    'travel content',
    'travel experiences',
    'travel writing',
    'travel journalism',
    'authentic travel'
  ],
  authors: [{ name: 'Bwimba Mihandgo Dimer' }],
  creator: 'Bwimba Mihandgo Dimer',
  publisher: 'Independent Travel Blog',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Independent Travel Blog",
      "description": "A platform for authentic travel stories and experiences from DRC Congo and beyond.",
      "founder": {
        "@type": "Person",
        "name": "Bwimba Mihandgo Dimer"
      },
      "url": process.env.NEXT_PUBLIC_APP_URL,
      "sameAs": [
        "https://twitter.com/yourtravelblog",
        "https://facebook.com/yourtravelblog",
        "https://instagram.com/yourtravelblog"
      ]
    })
  }
}

function calculateAge(birthYear: number): number {
  const currentYear = new Date().getFullYear()
  return currentYear - birthYear
}

export default function AboutPage() {
  const founderAge = calculateAge(1995) // Born in 1995

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Empowering Voices, Connecting Ideas
              </h1>
              <p className="text-xl text-blue-100">
                Founded in 2023, we&apos;re on a mission to democratize journalism and create a platform where every voice matters.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
              <Image
                src="/about-hero.jpg" // Add this image to your public folder
                alt="About Hero"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl relative"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-10"></div>
              <Image
                src="/seo.svg" // Add founder's image
                alt="Bwimba Mihandgo Dimer"
                width={400}
                height={500}
                className="rounded-2xl  relative"
              />
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Founder & CEO
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Bwimba Mihandgo Dimer
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Born in Rwanguba, a small village in North Kivu province, Democratic Republic of Congo, 
                Bwimba Mihandgo Dimer ({founderAge} years old) has always been driven by a vision of 
                independent journalism and free speech for all.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Growing up in a region where voices often go unheard, he recognized the power of digital 
                platforms to amplify stories and connect people. This inspiration led to the creation of 
                this platform, where quality content meets fair monetization opportunities.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <GlobeAltIcon className="w-5 h-5" />
                  DRC, North Kivu
                </span>
                <span>•</span>
                <span>Est. 2023</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built on the principles of transparency, fairness, and quality content
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <NewspaperIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Quality Content
              </h3>
              <p className="text-gray-600">
                All articles go through a thorough review process to ensure high-quality, factual content.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BanknotesIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Fair Monetization
              </h3>
              <p className="text-gray-600">
                $0.30 per 1,000 views with transparent payout systems and creator support.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Community First
              </h3>
              <p className="text-gray-600">
                Built around a vibrant community of writers, readers, and thought leaders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To showcase the beauty, culture, and stories of DRC Congo and beyond through 
                authentic travel experiences and compelling storytelling.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <RocketLaunchIcon className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">Launched in August 2023</span>
                </div>
                <div className="flex items-center gap-3">
                  <HeartIcon className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">Growing community of passionate creators</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Values
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    1
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900">Independence</h3>
                    <p className="text-gray-600">Supporting free and independent journalism</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    2
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900">Transparency</h3>
                    <p className="text-gray-600">Clear monetization policies and content guidelines</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    3
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900">Quality</h3>
                    <p className="text-gray-600">Maintaining high standards for published content</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Be part of a platform that values independent voices and rewards quality content.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/register"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Start Writing
            </Link>
            <Link
              href="/categories"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
            >
              Explore Content
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 