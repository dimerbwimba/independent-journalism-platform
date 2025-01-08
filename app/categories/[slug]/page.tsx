import { Metadata } from "next";
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpenIcon } from '@heroicons/react/24/outline'
import AccommodationSection from "@/components/AccommodationSection";

interface Author {
  name: string
  image?: string
}

interface Post {
  id: string
  slug: string
  title: string
  description?: string
  image?: string
  author: Author
  createdAt: string
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  posts: Post[]
}

async function getCategory(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/articles/categories/${slug}`, {
      next: { revalidate: 60 }
    })
    
    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error('Failed to fetch category')
    }
    
    const data = await res.json()
    return data.category as Category
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug);
  
  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found."
    };
  }

  return {
    title: `${category.name} Articles | Independent Travel Blog`,
    description: category.description || `Explore our collection of articles about ${category.name}. Find expert insights, analysis, and stories from independent voices.`,
    keywords: [
      category.name.toLowerCase(),
      "articles",
      "blog posts",
      "expert insights",
      "independent journalism",
      `${category.name.toLowerCase()} content`,
      "quality content",
      "independent writers",
      "specialized articles",
      "expert analysis"
    ],
    openGraph: {
      title: `${category.name} Articles | Independent Travel Blog`,
      description: category.description || `Explore our collection of articles about ${category.name}. Find expert insights, analysis, and stories from independent voices.`,
      url: `https://yourplatform.com/categories/${category.slug}`,
      images: [
        {
          url: category.image || "/default-category-og.jpg",
          width: 1200,
          height: 630,
          alt: `${category.name} Category`,
        }
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} Articles | Independent Travel Blog`,
      description: category.description || `Explore our collection of articles about ${category.name}. Find expert insights, analysis, and stories from independent voices.`,
      images: [category.image || "/default-category-og.jpg"],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/categories/${category.slug}`,
    }
  };
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const {slug} = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header with Image */}
      <section className="relative h-[60vh] min-h-[550px] bg-gray-900">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            priority
            className="object-cover opacity-50"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700" />
        )}
        
        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
        
        <div className="relative h-full max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 pt-10">
          <div className="flex flex-col justify-end h-full pb-20 pt-4">
            <div className="flex items-center space-x-2 text-blue-400 mb-4">
              <Link href="/categories" className="hover:text-blue-300 transition-colors">
                Categories
              </Link>
              <span>/</span>
              <span>{category.name}</span>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6">
              {category.name}
            </h1>
            
            {category.description && (
              <p className="text-xl text-gray-300 max-w-2xl line-clamp-6">
                {category.description}
              </p>
            )}
            
            <div className="flex items-center mt-6 text-gray-300">
              <BookOpenIcon className="h-6 w-6 mr-2" />
              <span className="text-lg">{category.posts.length} Articles in this category</span>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.posts.map((post) => (
              <article 
                key={post.id}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50" />
                  )}
                </div>
                
                <div className="p-4">
                <time className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                  <Link href={`/article/${post.slug}`}>
                    <h3 className="text-xl font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  
                  {post.description && (
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {post.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          {category.posts.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-semibold text-gray-900">No articles yet</h3>
              <p className="mt-1 text-gray-500">Check back later for new content in this category.</p>
            </div>
          )}
        </div>
        
      </section>
      <section>
      <AccommodationSection/>
      </section>
      {/* Add Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${category.name} Articles`,
            description: category.description || `Articles about ${category.name}`,
            url: `https://yourplatform.com/categories/${category.slug}`,
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
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: category.name,
                  item: `https://yourplatform.com/categories/${category.slug}`
                }
              ]
            },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: category.posts.map((article, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Article",
                  headline: article.title,
                  description: article.description,
                  url: `https://yourplatform.com/article/${article.slug}`,
                  author: {
                    "@type": "Person",
                    name: article.author.name
                  },
                  datePublished: article.createdAt,
                  image: article.image || "/default-article-image.jpg"
                }
              }))
            }
          })
        }}
      />
    </div>
  )
} 