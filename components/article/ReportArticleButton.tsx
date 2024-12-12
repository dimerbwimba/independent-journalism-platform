'use client'

import { useState } from 'react'
import { FlagIcon } from '@heroicons/react/24/outline'
import ReportArticleModal from '../ReportArticleModal'
import { useSession } from 'next-auth/react'

interface ReportArticleButtonProps {
  postId: string
}

export default function ReportArticleButton({ postId }: ReportArticleButtonProps) {
  const { data: session } = useSession()
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  // Only show report button for authenticated users
  if (!session) return null

  return (
    <>
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-full  hover:bg-gray-50 transition-colors"
        aria-label="Report Article"
      >
        <FlagIcon className="h-5 w-5" />
        <span>Report Article</span>
      </button>

      <ReportArticleModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        postId={postId}
      />
    </>
  )
}