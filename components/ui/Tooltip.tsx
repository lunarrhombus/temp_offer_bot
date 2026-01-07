'use client';

import { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode | string;
  topic?: string;
  onAskAI?: (topic: string) => void;
}

export default function Tooltip({ content, topic, onAskAI }: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => {
          e.preventDefault();
          if (topic && onAskAI) {
            onAskAI(topic);
          }
        }}
        className="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-purple-600 transition-colors cursor-help"
        aria-label="More information"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {showTooltip && (
        <div
          className="absolute z-50 left-6 top-1/2 -translate-y-1/2 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg"
          role="tooltip"
        >
          {content}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45" />
        </div>
      )}
    </span>
  );
}
