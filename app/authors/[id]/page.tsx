import { Metadata } from "next";
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  TrophyIcon,
  BanknotesIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  CalendarIcon
} from "@heroicons/react/24/outline"
import { ShieldCheckIcon } from "@heroicons/react/24/solid"

// interface Author {
//   id: string
//   name: string | null
//   image: string | null
//   role: string | null
//   createdAt: string
//   isMonetized: boolean
//   totalEarnings: number
// }

// interface Stats {
//   totalViews: number
//   totalReactions: number
//   totalComments: number
//   totalPosts: number
// }

interface Post {
  id: string
  title: string
  slug: string
  description?: string
  image?: string
  categories: {
    id: string
    name: string
    slug: string
  }[]
  createdAt?: string
  stats: {
    views: number
    reactions: number
    comments: number
  }
}

async function getAuthorData(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/articles/authors/${id}`, {
      next: { revalidate: 60 }
    })
    
    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error('Failed to fetch author')
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching author:', error)
    return null
  }
}

// Generate Metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getAuthorData(params.id);
  
  if (!data) {
    return {
      title: "Author Not Found",
      description: "The requested author profile could not be found."
    };
  }

  const { author, stats } = data;
  const isMonetized = author.isMonetized ? "Monetized Creator" : "Content Creator";
  const joinDate = new Date(author.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return {
    title: `${author.name} - ${isMonetized} | Independent Journalism Platform`,
    description: `Read articles by ${author.name}. ${stats.totalPosts} quality articles with ${stats.totalViews.toLocaleString()} views. Member since ${joinDate}.`,
    keywords: [
      author.name.toLowerCase(),
      "independent journalist",
      "content creator",
      "blog writer",
      "expert author",
      isMonetized.toLowerCase(),
      "quality content",
      "independent voice",
      "professional writer",
      "thought leader"
    ],
    authors: [{ name: author.name }],
    openGraph: {
      title: `${author.name} - ${isMonetized}`,
      description: `Read articles by ${author.name}. ${stats.totalPosts} quality articles with ${stats.totalViews.toLocaleString()} views.`,
      url: `https://yourplatform.com/authors/${author.id}`,
      images: [
        {
          url: author.image || "/default-author-og.jpg",
          width: 1200,
          height: 630,
          alt: author.name,
        }
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${author.name} - ${isMonetized}`,
      description: `Read articles by ${author.name}. ${stats.totalPosts} quality articles with ${stats.totalViews.toLocaleString()} views.`,
      images: [author.image || "/default-author-og.jpg"],
      creator: "@yourplatform",
    },
    alternates: {
      canonical: `https://yourplatform.com/authors/${author.id}`,
    }
  };
}

export default async function AuthorPage({
  params
}: {
  params: { id: string }
}) {
  const data = await getAuthorData(params.id)
  if (!data) notFound()

  const { author, stats, popularPosts, posts } = data

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Author Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-12">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="relative">
              {author.image ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-lg opacity-20 animate-pulse" />
                  <Image
                    src={author.image}
                    alt={author.name || ''}
                    width={120}
                    height={120}
                    className="rounded-full ring-4 ring-white shadow-xl relative"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-lg opacity-20 animate-pulse" />
                  <div className="w-30 h-30 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ring-4 ring-white shadow-xl relative">
                    <span className="text-4xl font-medium text-blue-600">
                      {author.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              {author.role === 'admin' && (
                <div className="absolute -top-2 -right-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-sm opacity-20" />
                    <ShieldCheckIcon className="w-8 h-8 text-blue-600 drop-shadow-lg" />
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                    {author.name}
                  </h1>
                  {author.isMonetized && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200 shadow-sm">
                      <BanknotesIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Monetized Creator</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Joined {new Date(author.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                  {author.isMonetized && (
                    <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full">
                      <BanknotesIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700">${author.totalEarnings.toFixed(2)} earned</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Author Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium">Posts</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <EyeIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="font-medium">Views</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <div className="p-2 bg-pink-50 rounded-lg">
                      <HeartIcon className="w-5 h-5 text-pink-600" />
                    </div>
                    <span className="font-medium">Reactions</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReactions.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <ChatBubbleLeftIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium">Comments</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalComments.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-12 space-y-12">
        {/* Popular Posts */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg shadow-lg">
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Most Popular Articles</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {popularPosts.map((post: Post) => (
              <Link 
                key={post.id}
                href={`/article/${post.slug}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-200"
              >
                <div className="relative h-48">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <span className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {post.stats.views.toLocaleString()} views
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-lg">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <HeartIcon className="w-4 h-4" />
                      {post.stats.reactions}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      {post.stats.comments}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post: Post) => (
              <Link 
                key={post.id}
                href={`/article/${post.slug}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-200 hover:border-blue-200"
              >
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 text-lg">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                  <span>{new Date(post.createdAt!).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <EyeIcon className="w-4 h-4" />
                      {post.stats.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <HeartIcon className="w-4 h-4" />
                      {post.stats.reactions.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Add Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: author.name,
              image: author.image,
              jobTitle: author.isMonetized ? "Monetized Creator" : "Content Creator",
              worksFor: {
                "@type": "Organization",
                name: "Independent Journalism Platform"
              },
              url: `https://yourplatform.com/authors/${author.id}`,
              description: `Content creator with ${stats.totalPosts} articles and ${stats.totalViews.toLocaleString()} total views.`,
              memberOf: {
                "@type": "Organization",
                name: "Independent Journalism Platform",
                url: "https://yourplatform.com"
              },
              knowsAbout: posts.flatMap((post:Post) => post.categories.map(cat => cat.name)),
              interactionStatistic: [
                {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/ReadAction",
                  userInteractionCount: stats.totalViews
                },
                {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/LikeAction",
                  userInteractionCount: stats.totalReactions
                },
                {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/CommentAction",
                  userInteractionCount: stats.totalComments
                }
              ]
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
                  name: "Authors",
                  item: "https://yourplatform.com/authors"
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: author.name,
                  item: `https://yourplatform.com/authors/${author.id}`
                }
              ]
            }
          })
        }}
      />
    </div>
  )
} 