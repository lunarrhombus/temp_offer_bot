'use client';

import { useState } from 'react';
import { OfferFormData } from '@/types/offer';
import { CheckCircle, AlertCircle } from 'lucide-react';
import LoadingPopup from '../LoadingPopup';
import Tooltip from '@/components/ui/Tooltip';

interface Step7Props {
  data: Partial<OfferFormData>;
  includeForm22A: boolean;
  includeForm35: boolean;
  onSubmit: (data: Partial<OfferFormData>) => void;
  submissionError?: string | null;
}

export default function Step7_Review({ data, includeForm22A, includeForm35, onSubmit, submissionError }: Step7Props) {
  const [requestAgentHelp, setRequestAgentHelp] = useState(false);
  const [agentHelpNotes, setAgentHelpNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const finalData = {
      ...data,
      requestAgentHelp,
      agentHelpNotes: requestAgentHelp ? agentHelpNotes : undefined,
    };
    await onSubmit(finalData);
    setIsSubmitting(false);
  };

  return (
    <>
      {/* Loading Popup */}
      <LoadingPopup isOpen={isSubmitting} />

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Review your offer
        </h2>
        <p className="text-gray-600 mb-8">
          Please review all the information before creating your offer
        </p>

        <div className="space-y-6">
          {/* Property Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Property Information
            </h3>
            <div className="bg-gray-50 rounded-md p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">MLS ID:</span>
                <span className="text-sm font-medium text-gray-900">{data.MLS_ID}</span>
              </div>
            </div>
          </div>

          {/* Buyer Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Buyer Information
            </h3>
            <div className="bg-gray-50 rounded-md p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Primary Buyer:</span>
                <span className="text-sm font-medium text-gray-900">{data.buyerdata?.Buyer1Name}</span>
              </div>
              {data.buyerdata?.Buyer2Name && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Secondary Buyer:</span>
                  <span className="text-sm font-medium text-gray-900">{data.buyerdata.Buyer2Name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium text-gray-900">{data.buyerdata?.B_Email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm font-medium text-gray-900">{data.buyerdata?.B_Status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Closing Date:</span>
                <span className="text-sm font-medium text-gray-900">{data.buyerdata?.ClosingDate}</span>
              </div>
            </div>
          </div>

          {/* Offer Details */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Offer Details
            </h3>
            <div className="bg-gray-50 rounded-md p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Offer Price:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${data.buyerdata?.offer_price_num?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Earnest Money:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${data.buyerdata?.earnest_amount_num?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Earnest Money Delivery:</span>
                <span className="text-sm font-medium text-gray-900">
                  {data.buyerdata?.earnest_amount_delivery_days} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Earnest Money Holder:</span>
                <span className="text-sm font-medium text-gray-900">
                  {data.buyerdata?.earnest_money_holder}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Offer Valid For:</span>
                <span className="text-sm font-medium text-gray-900">
                  {data.buyerdata?.offer_expiration_days} days
                </span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Additional Settings
            </h3>
            <div className="bg-gray-50 rounded-md p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Charges & Assessments:</span>
                <span className="text-sm font-medium text-gray-900">{data.buyerdata?.ChargesAssessments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Verification Period:</span>
                <span className="text-sm font-medium text-gray-900">{data.buyerdata?.VerificationPeriod}</span>
              </div>
            </div>
          </div>

          {/* Optional Forms */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Optional Forms</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {includeForm22A ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm text-gray-700">
                  Form 22A - Financing Addendum {includeForm22A ? '(Included)' : '(Not Included)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {includeForm35 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm text-gray-700">
                  Form 35 - Inspection Addendum {includeForm35 ? '(Included)' : '(Not Included)'}
                </span>
              </div>
            </div>
          </div>

          {/* Agent Help Request */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={requestAgentHelp}
                onChange={(e) => setRequestAgentHelp(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">
                  Request Agent Assistance
                  <Tooltip content="Select this option if you have questions about your offer, need assistance with complex terms, have unique circumstances, or want a licensed real estate agent to review your offer before it's sent to the seller. Common reasons include: unfamiliar contingencies, competitive market situations, unusual property conditions, or questions about negotiation strategy. In 99% of cases where buyers request agent assistance, they receive a response within 2-4 hours during business hours." />
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Check this box if you need help from an agent or have special requests for your offer
                </p>
              </div>
            </label>

            {requestAgentHelp && (
              <div className="mt-4">
                <label htmlFor="agent_notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Please describe what you need help with:
                </label>
                <textarea
                  id="agent_notes"
                  value={agentHelpNotes}
                  onChange={(e) => setAgentHelpNotes(e.target.value)}
                  rows={4}
                  placeholder="e.g., I have questions about the appraisal contingency, I need help with unusual financing, etc."
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {submissionError && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1">Submission Failed</h4>
                  <p className="text-sm text-red-800">{submissionError}</p>
                  <p className="text-sm text-red-700 mt-2">
                    Please try submitting again. If the problem persists, contact our support team.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-md font-semibold text-lg transition-all ${
                isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-xl hover:scale-105'
              }`}
            >
              {isSubmitting ? 'Creating Offer...' : 'Create Offer'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              By creating your offer, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export const Step7_Sidebar = () => (
  <div>
    <h4 className="font-semibold text-gray-900 mb-2">Final Review</h4>
    <p className="text-sm text-gray-600 mb-4">
      This is your last chance to review all the information in your offer.
      Make sure everything is accurate before creating your offer.
    </p>

    <h4 className="font-semibold text-gray-900 mb-2 mt-6">What Happens Next?</h4>
    <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside mb-6">
      <li>Your offer will be prepared and sent to you for e-signature</li>
      <li>Once signed, it will be sent to the seller's agent</li>
      <li>The seller typically has 24-48 hours to respond</li>
      <li>You'll be notified of acceptance, counter-offer, or rejection</li>
    </ol>

    <h4 className="font-semibold text-gray-900 mb-2">Agent Assistance</h4>
    <p className="text-sm text-gray-600 mb-4">
      If you have any special requests, questions, or need clarification on anything,
      check the "Request Agent Assistance" box. An agent will review your offer and
      reach out to you before it's created.
    </p>

    <div className="mt-4 p-4 bg-green-50 rounded-md">
      <p className="text-sm text-green-900">
        <strong>Pro Tip:</strong> Double-check your offer price and closing date as these
        are the most critical terms that sellers evaluate first.
      </p>
    </div>

    <div className="mt-4 p-4 bg-purple-50 rounded-md">
      <p className="text-sm text-purple-900">
        <strong>Remember:</strong> Your progress is automatically saved. If you need to make
        changes, you can use the back button to navigate to previous steps.
      </p>
    </div>
  </div>
);
