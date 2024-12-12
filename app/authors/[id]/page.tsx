import { Metadata } from "next";
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { UserAvatar } from "@/components/UserAvatar"
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

interface Author {
  id: string
  name: string | null
  image: string | null
  role: string | null
  createdAt: string
  isMonetized: boolean
  totalEarnings: number
}

interface Stats {
  totalViews: number
  totalReactions: number
  totalComments: number
  totalPosts: number
}

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
  createdAt: string
  viewCount: number
  reactionCount: number
  commentCount: number
  shareCount: number
}

interface AuthorData {
  author: Author
  stats: Stats
  posts: Post[]
}

async function getAuthorData(id: string): Promise<AuthorData | null> {
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

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getAuthorData(params.id)
  if (!data) return { title: 'Author Not Found' }

  const { author, stats } = data
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourplatform.com'
  
  return {
    title: `${author.name} - Independent Journalism Platform`,
    description: `Read articles by ${author.name}. ${stats.totalPosts} articles published with ${stats.totalViews.toLocaleString()} total views.`,
    keywords: [
      author.name || '',
      'independent journalist',
      'content creator',
      'articles',
      'blog posts',
      'independent journalism'
    ],
    authors: [{ name: author.name || '' }],
    openGraph: {
      title: `${author.name} - Independent Journalism Platform`,
      description: `Read articles by ${author.name}. ${stats.totalPosts} articles published with ${stats.totalViews.toLocaleString()} total views.`,
      url: `${baseUrl}/authors/${author.id}`,
      siteName: 'Independent Journalism Platform',
      images: [
        {
          url: author.image || `${baseUrl}/default-author.jpg`,
          width: 1200,
          height: 630,
          alt: `${author.name}'s profile picture`
        }
      ],
      locale: 'en_US',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${author.name} - Independent Journalism Platform`,
      description: `Read articles by ${author.name}. ${stats.totalPosts} articles published with ${stats.totalViews.toLocaleString()} total views.`,
      images: [author.image || `${baseUrl}/default-author.jpg`],
      creator: '@yourplatform',
    },
    alternates: {
      canonical: `${baseUrl}/authors/${author.id}`,
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
}

export default async function AuthorPage({ params }: { params: { id: string } }) {
  const data = await getAuthorData(params.id)
  if (!data) notFound()

  const { author, stats, posts } = data
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourplatform.com'
  const featuredPosts = posts.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Author Profile */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-start gap-8">
            {author.image && (
              <Image
                src={author.image}
                alt={author.name || ''}
                width={120}
                height={120}
                className="rounded-full"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{author.name}</h1>
                {author.role === 'admin' && (
                  <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <CalendarIcon className="w-4 h-4" />
                <span>Joined {new Date(author.createdAt).toLocaleDateString()}</span>
              </div>
              {author.isMonetized && (
                <div className="flex items-center gap-2 text-green-600 mb-6">
                  <BanknotesIcon className="w-5 h-5" />
                  <span className="font-medium">Monetized Creator</span>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <DocumentTextIcon className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-2xl font-bold text-gray-900">{stats.totalPosts}</span>
                  <span className="text-sm text-gray-500">Articles</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <EyeIcon className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">Views</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <HeartIcon className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-2xl font-bold text-gray-900">{stats.totalReactions.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">Reactions</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <ChatBubbleLeftIcon className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-2xl font-bold text-gray-900">{stats.totalComments.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">Comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <Link 
                key={post.id}
                href={`/article/${post.slug}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {post.image && (
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <EyeIcon className="w-4 h-4" />
                      {post.viewCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <HeartIcon className="w-4 h-4" />
                      {post.reactionCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      {post.commentCount.toLocaleString()}
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
            {posts.map((post) => (
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
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <EyeIcon className="w-4 h-4" />
                      {post.viewCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <HeartIcon className="w-4 h-4" />
                      {post.reactionCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              "@id": `${baseUrl}/authors/${author.id}`,
              name: author.name,
              image: author.image,
              jobTitle: author.isMonetized ? "Monetized Creator" : "Content Creator",
              worksFor: {
                "@type": "Organization",
                name: "Independent Journalism Platform",
                url: baseUrl
              },
              url: `${baseUrl}/authors/${author.id}`,
              description: `Content creator with ${stats.totalPosts} articles and ${stats.totalViews.toLocaleString()} total views.`,
              sameAs: [
                `${baseUrl}/authors/${author.id}`,
                // Add social media links if available
              ],
              interactionStatistic: [
                {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/ReadAction",
                  userInteractionCount: stats.totalViews
                },
                {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/CommentAction",
                  userInteractionCount: stats.totalComments
                },
                {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/LikeAction",
                  userInteractionCount: stats.totalReactions
                }
              ],
              knowsAbout: posts.map(post => post.categories).flat().map(cat => cat.name),
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `${baseUrl}/authors/${author.id}`
              }
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: baseUrl
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Authors",
                  item: `${baseUrl}/authors`
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: author.name,
                  item: `${baseUrl}/authors/${author.id}`
                }
              ]
            }
          })
        }}
      />
    </div>
  )
}