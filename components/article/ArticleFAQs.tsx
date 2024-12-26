'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface FAQ {
  id: string
  question: string
  answer: string
}

interface ArticleFAQsProps {
  faqs: FAQ[]
}

export default function ArticleFAQs({ faqs }: ArticleFAQsProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null)

  if (!faqs?.length) return null

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border border-gray-200 rounded-lg"
          >
            <button
              onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
              className="w-full flex justify-between items-center p-4 text-left"
              aria-expanded={openFaqId === faq.id}
            >
              <span className="text-lg font-medium text-gray-900">{faq.question}</span>
              <ChevronDownIcon 
                className={cn(
                  "h-5 w-5 text-gray-500 transition-transform duration-200",
                  openFaqId === faq.id ? "transform rotate-180" : ""
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-200",
                openFaqId === faq.id ? "max-h-96 p-4 pt-0" : "max-h-0"
              )}
            >
              <p className="prose text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 