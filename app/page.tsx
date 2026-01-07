'use client';

import { useState, useEffect, useRef } from 'react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import AIHelpBot from '@/components/AIHelpBot';
import { OfferFormData } from '@/types/offer';
import { saveOfferDraft, loadOfferDraft, clearOfferDraft } from '@/lib/offerStorage';
import { triggerListingScraper } from '@/lib/offerApi';

// Import step components
import Step1_MLSId, { Step1_Sidebar } from '@/components/onboarding/steps/Step1_MLSId';
import Step2_BuyerInfo, { Step2_Sidebar, isValidEmail } from '@/components/onboarding/steps/Step2_BuyerInfo';
import Step3_OfferDetails, { Step3_Sidebar } from '@/components/onboarding/steps/Step3_OfferDetails';
import Step4_Settings, { Step4_Sidebar } from '@/components/onboarding/steps/Step4_Settings';
import Step5_Form22A, { Step5_Sidebar } from '@/components/onboarding/steps/Step5_Form22A';
import Step6_Form35, { Step6_Sidebar } from '@/components/onboarding/steps/Step6_Form35';
import Step7_Review, { Step7_Sidebar } from '@/components/onboarding/steps/Step7_Review';
import SuccessPage from '@/components/onboarding/steps/SuccessPage';

const TOTAL_STEPS = 7;

export default function CreateOfferPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OfferFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState<any>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [includeForm22A, setIncludeForm22A] = useState(false);
  const [includeForm35, setIncludeForm35] = useState(false);

  // Property data from Step 1 (address-mls API)
  const [propertyData, setPropertyData] = useState<{
    mlsId?: string;
    price?: number;
    address?: {
      full?: string;
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    photos?: string[];
  }>({});

  // AI Bot trigger function (set by AIHelpBot via onRegisterTrigger)
  const aiTriggerRef = useRef<((topic: string) => void) | null>(null);

  // Callback to handle "Ask AI" from tooltips
  const handleAskAI = (topic: string) => {
    if (aiTriggerRef.current) {
      aiTriggerRef.current(topic);
    }
  };

  // Load saved draft on mount
  useEffect(() => {
    try {
      const draft = loadOfferDraft();
      if (draft && typeof draft === 'object') {
        setFormData(draft);
        // Check if forms were included
        if (draft.Form22A) setIncludeForm22A(true);
        if (draft.Form35) setIncludeForm35(true);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }, []);

  // Auto-save on data change (debounced to prevent excessive writes)
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      // Debounce: wait 1 second after last change before saving
      const timeoutId = setTimeout(() => {
        saveOfferDraft(formData);
      }, 1000);

      // Clear timeout if formData changes again before 1 second
      return () => clearTimeout(timeoutId);
    }
  }, [formData]);

  const updateFormData = (data: Partial<OfferFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    // Trigger listing scraper when leaving Step 1
    if (currentStep === 1 && formData.MLS_ID) {
      triggerListingScraper(formData.MLS_ID);
    }

    // Skip optional steps if not included
    let nextStep = currentStep + 1;

    if (currentStep === 4) {
      // After settings, check if we need Form22A
      if (!includeForm22A) {
        nextStep = 6; // Skip to Form35 or Review
      }
    }

    if (currentStep === 5 || (currentStep === 4 && !includeForm22A)) {
      // After Form22A (or skipped), check if we need Form35
      if (!includeForm35) {
        nextStep = 7; // Skip to Review
      }
    }

    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    let prevStep = currentStep - 1;

    // Skip back over optional steps
    if (currentStep === 7 && !includeForm35) {
      prevStep = includeForm22A ? 5 : 4;
    }

    if (currentStep === 6 && !includeForm22A) {
      prevStep = 4;
    }

    setCurrentStep(prevStep);
  };

  const handleSubmit = async (finalData: Partial<OfferFormData>) => {
    try {
      setSubmissionError(null); // Clear any previous errors
      const response = await fetch('/api/create-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissionResponse(data);
        setIsSubmitted(true);
        clearOfferDraft();
      } else {
        // Handle different error status codes
        if (response.status >= 500) {
          // Server error - don't try to parse response
          setSubmissionError('Something went wrong on our end. Please try again in a moment.');
        } else if (response.status >= 400) {
          // Client error - try to parse JSON error message
          try {
            const error = await response.json();
            setSubmissionError(error.message || 'There was a problem with your submission. Please check your information and try again.');
          } catch {
            setSubmissionError('There was a problem with your submission. Please check your information and try again.');
          }
        } else {
          setSubmissionError('An unexpected error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionError('Network error. Please check your connection and try again.');
    }
  };

  if (isSubmitted) {
    return <SuccessPage apiResponse={submissionResponse} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_MLSId
            value={formData.MLS_ID || ''}
            onChange={(MLS_ID, listingPrice, propertyInfo) => {
              updateFormData({ MLS_ID, listingPrice });
              if (propertyInfo) {
                setPropertyData(propertyInfo);
              }
            }}
            onAskAI={handleAskAI}
          />
        );
      case 2:
        return (
          <Step2_BuyerInfo
            data={formData.buyerdata}
            onChange={(buyerdata) => updateFormData({ buyerdata })}
            onAskAI={handleAskAI}
          />
        );
      case 3:
        return (
          <Step3_OfferDetails
            data={formData.buyerdata}
            listingPrice={formData.listingPrice}
            onChange={(buyerdata) => updateFormData({ buyerdata })}
            onAskAI={handleAskAI}
          />
        );
      case 4:
        return (
          <Step4_Settings
            data={formData.buyerdata}
            onChange={(buyerdata) => updateFormData({ buyerdata })}
            includeForm22A={includeForm22A}
            includeForm35={includeForm35}
            onToggleForm22A={(val) => setIncludeForm22A(val)}
            onToggleForm35={(val) => setIncludeForm35(val)}
            onAskAI={handleAskAI}
          />
        );
      case 5:
        return (
          <Step5_Form22A
            data={formData.Form22A}
            onChange={(Form22A) => updateFormData({ Form22A })}
            onAskAI={handleAskAI}
          />
        );
      case 6:
        return (
          <Step6_Form35
            data={formData.Form35}
            onChange={(Form35) => updateFormData({ Form35 })}
            onAskAI={handleAskAI}
          />
        );
      case 7:
        return (
          <Step7_Review
            data={formData}
            includeForm22A={includeForm22A}
            includeForm35={includeForm35}
            onSubmit={handleSubmit}
            submissionError={submissionError}
          />
        );
      default:
        return null;
    }
  };

  const renderSidebar = () => {
    switch (currentStep) {
      case 1:
        return null; // Using tooltips instead of sidebar
      case 2:
        return null; // Using tooltips instead of sidebar
      case 3:
        return null; // Using tooltips instead of sidebar
      case 4:
        return null; // Using tooltips instead of sidebar
      case 5:
        return null; // Using tooltips instead of sidebar (to be completed)
      case 6:
        return null; // Using tooltips instead of sidebar (to be completed)
      case 7:
        return null; // Review step - minimal help needed
      default:
        return null;
    }
  };

  // Validate current step before allowing next
  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!formData.MLS_ID && formData.MLS_ID.length > 0;
      case 2:
        return !!(
          formData.buyerdata?.Buyer1Name &&
          formData.buyerdata?.B_Email &&
          isValidEmail(formData.buyerdata.B_Email) &&
          formData.buyerdata?.B_Status &&
          formData.buyerdata?.ClosingDate
        );
      case 3:
        return !!(
          formData.buyerdata?.offer_price_num &&
          formData.buyerdata?.earnest_amount_num &&
          formData.buyerdata?.earnest_amount_delivery_days &&
          formData.buyerdata?.earnest_money_holder &&
          formData.buyerdata?.offer_expiration_days &&
          formData.buyerdata?.ChargesAssessments
        );
      case 4:
        return true; // Step 4 only has optional forms, no required fields
      case 5:
        // Base validation
        const baseValid = !!(
          formData.Form22A?.TypeofLoan &&
          formData.Form22A?.DOWNPAYMENTTYPE &&
          formData.Form22A?.DOWNPAYMENTMAGNITUDE &&
          formData.Form22A?.MAKEAPPLICATIONFORLOANSDAYS &&
          formData.Form22A?.FINANCIALCONTINGENCY &&
          formData.Form22A?.FINANCIALCONTINGENCYTIMEFRAME &&
          formData.Form22A?.APPRAISALCONTINGENCY
        );

        // If VA loan, also require VA escrow fee answer
        if (formData.Form22A?.TypeofLoan === 'VA') {
          return baseValid && !!formData.Form22A?.BUYERPAYESECROWFEEFORVALOAN;
        }

        return baseValid;
      case 6:
        if (!formData.Form35?.SEWERSURVEY) return false;
        // If sewer survey is NO, only require the SEWERSURVEY field
        if (formData.Form35.SEWERSURVEY === 'NO') return true;
        // If sewer survey is YES, require BUYERSNOTICEDAYS
        return !!formData.Form35.BUYERSNOTICEDAYS;
      default:
        return true;
    }
  };

  const getStepTitle = () => {
    const titles: Record<number, string> = {
      1: "MLS ID Entry",
      2: "Buyer Information",
      3: "Offer Details",
      4: "Settings & Optional Forms",
      5: "Financing Details",
      6: "Sewer/Septic Details",
      7: "Review & Submit"
    };
    return titles[currentStep] || `Step ${currentStep}`;
  };

  return (
    <>
      <OnboardingLayout
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onBack={currentStep > 1 ? handleBack : undefined}
        onNext={currentStep < TOTAL_STEPS ? handleNext : undefined}
        nextDisabled={!isStepValid()}
        showBack={currentStep > 1}
        showNext={currentStep < TOTAL_STEPS}
        nextLabel={currentStep === TOTAL_STEPS ? 'Review' : 'Continue'}
        sidebarContent={renderSidebar()}
      >
        {renderStep()}
      </OnboardingLayout>

      {/* AI Help Bot - only show when not on success page */}
      {!isSubmitted && (
        <AIHelpBot
          currentStep={currentStep}
          stepTitle={getStepTitle()}
          propertyData={propertyData}
          formData={formData}
          onRegisterTrigger={(triggerFn) => {
            aiTriggerRef.current = triggerFn;
          }}
        />
      )}
    </>
  );
}
