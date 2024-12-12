"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  image?: string | null;
  email?: string;
  role?: string;
}

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  replyingTo: string;
  error: string | null;
  value: string;
  onChange: (value: string) => void;
  currentUser?: User | null;
  isLoading?: boolean;
}

export default function ReplyModal({
  isOpen,
  onClose,
  onSubmit,
  replyingTo,
  error,
  value,
  onChange,
  currentUser,
  isLoading,
}: ReplyModalProps) {
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (error?.includes('Please wait')) {
      const seconds = parseInt(error.match(/\d+/)?.[0] || '0');
      setCountdown(seconds);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [error]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-lg transform rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Reply to <span className="font-semibold">{replyingTo}</span>
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-600">
                {error.includes('Please wait') ? `Please wait ${countdown} seconds before commenting again` : error}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              {currentUser?.image ? (
                <Image
                  src={currentUser.image}
                  alt={currentUser.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {currentUser?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <textarea
                autoFocus
                rows={4}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Write your reply..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg mb-2">
              <span className="text-sm text-gray-600">
                Replying to{" "}
                <span className="font-medium text-gray-900">{replyingTo}</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Cancel reply</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => onSubmit(value)}
                disabled={isLoading || !value.trim()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? "Replying..." : "Reply"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
