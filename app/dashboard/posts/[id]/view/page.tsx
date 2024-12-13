import { Metadata } from 'next'
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"
import PreviewPost from "@/components/dashboard/PreviewPost"
import Breadcrumb from "@/components/dashboard/Breadcrumb"
import Link from "next/link"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { id: params.id }
  })

  return {
    title: post?.seoTitle || post?.title,
    description: post?.description,
  }
}

export default async function ViewPostPage({
  params
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  const post = await prisma.post.findUnique({
    where: { 
      id: params.id,
      authorId: session.user.id
    },
    include: {
      categories: {
        include: {
          category: true
        }
      }
    }
  })

  if (!post) redirect('/dashboard/posts')

  return (
    <div className="space-y-6 p-8">
      <Breadcrumb />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Post Preview
        </h2>
        <div className="flex space-x-4">
          <Link
            href={`/dashboard/posts/${post.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Edit Post
          </Link>
          <Link
            href="/dashboard/posts"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Posts
          </Link>
        </div>
      </div>

      <PreviewPost
        title={post.title}
        content={post.content}
        image={post.image || undefined}
        categories={post.categories.map(pc => pc.category)}
      />
    </div>
  )
} 