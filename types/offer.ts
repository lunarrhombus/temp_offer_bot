export type FinancialContingencyOption =
  | 'FINCONTIN_OPTIONA_SELLERNOTICETOPERFORM'
  | 'FINCONTIN_OPTIONB_AUTOWAIVED'
  | 'FINCONTIN_OPTIONC';

export interface Form22A {
  TypeofLoan: string;
  DOWNPAYMENTTYPE: 'PERCENTAGE' | 'DOLLAR';
  DOWNPAYMENTMAGNITUDE: number;
  MAKEAPPLICATIONFORLOANSDAYS: number;
  FINANCIALCONTINGENCY: FinancialContingencyOption;
  FINANCIALCONTINGENCYTIMEFRAME: number;
  APPRAISALCONTINGENCY: 'YES' | 'NO';
  LOANCOSTPROVISIONS?: string;
  BUYERPAYESECROWFEEFORVALOAN?: 'YES' | 'NO';
}

export interface Form35 {
  SEWERSURVEY: 'YES' | 'NO';
  BUYERSNOTICEDAYS?: number;
  SEWERREQUESTFORINSPECTIONREPORT?: 'YES' | 'NO';
  ADDITIONALTIMEFORINSPECTION?: number;
  SEWERRESPONSETIMETOREQUESTFORREPAIRSORMODIFICATIONS?: number;
  BUYERSREPLYTOSELLERSRESPONSE?: number;
  REPAIRSCLOSINGDATE?: number;
  NEIGHBORHOODREVIEWCONTINGENCYCHECK?: 'YES' | 'NO';
  NEIGHBORHOODREVIEWCONTINGENCYDAYS?: number;
  BUYERWAVIEDRISKASSESSMENT?: 'YES' | 'NO';
}

export interface BuyerData {
  PI_SellPrice: number;
  PI_SellPriceW: string;
  EM_PC1: number;
  Buyer1Name: string;
  B_Email: string;
  Buyer2Name?: string;
  offer_price_num: number;
  offer_price_words: string;
  earnest_amount_num: number;
  earnest_amount_delivery_days: number;
  earnest_money_holder: string;
  offer_expiration_days: number;
  B_Status: string;
  ClosingDate: string;
  ServicesofUtils?: string;
  ChargesAssessments: string;
  VerificationPeriod: string;
  addendums?: string[];
}

export interface OfferFormData {
  MLS_ID: string;
  listingPrice?: number;
  Form22A?: Partial<Form22A>;
  Form35?: Partial<Form35>;
  buyerdata?: Partial<BuyerData>;
  requestAgentHelp?: boolean;
  agentHelpNotes?: string;
}
