'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
    FlagIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
    ShieldExclamationIcon,
    DocumentTextIcon,
    LinkIcon,
    UserIcon,
    SparklesIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline'

const REPORT_REASONS = [
    {
        id: 'inappropriate',
        icon: ExclamationTriangleIcon,
        label: 'Inappropriate Content',
        description: 'Contains adult, offensive, or inappropriate material'
    },
    {
        id: 'misinformation',
        icon: ShieldExclamationIcon,
        label: 'Misinformation',
        description: 'Contains false or misleading information'
    },
    {
        id: 'plagiarism',
        icon: DocumentTextIcon,
        label: 'Plagiarism',
        description: 'Content copied from another source without attribution'
    },
    {
        id: 'spam',
        icon: LinkIcon,
        label: 'Spam or Advertising',
        description: 'Contains spam, scams, or unwanted advertising'
    },
    {
        id: 'harassment',
        icon: UserIcon,
        label: 'Harassment or Hate Speech',
        description: 'Contains personal attacks or discriminatory content'
    },
    {
        id: 'quality',
        icon: SparklesIcon,
        label: 'Poor Quality',
        description: 'Low effort, poorly written, or doesn\'t meet guidelines'
    }
]

interface ReportArticleModalProps {
    isOpen: boolean
    onClose: () => void
    postId: string
}

export default function ReportArticleModal({ isOpen, onClose, postId }: ReportArticleModalProps) {
    const { data: session } = useSession()
    const [selectedReason, setSelectedReason] = useState('')
    const [details, setDetails] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    // Handle escape key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session) return

        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch('/api/articles/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId,
                    reason: selectedReason,
                    details
                })
            })

            if (!response.ok) throw new Error('Failed to submit report')

            setIsSuccess(true)
            setTimeout(() => {
                onClose()
                setIsSuccess(false)
                setSelectedReason('')
                setDetails('')
            }, 2000)
        } catch (error:any) {
            setError('Failed to submit report. Please try again later or contact support. '+error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 ">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Center Modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl">
                    {/* Modal */}
                    <div className="h-[400px] overflow-y-auto  scrollbar">
                        <div className="relative p-6">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="h-6 w-6" />
                            </button>

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <FlagIcon className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Report Article
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Help us maintain quality content by reporting issues
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            {isSuccess ? (
                                <div className="py-8 text-center">
                                    <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                                    <h3 className="mt-2 text-lg font-semibold text-gray-900">Report Submitted</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Thank you for helping us maintain quality content.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        {REPORT_REASONS.map((reason) => (
                                            <label
                                                key={reason.id}
                                                className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${selectedReason === reason.id
                                                        ? 'border-red-500 bg-red-50'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="reason"
                                                    value={reason.id}
                                                    checked={selectedReason === reason.id}
                                                    onChange={(e) => setSelectedReason(e.target.value)}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <reason.icon className="h-5 w-5 text-gray-400" />
                                                        <span className="font-medium text-gray-900">{reason.label}</span>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{reason.description}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Additional Details (Optional)
                                        </label>
                                        <textarea
                                            value={details}
                                            onChange={(e) => setDetails(e.target.value)}
                                            rows={3}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                            placeholder="Provide any additional context..."
                                        />
                                    </div>

                                    {error && (
                                        <div className="rounded-lg bg-red-50 p-4">
                                            <div className="flex">
                                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                                                <p className="ml-3 text-sm text-red-700">{error}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!selectedReason || isSubmitting}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 