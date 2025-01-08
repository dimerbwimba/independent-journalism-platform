import { Metadata } from "next";
import Image from 'next/image'
import Link from 'next/link'
import { BookOpenIcon } from '@heroicons/react/24/outline'
import AccommodationSection from "@/components/AccommodationSection";

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  postCount: number
}

async function getCategories() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/articles/categories`, {
      next: { revalidate: 60 }
    })
    
    if (!res.ok) throw new Error('Failed to fetch categories')
    
    const data = await res.json()
    return data.categories as Category[]
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const metadata: Metadata = {
  title: "Travel Categories & Destinations | Travel Wing Blog",
  description: "Explore travel destinations, tips, and guides across various categories. From adventure travel to luxury getaways, find expert travel insights and stories from experienced travelers.",
  keywords: [
    "travel categories",
    "travel destinations",
    "travel guides",
    "adventure travel",
    "luxury travel",
    "travel tips",
    "travel blog",
    "travel inspiration",
    "travel planning",
    "travel experiences",
    "world destinations",
    "travel wing"
  ],
  openGraph: {
    type: "website",
    title: "Travel Categories & Destinations | Travel Wing Blog",
    description: "Discover amazing travel destinations and expert travel guides. Find inspiration for your next adventure with our curated travel categories and insider tips.",
    url: "https://travelwing.com/categories",
    images: [
      {
        url: "/travel-categories-og.jpg",
        width: 1200,
        height: 630,
        alt: "Explore Travel Categories",
      }
    ],
    siteName: "Travel Wing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Categories & Destinations | Travel Wing Blog",
    description: "Discover amazing travel destinations and expert travel guides. Find inspiration for your next adventure with our curated travel categories and insider tips.",
    images: ["/travel-categories-og.jpg"],
    creator: "@travelwing",
    site: "@travelwing"
  },
  alternates: {
    canonical: "https://travelwing.com/categories",
  }
};

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Explore Travel Categories
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover incredible destinations and travel experiences. From backpacking adventures 
              to luxury escapes, find the perfect travel inspiration for your next journey.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="aspect-[4/3] relative">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                
                {/* Category Info */}
                <div className="absolute inset-x-0 bottom-0 px-4 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                      <BookOpenIcon className="h-4 w-4 text-white" />
                      <span className="text-sm font-medium text-white">{category.postCount}</span>
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-100 line-clamp-2 mb-3">
                      {category.description}
                    </p>
                  )}

                  <span className="inline-flex items-center text-sm font-medium text-blue-300 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Explore Destination
                    <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          ))}
        </div>
        {categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <BookOpenIcon className="h-12 w-12 text-gray-400" />
            <h3 className="mt-3 text-base font-semibold text-gray-900">No destinations yet</h3>
            <p className="mt-2 text-sm text-gray-500">Check back soon for exciting travel destinations.</p>
          </div>
        )}
      </div>
        <AccommodationSection/>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Travel Categories & Destinations",
            description: "Explore travel destinations, guides and tips across various categories",
            url: process.env.NEXT_PUBLIC_APP_URL || "https://travelwing.com/categories",
            publisher: {
              "@type": "Organization",
              name: "Travel Wing",
              url: process.env.NEXT_PUBLIC_APP_URL || "https://travelwing.com",
              logo: {
                "@type": "ImageObject",
                url: process.env.NEXT_PUBLIC_APP_URL || "https://travelwing.com/logo.png"
              }
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: process.env.NEXT_PUBLIC_APP_URL || "https://travelwing.com"
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Travel Categories",
                  item: process.env.NEXT_PUBLIC_APP_URL || "https://travelwing.com/categories"
                }
              ]
            }
          })
        }}
      />
    </div>
  )
} 