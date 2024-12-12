'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ReplyModal from './ReplyModal'
import { TrashIcon } from '@heroicons/react/24/outline'
import LoadingBar from './LoadingBar'
import { isSpam } from '@/utils/spamDetection';
import { signIn } from 'next-auth/react'

interface User {
  id: string
  name: string
  image?: string | null
  email?: string
  role?: string
}

interface Vote {
  type: 'up' | 'down'
  userId: string
}

interface Comment {
  id: string
  text: string
  createdAt: string
  parentId?: string
  user: User
  replies: Comment[]
  votes: Vote[] | undefined
}

interface CommentSectionProps {
  postId: string
  currentUser?: User | null
}

export default function CommentSection({ postId, currentUser }: CommentSectionProps) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<{ id: string; userName: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [lastCommentTime, setLastCommentTime] = useState<number>(0)
  const COOLDOWN_PERIOD = 60000 // 60 seconds in milliseconds
  const MAX_COMMENT_LENGTH = 200
  const MAX_REPLY_LENGTH = 250
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    fetchComments()
  }, [postId])

  useEffect(() => {
    if (error?.includes('Please wait')) {
      const seconds = Math.ceil((COOLDOWN_PERIOD - (Date.now() - lastCommentTime)) / 1000);
      setCountdown(seconds);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setError(null); // Clear error when countdown reaches 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [error, lastCommentTime]);

  const fetchComments = async () => {
    setIsLoadingComments(true)
    try {
      const response = await fetch(`/api/comments?postId=${postId}`)
      if (!response.ok) throw new Error('Failed to fetch comments')
      
      const data = await response.json()
      setComments(data.comments)
    } catch (err) {
      setError('Failed to load comments')
      console.error(err)
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleMainSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!currentUser) {
      router.push('/auth/signin')
      return
    }

    if (!newComment.trim()) return
    await handleReplySubmit(newComment)
  }

  const canComment = () => {
    const now = Date.now()
    return now - lastCommentTime >= COOLDOWN_PERIOD
  }

  const handleReplySubmit = async (text: string) => {
    if (!canComment()) {
      setError(`Please wait ${Math.ceil((COOLDOWN_PERIOD - (Date.now() - lastCommentTime)) / 1000)} seconds before commenting again`)
      return
    }

    if (text.length > (replyTo ? MAX_REPLY_LENGTH : MAX_COMMENT_LENGTH)) {
      setError(`Maximum ${replyTo ? MAX_REPLY_LENGTH : MAX_COMMENT_LENGTH} characters allowed`)
      return
    }

    const spamCheck = isSpam(text);
    if (spamCheck.isSpam) {
      setError(`Comment looks like spam: ${spamCheck.reason}`)
      return
    }

    if (!text.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          text,
          parentId: replyTo?.id
        }),
      })

      if (!response.ok) throw new Error('Failed to post comment')

      const data = await response.json()
      
      if (replyTo) {
        setComments(comments.map(comment => 
          comment.id === replyTo.id 
            ? { ...comment, replies: [...comment.replies, data.comment] }
            : comment
        ))
      } else {
        setComments([...comments, data.comment])
      }
      
      setNewComment('')
      setReplyTo(null)
      setIsReplyModalOpen(false)
    } catch (err) {
      setError('Failed to post comment')
    } finally {
      setIsLoading(false)
    }
    setLastCommentTime(Date.now())
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment? All replies will also be deleted.')) {
      return
    }

    setIsDeletingId(commentId)
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete comment')
      }

      setComments(prevComments => {
        return prevComments.map(comment => {
          if (comment.id === commentId) {
            return null
          }
          if (comment.replies?.length > 0) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== commentId)
            }
          }
          return comment
        }).filter(Boolean) as Comment[]
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment')
      console.error(err)
    } finally {
      setIsDeletingId(null)
    }
  }

  const CommentSkeleton = () => (
    <div className="bg-white rounded-lg p-6 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  )

  const CommentCard = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const [votes, setVotes] = useState({
      upvotes: comment.votes?.filter(v => v.type === 'up').length || 0,
      downvotes: comment.votes?.filter(v => v.type === 'down').length || 0,
    });
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(
      comment.votes?.find(v => v.userId === currentUser?.id)?.type || null
    );
    const [isVoting, setIsVoting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleVote = async (type: 'up' | 'down') => {
      if (!currentUser) {
        handleSignIn('google');
        return;
      }

      if (isVoting) return;
      setIsVoting(true);

      try {
        const response = await fetch(`/api/comments/${comment.id}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type }),
        });

        if (!response.ok) throw new Error('Failed to vote');

        const data = await response.json();
        setVotes({ upvotes: data.upvotes, downvotes: data.downvotes });
        setUserVote(userVote === type ? null : type);
      } catch (err) {
        console.error(err);
      } finally {
        setIsVoting(false);
      }
    };

    const handleDelete = async () => {
      if (!window.confirm('Are you sure you want to delete this comment?')) {
        return;
      }

      setIsDeleting(true);
      try {
        const response = await fetch(`/api/comments/${comment.id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete comment');
        }

        // Update state to handle both comments and replies
        setComments(prevComments => {
          if (isReply) {
            // Handle reply deletion
            return prevComments.map(c => ({
              ...c,
              replies: c.replies.filter(r => r.id !== comment.id)
            }));
          } else {
            // Handle main comment deletion
            return prevComments.filter(c => c.id !== comment.id);
          }
        });
      } catch (err) {
        console.error(err);
        setError('Failed to delete comment');
      } finally {
        setIsDeleting(false);
      }
    };

    return (
      <div className={`${isReply ? 'ml-10 mt-2' : 'mt-4'} relative`}>
        {(isVoting || isDeleting) && <LoadingBar />}
        <div className={`flex gap-2 ${isVoting || isDeleting ? 'opacity-50' : ''}`}>
          {/* Vote buttons */}
          <div className="flex flex-col items-center gap-0.5 mt-1">
            <button
              onClick={() => handleVote('up')}
              disabled={isVoting}
              className={`p-1 rounded-full hover:bg-gray-100 ${
                userVote === 'up' ? 'scale-110' : ''
              } transition-all disabled:opacity-50 text-base`}
              title="Like"
            >
              {userVote === 'up' ? '❤️' : '🤍'}
            </button>
            <span className="text-xs font-medium text-gray-500">{votes.upvotes - votes.downvotes}</span>
            <button
              onClick={() => handleVote('down')}
              disabled={isVoting}
              className={`p-1 rounded-full hover:bg-gray-100 ${
                userVote === 'down' ? 'scale-110' : ''
              } transition-all disabled:opacity-50 text-base`}
              title="Dislike"
            >
              {userVote === 'down' ? '👎' : '👎🏻'}
            </button>
          </div>

          {/* Comment content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0">
                {comment.user.image ? (
                  <Image
                    src={comment.user.image}
                    alt={comment.user.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-sm">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-gray-100 rounded-2xl px-3 py-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {comment.user.name}
                  </h3>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs">
                  <time className="text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                  {!isReply && currentUser && (
                    <button
                      onClick={() => {
                        setReplyTo({ id: comment.id, userName: comment.user.name })
                        setIsReplyModalOpen(true)
                      }}
                      className="font-medium text-gray-500 hover:text-gray-700"
                    >
                      Reply
                    </button>
                  )}
                  {(currentUser?.id === comment.user.id || currentUser?.role === 'admin') && (
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Delete comment"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Replies */}
            {comment.replies?.length > 0 && (
              <div className="mt-2 space-y-2">
                {comment.replies.map(reply => (
                  <CommentCard key={reply.id} comment={reply} isReply />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const handleSignIn = (provider: 'google' | 'credentials') => {
    const currentPath = window.location.pathname;
    signIn(provider, { callbackUrl: currentPath });
  };

  // Add a helper function to calculate net votes
  const getNetVotes = (comment: Comment) => {
    const upvotes = comment.votes?.filter(v => v.type === 'up').length || 0;
    const downvotes = comment.votes?.filter(v => v.type === 'down').length || 0;
    return upvotes - downvotes;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
        <span className="text-gray-500 text-sm">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoadingComments ? (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        ) : comments.length > 0 ? (
          comments
            .filter(comment => !comment.parentId)
            .sort((a, b) => getNetVotes(b) - getNetVotes(a))  // Sort by net votes
            .map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium mb-1">
              No comments yet
            </p>
            <p className="text-gray-500 text-sm">
              {currentUser ? (
                <span>Be the first to share your thoughts!</span>
              ) : (
               
                <div className="text-center space-y-4">
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button
                      onClick={() => handleSignIn('google')}
                      className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Join the conversation, add your thoughts
                    </button>
                  </div>
                </div>
           
              )}
            </p>
          </div>
        )}
      </div>


      {/* Main Comment Form - only show if signed in */}
      {currentUser && !replyTo && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <form onSubmit={handleMainSubmit} className="space-y-4">
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Add a comment
              </label>
              <textarea
                id="comment"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts?"
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
                maxLength={replyTo ? MAX_REPLY_LENGTH : MAX_COMMENT_LENGTH}
              />
            </div>
            <div className="text-sm text-gray-500">
              {newComment.length}/{replyTo ? MAX_REPLY_LENGTH : MAX_COMMENT_LENGTH} characters
            </div>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600">
                  {error.includes('Please wait') 
                    ? `Please wait ${countdown} seconds before commenting again`
                    : error
                  }
                </p>
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                {currentUser.image ? (
                  <Image
                    src={currentUser.image}
                    alt={currentUser.name || ''}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-gray-100"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {currentUser.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-600">
                  Commenting as <span className="font-medium text-gray-900">{currentUser.name}</span>
                </span>
              </div>
              <button
                type="submit"
                disabled={isLoading || !newComment.trim()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => {
          setIsReplyModalOpen(false)
          setReplyTo(null)
          setNewComment('')
        }}
        onSubmit={handleReplySubmit}
        error={error}
        replyingTo={replyTo?.userName || ''}
        value={newComment}
        onChange={setNewComment}
        currentUser={currentUser}
        isLoading={isLoading}
      />
    </div>
  )
} 