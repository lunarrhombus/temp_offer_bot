'use client';

import { Loader2 } from 'lucide-react';

interface LoadingPopupProps {
  isOpen: boolean;
}

export default function LoadingPopup({ isOpen }: LoadingPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full mx-4 text-center">
        {/* Animated Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Loader2 className="w-20 h-20 text-purple-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Creating Your Offer
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Please wait while we prepare your offer documents. This may take a few moments.
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Encouraging Message */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic">
            "Great choice! You're one step closer to your dream home."
          </p>
        </div>
      </div>
    </div>
  );
}
