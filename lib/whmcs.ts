import 'server-only'; // STRICT ENFORCEMENT: This file can NEVER be imported into a Client Component
import { WhmcsApiError } from './errors';
import type { WhmcsBaseResponse, WhmcsParams } from '@/types/whmcs';

const WHMCS_URL = process.env.WHMCS_URL;
const WHMCS_IDENTIFIER = process.env.WHMCS_IDENTIFIER;
const WHMCS_SECRET = process.env.WHMCS_SECRET;

/**
 * Core WHMCS API Client
 * 
 * This function acts as the secure middleware between the Next.js frontend and the WHMCS backend.
 * It standardizes the request format, injects secure credentials, and handles error translation.
 * 
 * @param action The WHMCS API action to call (e.g., 'GetProducts', 'ValidateLogin')
 * @param params Additional parameters required for the specific action
 * @returns The parsed JSON response from WHMCS
 */
export async function callWhmcsApi<T extends WhmcsBaseResponse>(
  action: string,
  params: WhmcsParams = {}
): Promise<T> {
  // 1. Validate environment configuration
  if (!WHMCS_URL || !WHMCS_IDENTIFIER || !WHMCS_SECRET) {
    console.error('CRITICAL: WHMCS API credentials are not configured in the environment.');
    throw new Error('Internal Server Configuration Error');
  }

  // 2. Construct the secure payload
  // WHMCS API expects form-urlencoded data
  const payload = new URLSearchParams({
    identifier: WHMCS_IDENTIFIER,
    secret: WHMCS_SECRET,
    action: action,
    responsetype: 'json',
  });

  // Append dynamic parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      payload.append(key, String(value));
    }
  });

  try {
    // 3. Execute the request
    const response = await fetch(WHMCS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
      // We use 'no-store' to ensure we always get fresh data for billing/client operations.
      // Specific caching strategies can be implemented at the Server Action level if needed.
      cache: 'no-store', 
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(`[WHMCS API Error] Action: ${action} | HTTP ${response.status} | Body:`, responseText.substring(0, 500));
      if (response.status === 403) {
        throw new Error(`HTTP 403 Forbidden. This usually means the server IP is not whitelisted in WHMCS (General Settings -> Security -> API IP Access Restriction) or a WAF (like Cloudflare) is blocking the request.`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 4. Parse and validate the response
    let data: T;
    try {
      data = JSON.parse(responseText) as T;
    } catch (parseError) {
      console.error(`[WHMCS API Error] Action: ${action} | Failed to parse JSON. Received:`, responseText.substring(0, 200));
      throw new Error('Invalid response from billing system. Ensure WHMCS_URL is correct and points to the API endpoint.');
    }

    if (data.result === 'error') {
      // Throw our custom error class which will translate the message
      throw new WhmcsApiError(data.message || 'Unknown WHMCS API Error');
    }

    return data;
  } catch (error) {
    // If it's already our custom error, rethrow it so the Server Action can catch it
    if (error instanceof WhmcsApiError) {
      throw error;
    }
    
    // Log unexpected network/parsing errors securely on the server
    console.error(`[WHMCS API Error] Action: ${action} | Details:`, error);
    
    if (error instanceof Error && error.message.includes('HTTP 403 Forbidden')) {
      throw new WhmcsApiError(error.message);
    }

    // Throw a generic translated error to prevent leaking stack traces to the client
    throw new WhmcsApiError('Connection to billing system failed.');
  }
}
