'use client';

import { useEffect } from 'react';
import { CheckCircle, Home, Mail, Calendar, FileText, Download } from 'lucide-react';
import Link from 'next/link';

interface SuccessPageProps {
  apiResponse?: {
    apiResponse?: {
      // PDF download URL returned by the API
      pdf_url?: string;
      // whether the listing needs agent attention
      needAgentAttention?: boolean;
      // listing agent information (as returned in your sample)
      listingagent_info?: {
        LAEmail?: string;
        LAFax?: string;
        LAFirmID?: string;
        LAFirmLic?: string;
        LAFirmPhone?: string;
        LALag?: number;
        LALic?: string;
        LAName?: string;
        LAPhone?: string;
        [key: string]: any;
      };
      // keep existing optional fields your component uses
      listing?: {
        address?: string;
        city?: string;
        [key: string]: any;
      };
      offer?: {
        price?: number;
        [key: string]: any;
      };
      [key: string]: any;
    };
  };
}

export default function SuccessPage({ apiResponse }: SuccessPageProps) {
  const pdfUrl = apiResponse?.apiResponse?.pdf_url;
  const listing = apiResponse?.apiResponse?.listing;
  const offer = apiResponse?.apiResponse?.offer;

  // Scroll to top when success page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle className="w-20 h-20 text-green-600" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Offer Has Been Created!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Congratulations on taking this exciting step towards your new home.
          </p>

          {/* What's Next Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              What happens next?
            </h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <span>
                  <strong>Review & Signature:</strong> You'll receive an email with your offer document for e-signature within the next few hours. You can also download the offer from the section below to sign manually. Please be sure to include your preapproval (pre-approval letter) with the signed offer — offers without a preapproval may not be considered.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </span>

                <div className="flex-1">
                  <div className="text-gray-700">
                    <strong>Delivery:</strong> Once signed, your offer will be sent to the seller's agent immediately.
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
                    {apiResponse?.apiResponse?.listingagent_info?.LAEmail ? (
                      <a
                        href={`mailto:${apiResponse?.apiResponse?.listingagent_info?.LAEmail}`}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition"
                      >
                        Email Seller Agent
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-500 rounded-md text-sm font-medium cursor-not-allowed"
                      >
                        Email Seller Agent
                      </button>
                    )}

                    <details className="text-left">
                      <summary className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium cursor-pointer hover:border-purple-600 hover:text-purple-600">
                        Show Seller Agent Contact
                      </summary>

                      <div className="mt-2 text-sm text-gray-700 space-y-1">
                        <p>
                          <strong>Name:</strong>{' '}
                          {apiResponse?.apiResponse?.listingagent_info?.LAName ?? 'Not available'}
                        </p>
                        <p>
                          <strong>Email:</strong>{' '}
                          {apiResponse?.apiResponse?.listingagent_info?.LAEmail ?? 'Not available'}
                        </p>
                      </div>
                    </details>
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <span>
                  <strong>Response:</strong> The seller typically responds within 24-48 hours with an acceptance, counter-offer, or rejection.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </span>
                <span>
                  <strong>Seller Agent Contact:</strong> The seller's agent may contact you directly regarding your offer. Please be sure to respond promptly to any communications.
                </span>
              </li>
            </ol>
          </div>

          {/* PDF Download - if available */}
          {pdfUrl && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <FileText className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Offer Document is Ready
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {listing?.address && `Offer for ${listing.address}${listing.city ? `, ${listing.city}` : ''}`}
                {offer?.price && ` - $${offer.price.toLocaleString()}`}
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all hover:shadow-lg"
              >
                <Download className="w-5 h-5" />
                Download Your Offer Document
              </a>
            </div>
          )}

          {/* Important Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-900">
                  <strong>Check your email:</strong> We've sent a confirmation to your email address.
                  Please check your inbox (and spam folder) for important next steps.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-md font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Return to Home
            </Link>
            <Link
              href="/buy-with-us"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-md font-semibold hover:border-purple-600 hover:text-purple-600 transition-all"
            >
              Learn More About Our Process
            </Link>
          </div>

          {/* Need Help Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Our team is here to assist you throughout the entire offer process. If you have any questions or need guidance, don't hesitate to reach out.
              </p>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all hover:shadow-lg"
              >
                Contact Us
              </Link>
            </div>

            <p className="text-sm text-gray-600">
              You can also reach us at{' '}
              <a href="mailto:support@RE Offer Tool.com" className="text-purple-600 hover:underline font-medium">
                support@RE Offer Tool.com
              </a>
              {' '}or call{' '}
              <a href="tel:+12068800760" className="text-purple-600 hover:underline font-medium">
                (206) 880-0760
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
