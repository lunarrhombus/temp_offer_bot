import { OfferFormData } from '@/types/offer';

const STORAGE_KEY = 'wayber_offer_draft';

export const saveOfferDraft = (data: Partial<OfferFormData>): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (error: any) {
    // Handle QuotaExceededError by clearing old data and retrying
    if (error?.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, clearing old drafts...');
      try {
        // Clear the draft and try again
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (retryError) {
        console.error('Failed to save offer draft after clearing:', retryError);
      }
    } else {
      console.error('Failed to save offer draft:', error);
    }
  }
};

export const loadOfferDraft = (): Partial<OfferFormData> | null => {
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch (error) {
    console.error('Failed to load offer draft:', error);
    // If parsing fails, clear the corrupt data
    clearOfferDraft();
  }
  return null;
};

export const clearOfferDraft = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to clear offer draft:', error);
  }
};

export const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero and 00/100';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  const convertHundreds = (n: number): string => {
    let result = '';
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    const ten = Math.floor(remainder / 10);
    const one = remainder % 10;

    if (hundred > 0) {
      result += ones[hundred] + ' Hundred';
      if (remainder > 0) result += ' ';
    }

    if (remainder >= 10 && remainder < 20) {
      result += teens[remainder - 10];
    } else {
      if (ten > 0) result += tens[ten];
      if (ten > 0 && one > 0) result += '-';
      if (one > 0) result += ones[one];
    }

    return result;
  };

  const million = Math.floor(num / 1000000);
  const thousand = Math.floor((num % 1000000) / 1000);
  const hundred = num % 1000;

  let words = '';

  if (million > 0) {
    words += convertHundreds(million) + ' Million';
    if (thousand > 0 || hundred > 0) words += ' ';
  }

  if (thousand > 0) {
    words += convertHundreds(thousand) + ' Thousand';
    if (hundred > 0) words += ' ';
  }

  if (hundred > 0) {
    words += convertHundreds(hundred);
  }

  return words.trim() + ' and 00/100';
};
