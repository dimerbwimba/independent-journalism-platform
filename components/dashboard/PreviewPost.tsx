'use client'

import Image from 'next/image'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from "rehype-sanitize"

interface PreviewPostProps {
  title: string
  seoTitle?: string
  description?: string
  content: string
  image?: string
  categories: { id: string; name: string }[]
}

export default function PreviewPost({ 
  title, 
  seoTitle, 
  description, 
  content, 
  image, 
  categories 
}: PreviewPostProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      {image && (
        <div className="relative w-full h-[300px]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">SEO Preview</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-xl text-blue-800 hover:underline mb-1">
              {seoTitle || title}
            </h4>
            <p className="text-sm text-green-700 mb-2">
              www.yourwebsite.com/posts/...
            </p>
            <p className="text-sm text-gray-600">
              {description || content.slice(0, 160)}...
            </p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <span
                key={category.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        <div data-color-mode="light" className="prose prose-blue max-w-none">
          <MDEditor.Markdown 
            source={content} 
            rehypePlugins={[[rehypeSanitize]]}
            style={{ whiteSpace: 'pre-wrap' }}
          />
        </div>
      </div>
    </article>
  )
} 