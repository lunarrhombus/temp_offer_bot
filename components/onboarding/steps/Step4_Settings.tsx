'use client';

import { useEffect } from 'react';
import { BuyerData } from '@/types/offer';
import Tooltip from '@/components/ui/Tooltip';

interface Step4Props {
  data?: Partial<BuyerData>;
  onChange: (data: Partial<BuyerData>) => void;
  includeForm22A: boolean;
  includeForm35: boolean;
  onToggleForm22A: (val: boolean) => void;
  onToggleForm35: (val: boolean) => void;
  onAskAI?: (topic: string) => void;
}

export default function Step4_Settings({
  data = {},
  onChange,
  includeForm22A,
  includeForm35,
  onToggleForm22A,
  onToggleForm35,
  onAskAI,
}: Step4Props) {
  const updateField = (field: keyof BuyerData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Set default values
  useEffect(() => {
    const updates: Partial<BuyerData> = {};

    if (!data.VerificationPeriod) {
      updates.VerificationPeriod = 'Satisfied';
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
          Optional forms
        </h2>
        <p className="text-gray-600 mb-8">
          Select which optional forms you need to include in your offer
        </p>

        <div className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-md hover:border-purple-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeForm22A}
                  onChange={(e) => onToggleForm22A(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">Form 22A - Financing Addendum</span>
                    <Tooltip
                      content="Required if you're obtaining a mortgage or any type of loan to purchase the property. Specifies loan terms, down payment amount, and financial contingencies. Used in approximately 80% of residential transactions."
                      topic="When should I include Form 22A - Financing Addendum?"
                      onAskAI={onAskAI}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Include if you're financing the purchase with a loan
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-md hover:border-purple-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeForm35}
                  onChange={(e) => onToggleForm35(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">Form 35 - Inspection Addendum</span>
                    <Tooltip
                      content="Covers inspection contingencies including home inspection, sewer inspection, and neighborhood review. Allows you to request repairs or withdraw from the purchase if issues are discovered. Highly recommended and used in 95% of transactions."
                      topic="When should I include Form 35 - Inspection Addendum?"
                      onAskAI={onAskAI}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Include for sewer, inspection, and neighborhood review contingencies
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-md hover:border-purple-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 mt-0.5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">Form 22D - Optional Clauses</span>
                    <Tooltip
                      content={
                        <div>
                          <p className="mb-2">Used to add optional, transaction‑specific clauses to a Washington State residential offer—examples include seller‑financing terms, rent‑back/occupancy agreements, agreed repairs, extensions to closing dates, or other negotiated provisions.</p>
                          <p className="mb-0">Include when you need custom contract language beyond standard forms. Consult your broker or attorney to ensure required disclosures and correct legal wording.</p>
                        </div>
                      }
                      topic="What is Form 22D - Optional Clauses and when should I use it?"
                      onAskAI={onAskAI}
                    />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                    Include to attach negotiated or bespoke clauses (seller financing, rent‑back, repair agreements, closing contingencies). Not a substitute for legal advice—confirm wording with your agent or attorney.
                    </p>
                </div>
              </label>
                            <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-md hover:border-purple-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 mt-0.5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">Form 35E - Escalation Clause</span>
                    <Tooltip
                      content={
                        <div>
                          <p className="mb-2">Automatically increases the buyer's offer if a competing bona fide written offer is received. Specifies the escalation increment and a maximum cap (ceiling) the buyer will pay.</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li><strong>Increment:</strong> Amount to increase above a competing offer.</li>
                            <li><strong>Cap:</strong> The highest total purchase price the buyer agrees to pay.</li>
                            <li><strong>Proof:</strong> Typically requires seller to provide evidence of the competing written offer or broker certification.</li>
                          </ul>
                          <p className="mb-0">Use carefully — confirm enforceability, disclosures, and any broker/MLS rules with your agent or attorney.</p>
                        </div>
                      }
                      topic="How does Form 35E - Escalation Clause work and when should I use it?"
                      onAskAI={onAskAI}
                    />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                    Include to automatically top competing written offers by a specified increment up to a stated maximum. Requires clear documentation and confirmation from your agent—consult legal advice if uncertain.
                    </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-md hover:border-purple-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 mt-0.5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">Form 34 - General Addendum</span>
                    <Tooltip
                      content={
                        <div>
                          <p className="mb-2">Used to add transaction‑specific clauses not included in standard forms. Typical uses include:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Agreed repairs or seller credit language</li>
                            <li>Rent‑back / post‑closing occupancy agreements</li>
                            <li>Seller‑financing terms or contingent conditions</li>
                            <li>Extensions to closing or settlement logistics</li>
                          </ul>
                          <p className="mb-0">Draft clearly and consult your broker or attorney to ensure required disclosures and compliance with Washington law; this form supplements but does not replace core contract terms.</p>
                        </div>
                      }
                      topic="What is Form 34 - General Addendum and when should I use it?"
                      onAskAI={onAskAI}
                    />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                    Include to attach negotiated or bespoke clauses for Washington residential transactions. Not a substitute for legal advice—confirm wording with your agent or attorney.
                    </p>
                </div>
              </label>
            </div>
        </div>
      </div>
    </>
  );
}

export const Step4_Sidebar = () => (
  <div>
    <h4 className="font-semibold text-gray-900 mb-2">Optional Forms</h4>
    <p className="text-sm text-gray-600">
      Form 22A is needed if you're getting a loan. Form 35 covers inspection
      contingencies. Skip these if paying cash or waiving inspections.
    </p>
  </div>
);
