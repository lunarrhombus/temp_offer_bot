/**
 * API utilities for offer-related external API calls
 */

/**
 * Triggers the listing scraper for a given MLS ID
 * This function silently fails - it won't throw errors or block user flow
 *
 * @param mlsId - The MLS ID to scrape listing information for
 */
export const triggerListingScraper = async (mlsId: string): Promise<void> => {
  try {
    const response = await fetch('https://offerbot.ngrok.app/offer/listingHouseScrap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        MLS_ID: mlsId
      }),
    });

    // Log response status for debugging
    if (!response.ok) {
      console.warn(`Listing scraper returned status ${response.status}:`, await response.text().catch(() => 'Unable to read response'));
    }
  } catch (error) {
    // Log error for debugging but don't block user flow
    console.warn('Listing scraper request failed:', error);
  }
};
