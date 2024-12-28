'use client'

import { useEffect, useState, use } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  PencilIcon, 
  CalendarIcon,
  UserIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { marked } from 'marked'

interface Post {
  id: string
  title: string
  content: string
  description: string
  image?: string
  published: boolean
  createdAt: string
  views: number
  author: {
    name: string
    image?: string
  }
}

export default function SinglePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/single/${resolvedParams.slug}`)
        if (!response.ok) throw new Error('Failed to fetch post')
        const data = await response.json()
        setPost(data.post)
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [resolvedParams.slug])

  if (!session) {
    redirect('/auth/signin')
  }

  if (isLoading) {
    return <LoadingPlaceholder />
  }

  if (!post) {
    return <NotFound />
  }
  // Convert markdown to HTML
  const contentHtml = marked(post.content);
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/dashboard/posts"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Posts
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <UserIcon className="h-4 w-4 mr-2" />
  
            <span>{post.author.name}</span>
          </div>
          <span>•</span>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
          <span>•</span>
          <div className="flex items-center">
            {post.views} views
          </div>
        </div>

        <div className=" space-y-6 items-center justify-between">
          <p className="text-gray-500">{post.description}</p>
          <Link
            href={`/dashboard/posts/${resolvedParams.slug}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Post
          </Link>
        </div>
      </header>

      {/* Featured Image */}
      {post.image && (
        <div className="relative aspect-[2/1] mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <div className="py-12 px-14">
            <article
              className="prose prose-lg max-w-none
                prose-headings:text-gray-900 
                prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8
                prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-6
                prose-h3:text-2xl prose-h3:font-bold prose-h3:mb-4
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                prose-blockquote:pl-4 prose-blockquote:italic
                prose-ul:list-disc prose-ul:pl-6
                prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-gray-600 prose-li:mb-2
                prose-img:rounded-lg prose-img:my-8
                prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg
                prose-strong:font-bold prose-strong:text-gray-900
                prose-em:italic
              "
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>

      {/* Article Footer */}
      <footer className="mt-12 pt-8 border-t">
      </footer>
    </article>
  )
}

function LoadingPlaceholder() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="mb-8">
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
      <div className="mb-8">
        <div className="h-10 w-3/4 bg-gray-200 rounded mb-4" />
        <div className="flex gap-4 mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-10 w-24 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="aspect-[2/1] bg-gray-200 rounded-lg mb-8" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
      <h2 className="text-2xl font-bold text-gray-900">Post not found</h2>
      <p className="mt-2 text-gray-500">
        The post you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
      </p>
      <Link
        href="/dashboard/posts"
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Posts
      </Link>
    </div>
  )
} 