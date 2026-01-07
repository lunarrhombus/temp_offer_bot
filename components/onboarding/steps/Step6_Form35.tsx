'use client';

import { Form35 } from '@/types/offer';
import { useEffect } from 'react';
import Tooltip from '@/components/ui/Tooltip';

interface Step6Props {
  data?: Partial<Form35>;
  onChange: (data: Partial<Form35>) => void;
  onAskAI?: (topic: string) => void;
}

export default function Step6_Form35({ data = {}, onChange, onAskAI }: Step6Props) {
  const updateField = (field: keyof Form35, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Initialize default values if not set
  useEffect(() => {
    const updates: Partial<Form35> = {};

    if (!data.SEWERSURVEY) {
      updates.SEWERSURVEY = 'YES';
    }

    if (!data.ADDITIONALTIMEFORINSPECTION) {
      updates.ADDITIONALTIMEFORINSPECTION = 10;
    }

    if (!data.SEWERRESPONSETIMETOREQUESTFORREPAIRSORMODIFICATIONS) {
      updates.SEWERRESPONSETIMETOREQUESTFORREPAIRSORMODIFICATIONS = 3;
    }

    if (!data.BUYERSREPLYTOSELLERSRESPONSE) {
      updates.BUYERSREPLYTOSELLERSRESPONSE = 1;
    }

    if (!data.REPAIRSCLOSINGDATE) {
      updates.REPAIRSCLOSINGDATE = 8;
    }

    if (!data.BUYERSNOTICEDAYS) {
      updates.BUYERSNOTICEDAYS = 10;
    }

    if (!data.SEWERREQUESTFORINSPECTIONREPORT) {
      updates.SEWERREQUESTFORINSPECTIONREPORT = 'YES';
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
          Inspection details
        </h2>
        <p className="text-gray-600 mb-8">
          Form 35 - Inspection and contingency addendum
        </p>

        <div className="space-y-6">
       

          {/* General Inspection Timeframes */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inspection Timeframe</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="buyers_notice_days" className="block text-sm font-medium text-gray-700 mb-2">
                  Inspection contingency allotted time (days) <span className="text-red-500">*</span>
                  <Tooltip
                    content="The total number of days you have to notify the seller if you want to request repairs, renegotiate, or withdraw from the purchase based on inspection findings. In 99% of transactions, this is set to 10 days. You must provide written notice to the seller within this timeframe or you forfeit your inspection contingency and are obligated to proceed with the purchase as-is."
                    topic="How many days should I allow for inspection contingency?"
                    onAskAI={onAskAI}
                  />
                </label>
                <input
                  type="number"
                  id="buyers_notice_days"
                  value={data.BUYERSNOTICEDAYS || ''}
                  onChange={(e) => updateField('BUYERSNOTICEDAYS', parseInt(e.target.value))}
                  placeholder="10"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
                />
              </div>
              <div>
                <label htmlFor="additional_inspection_time" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Inspection Time Allotment (days)
                  <Tooltip
                    content="The number of days after mutual acceptance you have to complete all property inspections (home inspection, pest inspection, etc.). In 99% of transactions, buyers allow 10 days for thorough inspections. This gives you time to hire inspectors, schedule appointments, and review all reports before deciding whether to proceed with the purchase."
                    topic="How many days should I allow to complete inspections?"
                    onAskAI={onAskAI}
                  />
                </label>
                <input
                  type="number"
                  id="additional_inspection_time"
                  value={data.ADDITIONALTIMEFORINSPECTION || ''}
                  onChange={(e) => updateField('ADDITIONALTIMEFORINSPECTION', parseInt(e.target.value))}
                  placeholder="10"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Times</h3>
              <div>
                <label htmlFor="response_time_repairs" className="block text-sm font-medium text-gray-700 mb-2">
                  Seller Response Time for Repair Requests (days)
                  <Tooltip
                    content="The number of days the seller has to respond to your repair requests or inspection objections. In 99% of transactions, this is set to 3 days. The seller can agree to make repairs, offer a credit, refuse the requests, or counter with alternative solutions. This ensures the transaction keeps moving forward and doesn't stall indefinitely."
                    topic="How long should the seller have to respond to repair requests?"
                    onAskAI={onAskAI}
                  />
                </label>
                <input
                  type="number"
                  id="response_time_repairs"
                  value={data.SEWERRESPONSETIMETOREQUESTFORREPAIRSORMODIFICATIONS || ''}
                  onChange={(e) => updateField('SEWERRESPONSETIMETOREQUESTFORREPAIRSORMODIFICATIONS', parseInt(e.target.value))}
                  placeholder="3"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
                />
              </div>

              <div>
                <label htmlFor="buyer_reply_time" className="block text-sm font-medium text-gray-700 mb-2">
                  Buyer's Reply Time to Seller's Response (days)
                  <Tooltip
                    content="The number of days you have to respond after the seller replies to your repair requests. In 99% of transactions, this is set to 1 day (24 hours). You must decide whether to accept the seller's proposed solution, negotiate further, or withdraw from the purchase. If you don't respond within this timeframe, the purchase typically proceeds as-is without the requested repairs."
                    topic="How long should I have to reply to the seller's response?"
                    onAskAI={onAskAI}
                  />
                </label>
                <input
                  type="number"
                  id="buyer_reply_time"
                  value={data.BUYERSREPLYTOSELLERSRESPONSE || ''}
                  onChange={(e) => updateField('BUYERSREPLYTOSELLERSRESPONSE', parseInt(e.target.value))}
                  placeholder="1"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div>
                <label htmlFor="repairs_closing_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Days Before Closing for Repairs (days)
                  <Tooltip
                    content="The number of days before the closing date that all agreed-upon repairs must be completed by the seller. In 99% of transactions, this is set to 8 days. This buffer ensures repairs are finished with enough time for you to verify the work was completed satisfactorily before closing. The seller must provide documentation or allow re-inspection to confirm completion."
                    topic="When should repairs be completed before closing?"
                    onAskAI={onAskAI}
                  />
                </label>
                <input
                  type="number"
                  id="repairs_closing_date"
                  value={data.REPAIRSCLOSINGDATE || ''}
                  onChange={(e) => updateField('REPAIRSCLOSINGDATE', parseInt(e.target.value))}
                  placeholder="8"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
                />
              </div>
            </div>
          </div>

             {/* Sewer Survey */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sewer Inspection</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sewer Survey <span className="text-red-500">*</span>
                  <Tooltip
                    content="A sewer scope inspection uses a specialized camera to inspect the condition of the property's sewer line from the house to the street connection. This can reveal expensive issues like tree root intrusion, cracks, collapses, or improper installation that could cost $5,000-$20,000+ to repair. In 99% of transactions, buyers include this inspection as it's one of the most common sources of unexpected major expenses. Selecting 'Yes' allows you to request this inspection and negotiate repairs if problems are found."
                    topic="What is a sewer survey and should I include it?"
                    onAskAI={onAskAI}
                  />
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sewer_survey"
                      value="YES"
                      checked={data.SEWERSURVEY === 'YES'}
                      onChange={(e) => updateField('SEWERSURVEY', 'YES')}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sewer_survey"
                      value="NO"
                      checked={data.SEWERSURVEY === 'NO'}
                      onChange={(e) => updateField('SEWERSURVEY', 'NO')}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const Step6_Sidebar = () => (
  <div>
    <h4 className="font-semibold text-gray-900 mb-2">Sewer Survey</h4>
    <p className="text-sm text-gray-600 mb-4">
      A sewer scope inspection checks the condition of the property's sewer line.
      This can reveal expensive issues before you buy.
    </p>

    <h4 className="font-semibold text-gray-900 mb-2 mt-6">Inspection Timeframes</h4>
    <p className="text-sm text-gray-600 mb-4">
      These periods establish the timeline for the inspection process:
    </p>
    <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside mb-6">
      <li><strong>Additional Time for Inspection:</strong> Extra days beyond standard to complete inspections</li>
      <li><strong>Seller Response Time:</strong> How long seller has to respond to repair requests</li>
      <li><strong>Buyer Reply Time:</strong> How long buyer has to respond to seller's offer</li>
      <li><strong>Repairs Before Closing:</strong> Buffer time for repairs before closing</li>
    </ul>

    <div className="mt-4 p-4 bg-yellow-50 rounded-md">
      <p className="text-sm text-yellow-900">
        <strong>Important:</strong> These contingencies protect you but can make your offer less competitive.
        Consult with your agent about which are essential for your situation.
      </p>
    </div>
  </div>
);
