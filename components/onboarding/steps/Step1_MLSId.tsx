'use client';

import { useState, type ReactNode } from 'react';
import Tooltip from '@/components/ui/Tooltip';

interface Step1Props {
  value: string;
  onChange: (value: string, listingPrice?: number, propertyData?: any) => void;
  onAskAI?: (topic: string) => void;
}

export default function Step1_MLSId({ value, onChange, onAskAI }: Step1Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ReactNode | null>(null);

  // Single address field
  const [fullAddress, setFullAddress] = useState('');

  // Property data from API
  const [propertyData, setPropertyData] = useState<{
    price: number | null;
    originalPhotos: string[];
    address: {
      full: string;
    };
    bedrooms: number | null;
    bathrooms: number | null;
    squareFeet: number | null;
  } | null>(null);

  // Carousel state for images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddressSearch = async () => {
    if (!fullAddress.trim()) {
      setError('Please enter a property address');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/address-mlsid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: fullAddress.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.details || data.error || 'Failed to find property');
        setPropertyData(null);
        return;
      }
      console.log('Address search result:', data);
      if (data.mlsId) {
        const propertyInfo = {
          mlsId: data.mlsId,
          price: data.price,
          address: data.address,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          squareFeet: data.squareFeet,
          originalPhotos: data.originalPhotos
        };
        onChange(data.mlsId, data.price || undefined, propertyInfo);
        setPropertyData(data);
        setCurrentImageIndex(0); // Reset carousel to first image
        setError(null);
      } else {
        setError(
          <>
            Property not found, please try again or{' '}
            <a href="/contact-us" className="text-purple-700 underline">
              contact support
            </a>
            .
          </>
        );
        setPropertyData(null);
      }
    } catch (err) {
      setError('Failed to search for property. Please check the address and try again.');
      setPropertyData(null);
      console.error('Address search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Let's start with the property
        </h2>
        <p className="text-gray-600 mb-8">
          Enter the property address to get started
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="full_address" className="block text-sm font-medium text-gray-700 mb-2">
              Property Address <span className="text-red-500">*</span>
              <Tooltip
                content={
                  <div>
                    <p className="mb-2">Enter the complete property address you wish to make an offer on.</p>
                    <p className="mb-1 font-semibold">For best results, include:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Full street address (e.g., 123 Main St)</li>
                      <li>City name (e.g., Seattle)</li>
                      <li>State abbreviation (e.g., WA)</li>
                      <li>ZIP code (e.g., 98101)</li>
                    </ul>
                    <p className="mt-2 text-xs">We'll automatically retrieve the property details and MLS ID.</p>
                  </div>
                }
                topic="What format should I use for entering the property address, and what happens when I search?"
                onAskAI={onAskAI}
              />
            </label>
            <input
              type="text"
              id="full_address"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && fullAddress.trim()) {
                  handleAddressSearch();
                }
              }}
              placeholder="e.g., 123 Main St, Seattle, WA 98101"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
            />
          </div>

          <button
            type="button"
            onClick={handleAddressSearch}
            disabled={loading || !fullAddress.trim()}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Find Property'}
          </button>

          {/* Property Details Card */}
          {propertyData && value && (
            <div className="mt-4 border border-purple-300 rounded-lg overflow-hidden bg-white shadow-md">
              {/* Property Image Carousel */}
              {propertyData.originalPhotos && propertyData.originalPhotos.length > 0 && (
                <div className="relative w-full h-64 bg-gray-900">
                  <img
                    src={propertyData.originalPhotos[Math.min(currentImageIndex, propertyData.originalPhotos.length - 1)]}
                    alt={`Property image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Carousel Controls - Only show if there are multiple images */}
                  {propertyData.originalPhotos.length > 1 && (
                    <>
                      {/* Previous Button */}
                      {currentImageIndex > 0 && (
                        <button
                          type="button"
                          onClick={() => setCurrentImageIndex(prev => prev - 1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          aria-label="Previous image"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}

                      {/* Next Button */}
                      {currentImageIndex < Math.min(2, propertyData.originalPhotos.length - 1) && (
                        <button
                          type="button"
                          onClick={() => setCurrentImageIndex(prev => prev + 1)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          aria-label="Next image"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}

                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {currentImageIndex + 1} / {Math.min(3, propertyData.originalPhotos.length)}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Property Info */}
              <div className="p-4 bg-purple-50">
                <div className="space-y-3">
                  {propertyData.price && (
                    <div className="text-2xl font-bold text-gray-900">
                      ${propertyData.price.toLocaleString('en-US')}
                    </div>
                  )}

                  {/* Beds, Baths, Sqft */}
                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    {propertyData.bedrooms !== null && (
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="font-medium">{propertyData.bedrooms}</span> bed{propertyData.bedrooms !== 1 ? 's' : ''}
                      </div>
                    )}

                    {propertyData.bathrooms !== null && (
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        <span className="font-medium">{propertyData.bathrooms}</span> bath{propertyData.bathrooms !== 1 ? 's' : ''}
                      </div>
                    )}

                    {propertyData.squareFeet !== null && (
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span className="font-medium">{propertyData.squareFeet.toLocaleString()}</span> sqft
                      </div>
                    )}
                  </div>

                  {propertyData.address && (
                    <div className="text-sm text-gray-700">
                      {propertyData.address.full}
                    </div>
                  )}

                  <div className="pt-2 border-t border-purple-200">
                    <p className="text-sm text-purple-900">
                      <strong>MLS ID:</strong> {value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-900">{error}</p>
          </div>
        )}
      </div>
    </>
  );
}

// Sidebar content for this step
export const Step1_Sidebar = () => (
  <div>
    <h4 className="font-semibold text-gray-900 mb-2">How It Works</h4>
    <p className="text-sm text-gray-600 mb-4">
      Enter the property address and we'll automatically find the listing information and MLS ID for you.
    </p>

    <h4 className="font-semibold text-gray-900 mb-2">What to Include</h4>
    <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside mb-4">
      <li>Full street address (e.g., 123 Main St)</li>
      <li>City name (e.g., Seattle)</li>
      <li>State (e.g., WA)</li>
      <li>Zip code for best results (e.g., 98101)</li>
    </ul>

    <h4 className="font-semibold text-gray-900 mb-2">What You'll See</h4>
    <p className="text-sm text-gray-600 mb-2">
      Once we find the property, you'll see:
    </p>
    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside mb-4">
      <li>Property photo</li>
      <li>Current listing price</li>
      <li>Full address</li>
      <li>MLS ID (automatically retrieved)</li>
    </ul>

    <div className="mt-4 p-4 bg-purple-50 rounded-md">
      <p className="text-sm text-purple-900">
        <strong>Tip:</strong> Make sure the address matches exactly as it appears on the listing.
        You can press Enter or click the button to search.
      </p>
    </div>
  </div>
);
