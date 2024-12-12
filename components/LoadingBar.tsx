'use client'

import { useEffect, useState } from 'react'

export default function LoadingBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress === 90) return 90
        return Math.min(oldProgress + 30, 90)
      })
    }, 350)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-blue-100">
        <div 
          className="h-1 bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
} 