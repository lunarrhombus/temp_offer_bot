'use client';

import { useState, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, X } from 'lucide-react';

interface OnboardingLayoutProps {
  children: ReactNode;
  sidebarContent?: ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  showNext?: boolean;
  showBack?: boolean;
  nextLabel?: string;
}

export default function OnboardingLayout({
  children,
  sidebarContent,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  nextDisabled = false,
  showNext = true,
  showBack = true,
  nextLabel = 'Continue'
}: OnboardingLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Set sidebar visible by default on large screens only
  useEffect(() => {
    const isLargeScreen = window.innerWidth >= 1024; // Tailwind's lg breakpoint
    setSidebarOpen(isLargeScreen);
  }, []);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Top Progress Bar */}
      <div className="fixed top-14 left-0 right-0 z-50 bg-white border-b border-zinc-200  ">
        <div className="h-1.5 bg-zinc-100">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercentage}%`,
              background: 'linear-gradient(90deg, #E3E99F 0%, #808359 100%)'
            }}
          />
        </div>
        <div className="px-6 py-3 flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-inter-tight font-bold text-zinc-900">
              Create Your Offer
            </h1>
            <span className="text-sm text-zinc-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="pt-[116px] flex min-h-screen">
        {/* Main Content - TurboTax style centered column */}
        <div className="flex-1">
          <div className="max-w-2xl mx-auto px-6 py-8">
            {/* Form Content */}
            <div className="mb-8">
              {children}
            </div>

            {/* Bottom Navigation Bar - Above Footer */}
            <div className="bg-white border-t border-zinc-200 shadow-sm py-6">
              <div className="max-w-2xl mx-auto px-6">
                <div className="flex justify-between items-center gap-4">
                  {showBack && onBack ? (
                    <button
                      onClick={onBack}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {showNext && onNext && (
                    <button
                      onClick={onNext}
                      disabled={nextDisabled}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-md ${
                        nextDisabled
                          ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                          : 'text-white hover:shadow-lg'
                      }`}
                      style={
                        nextDisabled
                          ? undefined
                          : {
                              background: 'linear-gradient(90deg, #E3E99F 0%, #808359 100%)',
                              color: '#000'
                            }
                      }
                    >
                      {nextLabel}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel - TurboTax style slide-in panel */}
        {sidebarContent && (
          <div
            className={`fixed top-[116px] right-0 bottom-0 w-96 bg-zinc-50 border-l border-zinc-200 shadow-2xl transition-transform duration-300 ease-in-out z-30 ${
              sidebarOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Sidebar Header */}
            <div className="sticky top-0 bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-zinc-700" />
                <h3 className="text-base font-inter-tight font-semibold text-zinc-900">
                  Help & Information
                </h3>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors"
                aria-label="Close help panel"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="h-full overflow-y-auto px-6 py-4 pb-16">
              <div className="prose prose-sm prose-zinc max-w-none">
                {sidebarContent}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Help Button - Mobile Friendly */}
      {sidebarContent && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-zinc-200 md:px-5 md:py-3"
          aria-label={sidebarOpen ? 'Close help panel' : 'Open help panel'}
        >
          <HelpCircle className="w-5 h-5 md:w-4 md:h-4" />
          <span className="hidden sm:inline text-sm font-medium">Need help?</span>
        </button>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
