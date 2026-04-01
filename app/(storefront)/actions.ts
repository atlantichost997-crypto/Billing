'use server';

import { callWhmcsApi } from '@/lib/whmcs';
import { WhmcsApiError } from '@/lib/errors';
import type { WhmcsGetProductsResponse, WhmcsDomainWhoisResponse } from '@/types/product';

/**
 * Fetches products from WHMCS.
 * @param groupId Optional group ID to filter products
 */
export async function getProducts(groupId?: number) {
  try {
    const params: Record<string, string | number> = {};
    if (groupId) {
      params.gid = groupId;
    }

    const response = await callWhmcsApi<WhmcsGetProductsResponse>('GetProducts', params);
    
    // WHMCS API returns an object with a 'product' array inside 'products'
    return {
      success: true,
      products: response.products?.product || [],
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return {
      success: false,
      error: error instanceof WhmcsApiError ? error.userFriendlyMessage : 'Failed to load products.',
      products: [],
    };
  }
}

/**
 * Checks domain availability using WHMCS DomainWhois action.
 * @param domain The domain name to check (e.g., 'asianodes.com')
 */
export async function checkDomainAvailability(domain: string) {
  if (!domain || domain.length < 3 || !domain.includes('.')) {
    return { success: false, error: 'Please enter a valid domain name.' };
  }

  try {
    const response = await callWhmcsApi<WhmcsDomainWhoisResponse>('DomainWhois', {
      domain,
    });

    return {
      success: true,
      status: response.status, // 'available', 'unavailable', or 'error'
      domain: response.domain,
    };
  } catch (error) {
    console.error('Failed to check domain:', error);
    return {
      success: false,
      error: error instanceof WhmcsApiError ? error.userFriendlyMessage : 'Failed to check domain availability.',
    };
  }
}
