import { Metadata } from "next";
import Image from 'next/image'
import Link from 'next/link'
import { BookOpenIcon } from '@heroicons/react/24/outline'

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
  title: "Explore Categories | Independent Journalism Platform",
  description: "Discover articles across various topics - from technology to lifestyle. Find expert insights, analysis, and stories from independent voices in your favorite categories.",
  keywords: [
    "article categories",
    "content topics",
    "blog categories",
    "independent journalism",
    "expert insights",
    "knowledge hub",
    "content discovery",
    "topic exploration",
    "curated content",
    "specialized articles"
  ],
  openGraph: {
    type: "website",
    title: "Explore Categories | Independent Journalism Platform",
    description: "Discover articles across various topics - from technology to lifestyle. Find expert insights, analysis, and stories from independent voices in your favorite categories.",
    url: "https://yourplatform.com/categories",
    images: [
      {
        url: "/categories-og.jpg",
        width: 1200,
        height: 630,
        alt: "Explore Content Categories",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Categories | Independent Journalism Platform",
    description: "Discover articles across various topics - from technology to lifestyle. Find expert insights, analysis, and stories from independent voices in your favorite categories.",
    images: ["/categories-og.jpg"],
  },
  alternates: {
    canonical: "https://yourplatform.com/categories",
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
              Explore Our Categories
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Dive into our carefully curated categories. From technology to lifestyle, 
              find the content that matches your interests.
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
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Category Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      <BookOpenIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">{category.postCount}</span>
                    </div>
                  </div>
                  {category.description && (
                    <p className="mt-2 text-sm text-gray-200 line-clamp-2 group-hover:text-white/90 transition-colors">
                      {category.description}
                    </p>
                  )}

                  <div className="mt-4 text-sm text-blue-300 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    View Articles →
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No categories</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating some categories.</p>
          </div>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Content Categories",
            description: "Explore our diverse collection of article categories and topics",
            url: "https://yourplatform.com/categories",
            publisher: {
              "@type": "Organization",
              name: "Independent Journalism Platform",
              url: "https://yourplatform.com"
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
                  name: "Categories",
                  item: "https://yourplatform.com/categories"
                }
              ]
            }
          })
        }}
      />
    </div>
  )
} 