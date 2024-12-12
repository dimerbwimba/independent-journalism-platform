'use client';

import { useEffect, useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

interface ViewCounterProps {
  postId: string;
  initialCount?: number;
}

export default function ViewCounter({ postId, initialCount = 0 }: ViewCounterProps) {
  const [viewCount, setViewCount] = useState(initialCount);

  useEffect(() => {
    const recordView = async () => {
      try {
        // Get client IP from our own API
        const ipResponse = await fetch('https://api.ipify.org/?format=json');
        const { ip } = await ipResponse.json();

        // Get or create session ID from localStorage
        let sessionId = localStorage.getItem('blog_session_id');
        if (!sessionId) {
          sessionId = crypto.randomUUID();
          localStorage.setItem('blog_session_id', sessionId);
        }

        const response = await fetch(`/api/posts/${postId}/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            ip,
            userAgent: navigator.userAgent,
          }),
        });

        const data = await response.json();
        if (!data.duplicate) {
          setViewCount(data.viewCount);
        }
      } catch (error) {
        console.error('Error recording view:', error);
      }
    };

    recordView();
  }, [postId]);

  return (
    <div className="flex items-center gap-1 text-gray-500">
      <EyeIcon className="h-5 w-5" />
      <span>{viewCount.toLocaleString()} views</span>
    </div>
  );
} 