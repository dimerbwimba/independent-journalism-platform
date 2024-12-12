'use client'

import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

interface VideoPreviewProps {
  url: string
}

export default function VideoPreview({ url }: VideoPreviewProps) {
  return (
    <div className="aspect-video relative">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        pip
        stopOnUnmount={false}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0
            }
          }
        }}
      />
    </div>
  )
} 