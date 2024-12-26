'use client'

import { useState, useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'
import ShareButton from './ShareButton'

const REACTIONS = {
  heart: { emoji: '❤️', label: 'Love' },
  mindblown: { emoji: '🤯', label: 'Mind Blown' },
  unicorn: { emoji: '🦄', label: 'Unicorn' },
  handsdown: { emoji: '🙌', label: 'Hands Down' }
}

interface User {
  id: string
  name: string
}

interface ShareCounts {
  facebook: number
  twitter: number
  linkedin: number
  whatsapp: number
}
interface PostReactionsProps {
  postId: string
  currentUser?: User | null
  initialReactions?: Record<string, number>
  variant: 'mobile' | 'desktop'
  shares: ShareCounts
  description: string
}

export default function PostReactions({ 
  postId, 
  currentUser, 
  initialReactions = {},
  variant,
  shares,
  description
}: PostReactionsProps) {
  const [reactions, setReactions] = useState(initialReactions)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) {
      return // Return early if not client-side
    }
    
    if (variant === 'desktop') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setIsVisible(false)
            } else {
              const heroRect = document.querySelector('.hero-section')?.getBoundingClientRect()
              const commentsRect = document.getElementById('comments')?.getBoundingClientRect()
              
              if (heroRect && commentsRect) {
                setIsVisible(heroRect.bottom < 0 && commentsRect.top > window.innerHeight)
              }
            }
          })
        },
        {
          threshold: 0,
        }
      )

      const hero = document.querySelector('.hero-section')
      const comments = document.getElementById('comments')

      if (hero) observer.observe(hero)
      if (comments) observer.observe(comments)

      return () => observer.disconnect()
    }
  }, [variant, isClient])

  if (!isClient) {
    return null // Return null on server-side
  }

  const handleReaction = async (type: string) => {
    if (!currentUser) {
      signIn('google')
      return
    }

    if (isLoading) return
    setIsLoading(true)

    try {
      const response = await fetch(`/api/articles/add/${postId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })

      if (!response.ok) throw new Error('Failed to react')

      const data = await response.json()
      setReactions(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`
        transition-opacity duration-300 py-2
        ${variant === 'desktop' && !isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        ${isLoading ? 'opacity-50' : ''}
        flex ${variant === 'desktop' ? 'flex-col' : 'justify-center'} gap-2
      `}
    >
      <ShareButton
        postId={postId}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title={document.title}
        initialCounts={shares}
        description={description}
      />
      {Object.entries(REACTIONS).map(([type, { emoji, label }]) => (
        <button
          key={type}
          onClick={() => handleReaction(type)}
          disabled={isLoading}
          className={`
            flex flex-row justify-center relative items-center rounded-full
            ${reactions[type] ? 'bg-gray-200' : 'hover:bg-gray-50'} 
            transition-all disabled:opacity-50
            ${variant === 'mobile' ? 'flex-1' : ''}
          `}
          title={label}
        >
          <span className={`${variant === 'mobile' ? 'text-xl' : 'text-2xl'}`}>
            {emoji}
          </span>
          <div className=' absolute -top-4 right-0 lg:top-1 lg:right-6 w-16  px-2'>
            {reactions[type] > 0 && (
              <span className="text-xs font-medium bg-gray-200 rounded-full px-2 py-1">
                {reactions[type]}
              </span>
            )}

          </div>
        </button>
      ))}
    </div>
  )
} 