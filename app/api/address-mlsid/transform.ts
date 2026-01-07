// Transform raw Zillow API response to clean structure

import { TransformedPropertyData } from './types';

export function transformPropertyData(rawData: any): TransformedPropertyData {
  // Extract HOA fee from string like "$480 monthly"
  const extractHoaFee = (feeString: string | null): number | null => {
    if (!feeString) return null;
    const match = feeString.match(/\$([0-9,]+)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : null;
  };

  // Extract photo URLs (just the main URL, not all responsive versions)
const extractPhotos = (originalPhotos: any[]): string[] => {
  if (!originalPhotos || !Array.isArray(originalPhotos)) return [];
  return originalPhotos
    .slice(0, 20) // Limit to first 20 photos
    .map((photo) => {
      // New structure has mixedSources with webp and jpeg arrays
      if (photo.mixedSources) {
        // Prefer webp for better compression, fallback to jpeg
        const sources = photo.mixedSources.webp || photo.mixedSources.jpeg;
        if (sources && sources.length > 0) {
          // Get the largest image (last in array, typically 1536px width)
          return sources[sources.length - 1]?.url;
        }
      }
      // Fallback for old structure
      return photo.url;
    })
    .filter(Boolean);
};

  return {
    // Basic Info
    zpid: rawData.zpid || 0,
    mlsId: rawData.attributionInfo?.mlsId || null,
    address: {
      street: rawData.streetAddress || '',
      city: rawData.city || '',
      state: rawData.state || '',
      zipcode: rawData.zipcode || '',
      full: rawData.abbreviatedAddress || '',
    },

    // Property Details
    price: rawData.price || null,
    bedrooms: rawData.bedrooms || null,
    bathrooms: rawData.bathrooms || null,
    squareFeet: rawData.livingArea ? parseInt(String(rawData.livingArea)) : null,
    lotSize: rawData.resoFacts?.lotSize || null,
    yearBuilt: rawData.yearBuilt || null,
    homeType: rawData.homeType || 'Unknown',

    // Status
    homeStatus: rawData.homeStatus || 'UNKNOWN',
    daysOnZillow: rawData.daysOnZillow || null,
    timeOnZillow: rawData.timeOnZillow || null,

    // Financial
    zestimate: rawData.zestimate || null,
    priceHistory: (rawData.priceHistory || []).map((item: any) => ({
      date: item.date,
      event: item.event,
      price: item.price,
      priceChangeRate: item.priceChangeRate,
    })),
    taxHistory: (rawData.taxHistory || []).map((item: any) => ({
      year: item.year || 0,
      value: item.value || 0,
    })),
    monthlyHoaFee: extractHoaFee(rawData.resoFacts?.hoaFee || null),
    propertyTaxRate: rawData.propertyTaxRate || null,

    // Media
    originalPhotos: extractPhotos(rawData.originalPhotos),
    virtualTourUrl: rawData.resoFacts?.virtualTour || null,

    // Description
    description: rawData.description || null,

    // Location
    latitude: rawData.latitude || null,
    longitude: rawData.longitude || null,

    // MLS Attribution
    attribution: {
      agentName: rawData.attributionInfo?.agentName || null,
      brokerName: rawData.attributionInfo?.brokerName || null,
      mlsName: rawData.attributionInfo?.mlsName || null,
      lastUpdated: rawData.attributionInfo?.lastUpdated || null,
    },

    // Schools
    schools: (rawData.schools || []).map((school: any) => ({
      name: school.name || '',
      grades: school.grades || '',
      distance: school.distance || 0,
      rating: school.rating || null,
    })),
  };
}
