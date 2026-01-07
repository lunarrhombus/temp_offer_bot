'use client';

import { BuyerData } from '@/types/offer';
import { numberToWords } from '@/lib/offerStorage';
import { useState, useEffect } from 'react';
import Tooltip from '@/components/ui/Tooltip';

interface Step3Props {
  data?: Partial<BuyerData>;
  listingPrice?: number;
  onChange: (data: Partial<BuyerData>) => void;
  onAskAI?: (topic: string) => void;
}

export default function Step3_OfferDetails({ data = {}, listingPrice, onChange, onAskAI }: Step3Props) {
  const [offerPrice, setOfferPrice] = useState(data.offer_price_num?.toString() || '');
  const [earnestMoney, setEarnestMoney] = useState(data.earnest_amount_num?.toString() || '');

  // Initialize default values if not set
  useEffect(() => {
    const updates: Partial<BuyerData> = {};

    if (!data.earnest_money_holder) {
      updates.earnest_money_holder = 'Closing Agent';
    }
    if (!data.earnest_amount_delivery_days) {
      updates.earnest_amount_delivery_days = 3;
    }
    if (!data.offer_expiration_days) {
      updates.offer_expiration_days = 3;
    }
    if (!data.ChargesAssessments) {
      updates.ChargesAssessments = 'PrepaidBySeller';
    }

    // Set default offer price to listing price if available and not already set
    if (listingPrice && !data.offer_price_num) {
      updates.offer_price_num = listingPrice;
      updates.PI_SellPrice = listingPrice;
      updates.offer_price_words = numberToWords(listingPrice);
      updates.PI_SellPriceW = numberToWords(listingPrice);
      setOfferPrice(listingPrice.toLocaleString('en-US'));
    }

    // Set default earnest money to 4% of listing price if available and not already set
    if (listingPrice && !data.earnest_amount_num) {
      const earnestAmount = Math.round(listingPrice * 0.04);
      updates.earnest_amount_num = earnestAmount;
      updates.EM_PC1 = earnestAmount;
      setEarnestMoney(earnestAmount.toLocaleString('en-US'));
    }

    if (Object.keys(updates).length > 0) {
      onChange({ ...data, ...updates });
    }
  }, [listingPrice]);

  const handleOfferPriceChange = (value: string) => {
    setOfferPrice(value);
    const num = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(num)) {
      onChange({
        ...data,
        offer_price_num: num,
        PI_SellPrice: num,
        offer_price_words: numberToWords(num),
        PI_SellPriceW: numberToWords(num),
      });
    }
  };

  const handleEarnestMoneyChange = (value: string) => {
    setEarnestMoney(value);
    const num = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(num)) {
      onChange({
        ...data,
        earnest_amount_num: num,
        EM_PC1: num,
      });
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(num)) {
      return num.toLocaleString('en-US');
    }
    return value;
  };

  return (
    <>
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Offer details
        </h2>
        <p className="text-gray-600 mb-8">
          Enter your offer price and earnest money amount
        </p>

        <div className="space-y-6">
          {/* Offer Price */}
          <div>
            <label htmlFor="offer_price" className="block text-sm font-medium text-gray-700 mb-2">
              Offer Price <span className="text-red-500">*</span>
              <Tooltip
                content={
                  <div>
                    <p className="mb-2">This is the total amount you're willing to pay for the property.</p>
                    <p className="mb-1 font-semibold">Factors to consider:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Current market conditions in the area</li>
                      <li>Recent comparable sales (comps)</li>
                      <li>Overall property condition</li>
                      <li>Your budget and financing capacity</li>
                    </ul>
                  </div>
                }
                topic="How should I determine my offer price and what factors should I consider?"
                onAskAI={onAskAI}
              />
            </label>
            {listingPrice && (
              <p className="text-sm text-purple-600 mb-2">
                Listing Price: ${listingPrice.toLocaleString('en-US')}
              </p>
            )}
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500 text-lg">$</span>
              <input
                type="text"
                id="offer_price"
                value={offerPrice}
                onChange={(e) => handleOfferPriceChange(e.target.value)}
                onBlur={() => setOfferPrice(formatCurrency(offerPrice))}
                placeholder="825,000"
                className="w-full border border-gray-300 rounded-md pl-8 pr-4 py-3 text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
              />
            </div>
            {data.offer_price_num && (
              <p className="mt-2 text-sm text-gray-500 italic">
                {data.offer_price_words}
              </p>
            )}
          </div>

          {/* Earnest Money */}
          <div>
            <label htmlFor="earnest_money" className="block text-sm font-medium text-gray-700 mb-2">
              Earnest Money Amount <span className="text-red-500">*</span>
              <Tooltip
                content={
                  <div>
                    <p className="mb-2">A good-faith deposit demonstrating your commitment to purchasing the property.</p>
                    <p className="mb-1 font-semibold">How it works:</p>
                    <ul className="list-disc list-inside space-y-1 mb-2">
                      <li>Applied toward your down payment at closing</li>
                      <li>Held securely in escrow during the transaction</li>
                      <li>May be forfeited if you withdraw without a valid contingency</li>
                    </ul>
                    <p className="font-semibold">In 99% of transactions, earnest money is 3-5% of the offer price.</p>
                  </div>
                }
                topic="What is earnest money and how much should I offer?"
                onAskAI={onAskAI}
              />
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500 text-lg">$</span>
              <input
                type="text"
                id="earnest_money"
                value={earnestMoney}
                onChange={(e) => handleEarnestMoneyChange(e.target.value)}
                onBlur={() => setEarnestMoney(formatCurrency(earnestMoney))}
                placeholder="25,000"
                className="w-full border border-gray-300 rounded-md pl-8 pr-4 py-3 text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
              />
            </div>
            {data.offer_price_num && data.earnest_amount_num && (
              <p className="mt-2 text-sm text-gray-500">
                {((data.earnest_amount_num / data.offer_price_num) * 100).toFixed(2)}% of offer price
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
            <p className="text-sm text-blue-900">
              <strong>Good to know:</strong> Earnest money shows your commitment to the purchase.
              Typical amounts are 3-5% of the offer price. Higher earnest money can make your offer more competitive.
            </p>
          </div>

          {/* Earnest Money Delivery Days */}
          <div>
            <label htmlFor="earnest_delivery_days" className="block text-sm font-medium text-gray-700 mb-2">
              Earnest Money Delivery Timeline <span className="text-red-500">*</span>
              <Tooltip
                content="The number of days you have after mutual acceptance to deliver your earnest money. In 99% of transactions, buyers deliver within 2-5 days."
                topic="How many days should I allow for earnest money delivery?"
                onAskAI={onAskAI}
              />
            </label>
            <div className="relative">
              <input
                type="number"
                id="earnest_delivery_days"
                value={data.earnest_amount_delivery_days || ''}
                onChange={(e) => onChange({ ...data, earnest_amount_delivery_days: parseInt(e.target.value) })}
                placeholder="3"
                min="1"
                max="10"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
              />
              <span className="absolute right-12 top-3 text-gray-500 text-lg">days</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Days after mutual acceptance to deliver earnest money
            </p>
          </div>

          {/* Earnest Money Holder */}
            <div>
            <label htmlFor="earnest_holder" className="block text-sm font-medium text-gray-700 mb-2">
              Earnest Money Holder <span className="text-red-500">*</span>
              <Tooltip
                content={
                  <div>
                    <p className="mb-2">Select who will hold your earnest money securely in escrow:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Closing Agent:</strong> A title or escrow company holds the funds (used in 99% of transactions)</li>
                      <li><strong>Buyer Brokerage Firm:</strong> Your real estate agent's firm holds the funds</li>
                      <li><strong>Promissory Note:</strong> A written promise to pay later (rarely used)</li>
                    </ul>
                  </div>
                }
                topic="Who should hold my earnest money and what are the differences?"
                onAskAI={onAskAI}
              />
            </label>
            <select
              id="earnest_holder"
              value={data.earnest_money_holder ?? 'Closing Agent'}
              onChange={(e) => onChange({ ...data, earnest_money_holder: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Closing Agent">Closing Agent (Escrow Office)</option>
              <option value="Buyer Brokerage Firm">Buyer Brokerage Firm</option>
              <option value="Promissory Note (included as an Addendum)">Promissory Note (included as an Addendum)</option>
            </select>
            </div>

          {/* Offer Expiration Days */}
          <div>
            <label htmlFor="offer_expiration" className="block text-sm font-medium text-gray-700 mb-2">
              Offer Valid For <span className="text-red-500">*</span>
              <Tooltip
                content={
                  <div>
                    <p className="mb-2">The number of days the seller has to accept your offer before it expires.</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>2-3 days:</strong> Standard timeframe used in 99% of transactions</li>
                      <li><strong>1 day:</strong> Creates urgency in competitive markets</li>
                      <li><strong>5-7 days:</strong> Provides the seller additional time to consider</li>
                    </ul>
                  </div>
                }
                topic="How long should I make my offer valid for?"
                onAskAI={onAskAI}
              />
            </label>
            <div className="relative">
              <input
                type="number"
                id="offer_expiration"
                value={data.offer_expiration_days || ''}
                onChange={(e) => onChange({ ...data, offer_expiration_days: parseInt(e.target.value) })}
                placeholder="3"
                min="1"
                max="14"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic"
              />
              <span className="absolute right-12 top-3 text-gray-500 text-lg">days</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              How long the seller has to accept your offer
            </p>
          </div>

          {/* Charges and Assessments */}
          <div>
            <label htmlFor="charges_assessments" className="block text-sm font-medium text-gray-700 mb-2">
              Charges and Assessments <span className="text-red-500">*</span>
              <Tooltip
                content={
                  <div>
                    <p className="mb-2">Determines who pays ongoing charges like HOA fees, property taxes, utilities, etc.:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Prepaid by Seller:</strong> Seller pays all charges upfront through closing (used in 99% of transactions)</li>
                      <li><strong>Prorated at Closing:</strong> Costs split proportionally based on the closing date</li>
                      <li><strong>Paid by Buyer:</strong> Buyer assumes responsibility for all charges</li>
                    </ul>
                  </div>
                }
                topic="How should charges and assessments be handled?"
                onAskAI={onAskAI}
              />
            </label>
            <select
              id="charges_assessments"
              value={data.ChargesAssessments || ''}
              onChange={(e) => onChange({ ...data, ChargesAssessments: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select option...</option>
              <option value="PrepaidBySeller">Prepaid by Seller</option>
              <option value="ProRated">Prorated at Closing</option>
              <option value="PaidByBuyer">Paid by Buyer</option>
            </select>
          </div>

        </div>
      </div>
    </>
  );
}

export const Step3_Sidebar = () => (
  <div>
    <h4 className="font-semibold text-gray-900 mb-2">Offer Price</h4>
    <p className="text-sm text-gray-600 mb-4">
      The total amount you're willing to pay for the property. Consider:
    </p>
    <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside mb-6">
      <li>Market conditions in the area</li>
      <li>Comparable sales (comps)</li>
      <li>Property condition</li>
      <li>Your budget and financing</li>
      <li>Seller's asking price</li>
    </ul>

    <h4 className="font-semibold text-gray-900 mb-2">Earnest Money</h4>
    <p className="text-sm text-gray-600 mb-4">
      A deposit that shows you're serious about buying the property. This money:
    </p>
    <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside mb-4">
      <li>Goes toward your down payment at closing</li>
      <li>Is held in escrow during the transaction</li>
      <li>May be forfeited if you back out without a valid contingency</li>
      <li>Is typically refundable during the inspection period</li>
    </ul>

    <div className="mt-4 p-4 bg-green-50 rounded-md mb-6">
      <p className="text-sm text-green-900">
        <strong>Typical Amounts:</strong><br />
        • Standard market: 3-5%<br />
        • Competitive market: 5-8%<br />
      </p>
    </div>

    <h4 className="font-semibold text-gray-900 mb-2">Earnest Money Delivery</h4>
    <p className="text-sm text-gray-600 mb-4">
      You typically have 2-5 days after mutual acceptance to deliver earnest money to the holder.
    </p>

    <h4 className="font-semibold text-gray-900 mb-2">Earnest Money Holder</h4>
    <p className="text-sm text-gray-600 mb-4">
      Choose who will hold your earnest money in escrow:
    </p>
    <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside mb-4">
      <li><strong>Buyer Brokerage Firm:</strong> Your agent's firm holds it (most common)</li>
      <li><strong>Closing Agent:</strong> Title/escrow company holds it</li>
      <li><strong>Promissory Note:</strong> Promise to pay (less common)</li>
    </ul>

    <h4 className="font-semibold text-gray-900 mb-2">Offer Expiration</h4>
    <p className="text-sm text-gray-600">
      Standard offers are valid for 2-3 days. Shorter periods (1 day) can create urgency.
      Longer periods (5-7 days) give sellers more time to consider.
    </p>
  </div>
);
