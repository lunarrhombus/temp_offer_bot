// /app/api/address-mlsid/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { transformPropertyData } from './transform';
import { AddressSearchPayload, ZillowApiError } from './types';

const ZILLOW_API_URL = 'https://www.drillbreaker29.com/api/zillow/search_by_address';
const REQUEST_TIMEOUT_MS = 10000; // 10 seconds

/**
 * POST endpoint to search for property data by address
 * Returns transformed property data with only essential fields
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate payload
    let payload: AddressSearchPayload;
    try {
      payload = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          error: 'Invalid JSON payload',
          details: 'Request body must be valid JSON',
        } as ZillowApiError,
        { status: 400 }
      );
    }

    // Validate that we have at least an address
    if (!payload.address && !payload.zipcode) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          details: 'Must provide at least an address or zipcode',
        } as ZillowApiError,
        { status: 400 }
      );
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    // Fetch from Zillow API
    let response: Response;
    try {
      response = await fetch(ZILLOW_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          {
            error: 'Request timeout',
            details: 'The Zillow API took too long to respond',
          } as ZillowApiError,
          { status: 504 }
        );
      }

      return NextResponse.json(
        {
          error: 'External API error',
          details: `Failed to connect to Zillow API: ${fetchError.message}`,
        } as ZillowApiError,
        { status: 502 }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    // Handle non-200 responses from Zillow API
    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails = 'Unknown error from Zillow API';

      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.message || errorJson.error || errorText;
      } catch {
        errorDetails = errorText.substring(0, 200); // Limit error text length
      }

      return NextResponse.json(
        {
          error: 'Zillow API error',
          details: errorDetails,
          status: response.status,
        } as ZillowApiError,
        { status: response.status }
      );
    }

    // Parse response
    const contentType = response.headers.get('content-type') || '';
    let rawData: any;

    try {
      const responseText = await response.text();
      if (contentType.includes('application/json')) {
        rawData = JSON.parse(responseText);
      } else {
        // If not JSON, return raw text
        return NextResponse.json(
          {
            error: 'Unexpected response format',
            details: `Expected JSON but received ${contentType}`,
          } as ZillowApiError,
          { status: 502 }
        );
      }
    } catch (parseError) {
      return NextResponse.json(
        {
          error: 'Invalid response from Zillow API',
          details: 'Could not parse response as JSON',
        } as ZillowApiError,
        { status: 502 }
      );
    }

    // Check if the response contains an error
    if (rawData.error) {
      return NextResponse.json(
        {
          error: 'Property search failed',
          details: rawData.error,
        } as ZillowApiError,
        { status: 404 }
      );
    }

    // Check if we got valid property data
    if (!rawData.zpid) {
      return NextResponse.json(
        {
          error: 'Property not found',
          details: 'No property data returned for the given address',
        } as ZillowApiError,
        { status: 404 }
      );
    }

    // Transform the data to our clean structure
    const transformedData = transformPropertyData(rawData);

    // Return transformed data
    return NextResponse.json(transformedData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    // Catch-all for unexpected errors
    console.error('Unexpected error in address-mlsid API:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error?.message || 'An unexpected error occurred',
      } as ZillowApiError,
      { status: 500 }
    );
  }
}

/**
 * GET endpoint - returns usage information
 */
export async function GET() {
  return NextResponse.json(
    {
      endpoint: '/api/address-mlsid',
      method: 'POST',
      description: 'Search for property information by address',
      payload: {
        address: 'string (required if no zipcode)',
        city: 'string (optional)',
        state: 'string (optional)',
        zipcode: 'string (required if no address)',
      },
      example: {
        address: '123 Main St',
        city: 'Seattle',
        state: 'WA',
        zipcode: '98101',
      },
    },
    { status: 200 }
  );
}
