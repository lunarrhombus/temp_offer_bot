// Type definitions for address/MLS ID API

export interface AddressSearchPayload {
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}

export interface TransformedPropertyData {
  // Basic Info
  zpid: number;
  mlsId: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
    full: string;
  };

  // Property Details
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  lotSize: string | null;
  yearBuilt: number | null;
  homeType: string;

  // Status
  homeStatus: string;
  daysOnZillow: number | null;
  timeOnZillow: string | null;

  // Financial
  zestimate: number | null;
  priceHistory: Array<{
    date: string;
    event: string;
    price: number;
    priceChangeRate?: number;
  }>;
  taxHistory: Array<{
    year: number;
    value: number;
  }>;
  monthlyHoaFee: number | null;
  propertyTaxRate: number | null;

  // Media
  originalPhotos: string[];
  virtualTourUrl: string | null;

  // Description
  description: string | null;

  // Location
  latitude: number | null;
  longitude: number | null;

  // MLS Attribution
  attribution: {
    agentName: string | null;
    brokerName: string | null;
    mlsName: string | null;
    lastUpdated: string | null;
  };

  // Schools
  schools: Array<{
    name: string;
    grades: string;
    distance: number;
    rating: number | null;
  }>;
}

export interface ZillowApiError {
  error: string;
  details?: string;
  status?: number;
}
