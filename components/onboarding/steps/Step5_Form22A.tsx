'use client';

import { Form22A, FinancialContingencyOption } from '@/types/offer';
import { useEffect } from 'react';
import Tooltip from '@/components/ui/Tooltip';

interface Step5Props {
  data?: Partial<Form22A>;
  onChange: (data: Partial<Form22A>) => void;
  onAskAI?: (topic: string) => void;
}

export default function Step5_Form22A({ data = {}, onChange, onAskAI }: Step5Props) {
  const updateField = (field: keyof Form22A, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Initialize default values if not set
  useEffect(() => {
    const updates: Partial<Form22A> = {};

    if (!data.DOWNPAYMENTTYPE) {
      updates.DOWNPAYMENTTYPE = 'PERCENTAGE';
    }

    if (!data.APPRAISALCONTINGENCY) {
      updates.APPRAISALCONTINGENCY = 'YES';
    }

    if (!data.MAKEAPPLICATIONFORLOANSDAYS) {
      updates.MAKEAPPLICATIONFORLOANSDAYS = 5;
    }

    if (!data.FINANCIALCONTINGENCYTIMEFRAME) {
      updates.FINANCIALCONTINGENCYTIMEFRAME = 21;
    }

    if (Object.keys(updates).length > 0) {
      onChange({ ...data, ...updates });
    }
  }, []);

  return (
    <>
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Financing details
        </h2>
        <p className="text-gray-600 mb-8">
          Form 22A - Financing addendum information
        </p>

        <div className="space-y-6">
          {/* Type of Loan */}
          <div>
            <label htmlFor="loan_type" className="block text-sm font-medium text-gray-700 mb-2">
              Type of Loan <span className="text-red-500">*</span>
              <Tooltip
                content={
                  <div>
                    <p className="mb-2">Select the mortgage product you'll use to finance the purchase:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Conventional:</strong> Traditional mortgage (most common - 65% of transactions)</li>
                      <li><strong>FHA:</strong> Low down payment option (3.5% minimum)</li>
                      <li><strong>VA:</strong> For military veterans (0% down possible)</li>
                      <li><strong>USDA:</strong> For rural properties (0% down possible)</li>
                      <li><strong>Jumbo:</strong> For high-value properties exceeding conventional limits</li>
                    </ul>
                  </div>
                }
                topic="What type of loan should I choose and what are the differences?"
                onAskAI={onAskAI}
              />
            </label>
            <select
              id="loan_type"
              value={data.TypeofLoan || ''}
              onChange={(e) => updateField('TypeofLoan', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select loan type...</option>
              <option value="CONVENTIONALFIRST">Conventional First</option>
              <option value="CONVENTIONALSECOND">Conventional Second</option>
              <option value="FHA">FHA</option>
              <option value="BRIDGE">Bridge</option>
              <option value="VA">VA</option>
              <option value="USDA">USDA</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Down Payment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Down Payment Type <span className="text-red-500">*</span>
              <Tooltip
                content="Choose whether to express your down payment as a percentage of the purchase price (e.g., 20%) or as a specific dollar amount (e.g., $150,000)."
                topic="Should I specify my down payment as a percentage or dollar amount?"
                onAskAI={onAskAI}
              />
            </label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="downpayment_type"
                  value="PERCENTAGE"
                  checked={data.DOWNPAYMENTTYPE === 'PERCENTAGE' || data.DOWNPAYMENTTYPE == null}
                  onChange={(e) => updateField('DOWNPAYMENTTYPE', 'PERCENTAGE')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Percentage (%)</span>
                </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="downpayment_type"
                  value="DOLLAR"
                  checked={data.DOWNPAYMENTTYPE === 'DOLLAR'}
                  onChange={(e) => updateField('DOWNPAYMENTTYPE', 'DOLLAR')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Dollar Amount ($)</span>
              </label>
            </div>
          </div>

          {/* Down Payment Amount */}
          <div>
            <label htmlFor="downpayment_amount" className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment {data.DOWNPAYMENTTYPE === 'PERCENTAGE' ? 'Percentage' : 'Amount'} <span className="text-red-500">*</span>
              <Tooltip
                content="The amount you'll pay upfront. In 99% of conventional loans, buyers put down 3-20%. A 20% down payment avoids PMI (private mortgage insurance). FHA loans require as little as 3.5%, while VA and USDA loans can be 0% down."
                topic="How much should I put down as a down payment?"
                onAskAI={onAskAI}
              />
            </label>
            <div className="relative">
              {data.DOWNPAYMENTTYPE === 'PERCENTAGE' ? (
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none">%</span>
              ) : (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none">$</span>
              )}
              <input
                type="number"
                id="downpayment_amount"
                value={data.DOWNPAYMENTMAGNITUDE || ''}
                onChange={(e) => updateField('DOWNPAYMENTMAGNITUDE', parseFloat(e.target.value))}
                placeholder={data.DOWNPAYMENTTYPE === 'PERCENTAGE' ? '20' : '100000'}
                className={`w-full border border-gray-300 rounded-md py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic ${
                  data.DOWNPAYMENTTYPE === 'DOLLAR' ? 'pl-10 pr-4' : 'pl-4 pr-14'
                }`}
              />
            </div>
          </div>

          {/* Loan Application Days */}
          <div>
            <label htmlFor="loan_app_days" className="block text-sm font-medium text-gray-700 mb-2">
              Days to Apply for Loan <span className="text-red-500">*</span>
              <Tooltip
                content="The number of days after mutual acceptance you have to formally submit your loan application. In 99% of transactions, buyers apply within 3-5 days."
                topic="How many days should I allow to submit my loan application?"
                onAskAI={onAskAI}
              />
            </label>
            <input
              type="number"
              id="loan_app_days"
              value={data.MAKEAPPLICATIONFORLOANSDAYS || ''}
              onChange={(e) => updateField('MAKEAPPLICATIONFORLOANSDAYS', parseInt(e.target.value))}
              placeholder="5"
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
            />
          </div>

          {/* Post-Deadline Action Timeframe */}
          <div>
            <label htmlFor="fin_contingency_days" className="block text-sm font-medium text-gray-700 mb-2">
              Loan Approval Window (days) <span className="text-red-500">*</span>
              <Tooltip
                content="The total number of days you have to obtain loan approval from your lender. In 99% of transactions, this is 17-21 days. This is your financing contingency period - you can withdraw without penalty if your loan isn't approved within this timeframe."
                topic="What is the financing contingency timeframe and how long should it be?"
                onAskAI={onAskAI}
              />
            </label>
            <input
              type="number"
              id="fin_contingency_days"
              value={data.FINANCIALCONTINGENCYTIMEFRAME || ''}
              onChange={(e) => updateField('FINANCIALCONTINGENCYTIMEFRAME', parseInt(e.target.value))}
              placeholder="21"
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
            />
          </div>

          {/* Post-Deadline Action */}
          <div>
            <label htmlFor="financial_contingency" className="block text-sm font-medium text-gray-700 mb-2">
              Post-Deadline Action <span className="text-red-500">*</span>
              <Tooltip
                content={
                  <div>
                    <p className="mb-2">What happens after the loan approval window expires:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Seller to force:</strong> Seller can demand you proceed or cancel (used in 85% of transactions)</li>
                      <li><strong>Automatically applied:</strong> Financing contingency waives automatically if you don't cancel</li>
                    </ul>
                  </div>
                }
                topic="What should happen after the loan approval deadline?"
                onAskAI={onAskAI}
              />
            </label>
            <select
              id="financial_contingency"
              value={data.FINANCIALCONTINGENCY || ''}
              onChange={(e) => updateField('FINANCIALCONTINGENCY', e.target.value as FinancialContingencyOption)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select option...</option>
              <option value="FINCONTIN_OPTIONA_SELLERNOTICETOPERFORM">Seller to force financial contingency</option>
              <option value="FINCONTIN_OPTIONB_AUTOWAIVED">Automatically applied</option>

            </select>
          </div>

 

          {/* Appraisal Contingency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Appraisal Contingency <span className="text-red-500">*</span>
              <Tooltip
                content="An appraisal contingency protects you if the property appraises for less than your offer price. If you select 'Yes' and the appraisal comes in low, you can renegotiate the price or withdraw from the purchase without penalty. Waiving this contingency (selecting 'No') makes your offer stronger but means you must pay the difference if the appraisal is lower than your offer. In 99% of financed transactions, buyers include an appraisal contingency for protection."
                topic="Should I include an appraisal contingency?"
                onAskAI={onAskAI}
              />
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="appraisal_contingency"
                  value="YES (Recommended)"
                  checked={data.APPRAISALCONTINGENCY === 'YES'}
                  onChange={(e) => updateField('APPRAISALCONTINGENCY', 'YES')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="appraisal_contingency"
                  value="NO"
                  checked={data.APPRAISALCONTINGENCY === 'NO'}
                  onChange={(e) => updateField('APPRAISALCONTINGENCY', 'NO')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">No (Waived)</span>
              </label>
            </div>
          </div>

          {/* VA Loan Escrow Fee - Only show if VA loan */}
          {data.TypeofLoan === 'VA' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Buyer Pays Escrow Fee for VA Loan <span className="text-red-500">*</span>
                <Tooltip
                  content="VA loan regulations restrict which closing costs the veteran buyer can pay. In most VA loan transactions, the seller is required to pay the escrow/closing fee. However, in some cases, the buyer may agree to pay this fee to make the offer more attractive to the seller. This specifies whether you (the buyer) will pay the escrow fee or if you expect the seller to cover it as is standard practice."
                  topic="Should the buyer or seller pay the escrow fee for a VA loan?"
                  onAskAI={onAskAI}
                />
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="va_escrow_fee"
                    value="YES"
                    checked={data.BUYERPAYESECROWFEEFORVALOAN === 'YES'}
                    onChange={(e) => updateField('BUYERPAYESECROWFEEFORVALOAN', 'YES')}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="va_escrow_fee"
                    value="NO"
                    checked={data.BUYERPAYESECROWFEEFORVALOAN === 'NO'}
                    onChange={(e) => updateField('BUYERPAYESECROWFEEFORVALOAN', 'NO')}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const Step5_Sidebar = () => (
  <div>
    <h4 className="font-semibold text-gray-900 mb-2">Type of Loan</h4>
    <p className="text-sm text-gray-600 mb-4">
      The mortgage product you'll use to finance the purchase:
    </p>
    <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside mb-6">
      <li><strong>Conventional First:</strong> Traditional first mortgage (most common)</li>
      <li><strong>Conventional Second:</strong> Second mortgage or home equity loan</li>
      <li><strong>FHA:</strong> Federal Housing Administration loan (low down payment)</li>
      <li><strong>Bridge:</strong> Short-term loan until you sell current home</li>
      <li><strong>VA:</strong> Veterans Affairs loan (for veterans)</li>
      <li><strong>USDA:</strong> Rural development loan</li>
      <li><strong>Jumbo:</strong> For amounts exceeding conventional limits</li>
    </ul>

    <h4 className="font-semibold text-gray-900 mb-2">Down Payment</h4>
    <p className="text-sm text-gray-600 mb-4">
      The portion you'll pay upfront. Can be expressed as a percentage of purchase price or dollar amount.
      Typical down payments range from 3% (FHA) to 20% (conventional to avoid PMI).
    </p>

    <h4 className="font-semibold text-gray-900 mb-2">Loan Application Timeline</h4>
    <p className="text-sm text-gray-600 mb-4">
      Number of days you have to formally apply for the loan after mutual acceptance. Typical: 3-5 days.
    </p>

    <h4 className="font-semibold text-gray-900 mb-2">Financial Contingency</h4>
    <p className="text-sm text-gray-600 mb-4">
      Protects you if financing falls through:
    </p>
    <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside mb-6">
      <li><strong>Option A:</strong> Standard protection - can back out if not approved</li>
      <li><strong>Option B:</strong> Must get acceptable loan terms</li>
      <li><strong>Option C:</strong> Waived - stronger offer but higher risk</li>
    </ul>

    <h4 className="font-semibold text-gray-900 mb-2">Appraisal Contingency</h4>
    <p className="text-sm text-gray-600 mb-4">
      If "Yes", you can renegotiate or walk away if the property appraises for less than your offer.
      Waiving this makes your offer stronger but riskier.
    </p>

    <h4 className="font-semibold text-gray-900 mb-2">VA Loan Escrow Fee</h4>
    <p className="text-sm text-gray-600">
      For VA loans, specifies whether the buyer pays the escrow/closing fee. This field only appears when you select a VA loan.
    </p>
  </div>
);
