'use client';

import { useEffect, useState } from 'react';
import { BuyerData } from '@/types/offer';
import Tooltip from '@/components/ui/Tooltip';

interface Step2Props {
  data?: Partial<BuyerData>;
  onChange: (data: Partial<BuyerData>) => void;
  onAskAI?: (topic: string) => void;
}

// Email validation regex - RFC 5322 compliant
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const isValidEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return false;
  return EMAIL_REGEX.test(email.trim());
};

export default function Step2_BuyerInfo({ data = {}, onChange, onAskAI }: Step2Props) {
  const [emailError, setEmailError] = useState<string>('');
  const [emailTouched, setEmailTouched] = useState(false);

  const updateField = (field: keyof BuyerData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const validateEmail = (email: string) => {
    if (!email || email.trim() === '') {
      setEmailError('Email address is required');
      return false;
    }
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address (e.g., name@example.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (email: string) => {
    updateField('B_Email', email);
    if (emailTouched) {
      validateEmail(email);
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    validateEmail(data.B_Email || '');
  };

  // Set default closing date to 30 days from today
  useEffect(() => {
    if (!data.ClosingDate) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      const formattedDate = defaultDate.toISOString().split('T')[0];
      updateField('ClosingDate', formattedDate);
    }
  }, []);

  return (
    <>
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Tell us about yourself
        </h2>
        <p className="text-gray-600 mb-8">
          We need some basic information about the buyer(s)
        </p>

        <div className="space-y-6">
          {/* Primary Buyer Name */}
          <div>
            <label htmlFor="buyer1_name" className="block text-sm font-medium text-gray-700 mb-2">
              Primary Buyer Name <span className="text-red-500">*</span>
              <Tooltip
                content="Enter the full legal name of the primary buyer as it should appear on the purchase agreement."
                topic="What name should I use for the primary buyer, and why does it need to be a legal name?"
                onAskAI={onAskAI}
              />
            </label>
            <input
              type="text"
              id="buyer1_name"
              value={data.Buyer1Name || ''}
              onChange={(e) => updateField('Buyer1Name', e.target.value)}
              placeholder="e.g., Jane Smith"
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="buyer_email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
              <Tooltip
                content="Provide your email address. We'll use this to send you important updates about your offer and transaction."
                topic="What will my email be used for during the transaction, and is it secure?"
                onAskAI={onAskAI}
              />
            </label>
            <input
              type="email"
              id="buyer_email"
              value={data.B_Email || ''}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              placeholder="e.g., jane.smith@email.com"
              className={`w-full border rounded-md px-4 py-3 focus:ring-2 focus:border-transparent placeholder:text-gray-400 placeholder:italic ${
                emailError && emailTouched
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-purple-500'
              }`}
              aria-invalid={!!emailError && emailTouched}
              aria-describedby={emailError && emailTouched ? 'email-error' : undefined}
            />
            {emailError && emailTouched && (
              <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {emailError}
              </p>
            )}
          </div>

          {/* Secondary Buyer Name (Optional) */}
          <div>
            <label htmlFor="buyer2_name" className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Buyer Name <span className="text-gray-400">(Optional)</span>
              <Tooltip
                content="If purchasing with a spouse, partner, or co-buyer, enter their full legal name here. Leave blank if purchasing alone."
                topic="When do I need to add a secondary buyer, and how does it affect the purchase?"
                onAskAI={onAskAI}
              />
            </label>
            <input
              type="text"
              id="buyer2_name"
              value={data.Buyer2Name || ''}
              onChange={(e) => updateField('Buyer2Name', e.target.value)}
              placeholder="e.g., Jane Smith"
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
            />
          </div>

          {/* Buyer Status */}
          <div>
            <label htmlFor="buyer_status" className="block text-sm font-medium text-gray-700 mb-2">
              Buyer Status <span className="text-red-500">*</span>
              <Tooltip
                content={
                  <div>
                    <p className="mb-2">Select how the property will be owned:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Married couple:</strong> Purchasing together as spouses</li>
                      <li><strong>Unmarried couple:</strong> Purchasing together but not married</li>
                      <li><strong>Single person:</strong> Individual purchase</li>
                      <li><strong>Business entity:</strong> LLC, Corporation, etc.</li>
                      <li><strong>Trust:</strong> Purchasing in the name of a trust</li>
                    </ul>
                  </div>
                }
                topic="What's the difference between buyer status options, and how does it affect title and taxes?"
                onAskAI={onAskAI}
              />
            </label>
            <select
              id="buyer_status"
              value={data.B_Status || ''}
              onChange={(e) => updateField('B_Status', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select status...</option>
              <option value="A married couple">A married couple</option>
              <option value="An unmarried couple">An unmarried couple</option>
              <option value="A single person">A single person</option>
              <option value="Business entity">Business entity</option>
              <option value="Trust">Trust</option>
            </select>
          </div>

          {/* Closing Date */}
          <div>
            <label htmlFor="closing_date" className="block text-sm font-medium text-gray-700 mb-2">
              Desired Closing Date <span className="text-red-500">*</span>
              <Tooltip content="The date you'd like to complete the purchase and take ownership. In 99% of transactions, closings occur 30-45 days after offer acceptance to allow time for inspections, appraisals, and financing." />
            </label>
            <input
              type="date"
              id="closing_date"
              value={data.ClosingDate || ''}
              onChange={(e) => updateField('ClosingDate', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export const Step2_Sidebar = () => (
  <div>
    <h4 className="font-semibold text-gray-900 mb-2">Buyer Information</h4>
    <p className="text-sm text-gray-600 mb-4">
      This information will be used to identify the parties in the purchase agreement.
    </p>

    <h4 className="font-semibold text-gray-900 mb-2 mt-6">Secondary Buyer</h4>
    <p className="text-sm text-gray-600 mb-4">
      If you're purchasing with a spouse, partner, or co-buyer, include their name here.
      Leave blank if purchasing alone.
    </p>

    <h4 className="font-semibold text-gray-900 mb-2 mt-6">Buyer Status</h4>
    <p className="text-sm text-gray-600 mb-2">
      This helps determine how the title will be held:
    </p>
    <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
      <li><strong>Married couple:</strong> Purchasing together as spouses</li>
      <li><strong>Unmarried couple:</strong> Purchasing together but not married</li>
      <li><strong>Single person:</strong> Individual purchase</li>
      <li><strong>Business entity:</strong> LLC, Corporation, etc.</li>
      <li><strong>Trust:</strong> Purchasing in the name of a trust</li>
    </ul>

    <h4 className="font-semibold text-gray-900 mb-2 mt-6">Closing Date</h4>
    <p className="text-sm text-gray-600">
      The target date when the sale will be finalized. Typical timelines are 30-45 days
      from offer acceptance, but can be negotiated.
    </p>
  </div>
);
