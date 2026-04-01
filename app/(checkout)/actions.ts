'use server';

import { callWhmcsApi } from '@/lib/whmcs';
import { getSession } from '@/lib/session';
import { WhmcsApiError } from '@/lib/errors';
import type { CartItem, WhmcsAddOrderResponse, WhmcsGetPromotionsResponse } from '@/types/cart';

/**
 * Validates a promotional code against WHMCS active promotions.
 */
export async function validatePromoCode(code: string) {
  if (!code) return { success: false, error: 'Please enter a promo code.' };

  try {
    const response = await callWhmcsApi<WhmcsGetPromotionsResponse>('GetPromotions', {
      code,
    });

    const promo = response.promotions?.promotion?.find(
      (p) => p.code.toLowerCase() === code.toLowerCase() && p.active === '1'
    );

    if (!promo) {
      return { success: false, error: 'Invalid or expired promotional code.' };
    }

    return {
      success: true,
      promo: {
        code: promo.code,
        type: promo.type, // e.g., 'Percentage', 'Fixed Amount'
        value: promo.value,
      },
    };
  } catch (error) {
    console.error('Failed to validate promo code:', error);
    return {
      success: false,
      error: error instanceof WhmcsApiError ? error.userFriendlyMessage : 'Failed to validate promo code.',
    };
  }
}

/**
 * Submits the shopping cart to WHMCS as a new order.
 * Handles the formatting required for Indian payment gateways (like Razorpay).
 */
export async function submitOrder(items: CartItem[], promocode: string | null, paymentMethod: string) {
  const session = await getSession();
  if (!session?.clientId) {
    return { success: false, error: 'You must be logged in to place an order.' };
  }

  if (items.length === 0) {
    return { success: false, error: 'Your cart is empty.' };
  }

  try {
    // WHMCS AddOrder API expects arrays for multiple items, e.g., pid[0]=1, pid[1]=2
    // For simplicity in this headless implementation, we will process the first product.
    // A robust implementation would map all items to the array format:
    const params: Record<string, any> = {
      clientid: session.clientId,
      paymentmethod: paymentMethod, // e.g., 'razorpay'
    };

    if (promocode) {
      params.promocode = promocode;
    }

    // Map cart items to WHMCS array format
    items.forEach((item, index) => {
      if (item.type === 'product' && item.pid) {
        params[`pid[${index}]`] = item.pid;
        params[`billingcycle[${index}]`] = item.billingcycle;
        
        if (item.domain) {
          params[`domain[${index}]`] = item.domain;
        }

        // Map configurable options if present
        if (item.configoptions) {
          // WHMCS expects base64 encoded serialized array or specific array format for configoptions
          // Format: configoptions[0]=base64_encode(serialize(array(1=>2, 3=>4)))
          // Alternatively, some WHMCS versions accept configoptions[0][1]=2
          Object.entries(item.configoptions).forEach(([optId, valId]) => {
            params[`configoptions[${index}][${optId}]`] = valId;
          });
        }
      } else if (item.type === 'domain' && item.domain) {
        params[`domain[${index}]`] = item.domain;
        params[`domaintype[${index}]`] = 'register';
        params[`regperiod[${index}]`] = 1; // Default 1 year for domains
      }
    });

    const response = await callWhmcsApi<WhmcsAddOrderResponse>('AddOrder', params);

    // Return the invoice ID so the client can redirect to the payment gateway
    return {
      success: true,
      orderId: response.orderid,
      invoiceId: response.invoiceid,
    };
  } catch (error) {
    console.error('Failed to submit order:', error);
    return {
      success: false,
      error: error instanceof WhmcsApiError ? error.userFriendlyMessage : 'Failed to process your order.',
    };
  }
}
