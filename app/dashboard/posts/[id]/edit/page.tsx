import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/options"
import prisma from "@/lib/prisma"
import Breadcrumb from "@/components/dashboard/Breadcrumb"
import PostForm from "@/components/dashboard/PostForm"

export default async function EditPostPage({
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
    }
  })

  if (!post) redirect('/dashboard/posts')

  return (
    <div className="space-y-6 p-8">
      <Breadcrumb />

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <PostForm post={{...post, image: post.image || undefined}} />
      </div>
    </div>
  )
} 