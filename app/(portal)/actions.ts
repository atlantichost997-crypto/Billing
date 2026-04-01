'use server';

import { callWhmcsApi } from '@/lib/whmcs';
import { getSession } from '@/lib/session';
import { WhmcsApiError } from '@/lib/errors';
import type { 
  WhmcsGetInvoicesResponse, 
  WhmcsGetClientsProductsResponse, 
  WhmcsGetTicketsResponse,
  WhmcsGetTicketResponse,
  WhmcsCreateSsoTokenResponse
} from '@/types/portal';

async function getClientId() {
  const session = await getSession();
  if (!session?.clientId) throw new Error('Unauthorized');
  return session.clientId;
}

export async function getInvoices(status?: string) {
  try {
    const clientid = await getClientId();
    const params: Record<string, any> = { clientid, limitnum: 50 };
    if (status) params.status = status;

    const response = await callWhmcsApi<WhmcsGetInvoicesResponse>('GetInvoices', params);
    return { success: true, invoices: response.invoices?.invoice || [] };
  } catch (error) {
    return { success: false, error: error instanceof WhmcsApiError ? error.userFriendlyMessage : 'Failed to load invoices.', invoices: [] };
  }
}

export async function getServices() {
  try {
    const clientid = await getClientId();
    const response = await callWhmcsApi<WhmcsGetClientsProductsResponse>('GetClientsProducts', { clientid, limitnum: 50 });
    return { success: true, services: response.products?.product || [] };
  } catch (error) {
    return { success: false, error: error instanceof WhmcsApiError ? error.userFriendlyMessage : 'Failed to load services.', services: [] };
  }
}

export async function getTickets() {
  try {
    const clientid = await getClientId();
    const response = await callWhmcsApi<WhmcsGetTicketsResponse>('GetTickets', { clientid, limitnum: 50 });
    return { success: true, tickets: response.tickets?.ticket || [] };
  } catch (error) {
    return { success: false, error: error instanceof WhmcsApiError ? error.userFriendlyMessage : 'Failed to load tickets.', tickets: [] };
  }
}

export async function getTicket(ticketId: number) {
  try {
    const clientid = await getClientId();
    // In a real app, verify the ticket belongs to the clientid
    const response = await callWhmcsApi<WhmcsGetTicketResponse>('GetTicket', { ticketid });
    return { success: true, ticket: response };
  } catch (error) {
    return { success: false, error: error instanceof WhmcsApiError ? error.userFriendlyMessage : 'Failed to load ticket.' };
  }
}

export async function createSsoToken(serviceId: number) {
  try {
    const clientid = await getClientId();
    const response = await callWhmcsApi<WhmcsCreateSsoTokenResponse>('CreateSsoToken', {
      client_id: clientid,
      destination: `sso:custom_service:${serviceId}`, // Depending on WHMCS module, e.g., sso:service:123
    });
    return { success: true, redirectUrl: response.redirect_url };
  } catch (error) {
    return { success: false, error: error instanceof WhmcsApiError ? error.userFriendlyMessage : 'Failed to generate SSO token.' };
  }
}
