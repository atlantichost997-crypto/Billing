'use server';

import { callWhmcsApi } from '@/lib/whmcs';
import { createSession, deleteSession } from '@/lib/session';
import { WhmcsApiError } from '@/lib/errors';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// --- Zod Validation Schemas ---
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const registerSchema = z.object({
  firstname: z.string().min(2, 'First name is required.'),
  lastname: z.string().min(2, 'Last name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  phonenumber: z.string().min(5, 'Phone number is required.'),
  address1: z.string().min(5, 'Address is required.'),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.'),
  postcode: z.string().min(2, 'Postcode is required.'),
  country: z.string().length(2, 'Country must be a 2-letter ISO code (e.g., US, IN).'),
});

// --- Server Actions ---

export async function loginAction(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data. Please check your inputs.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // 1. Call WHMCS ValidateLogin API
    const response = await callWhmcsApi<{ result: 'success'; clientid: number; userid: number }>('ValidateLogin', {
      email,
      password,
    });

    // 2. Create secure HTTP-only session
    await createSession(response.clientid, email);

  } catch (error) {
    if (error instanceof WhmcsApiError) {
      return { error: error.userFriendlyMessage };
    }
    return { error: 'An unexpected error occurred during login.' };
  }

  // 3. Redirect to portal (must be outside try/catch as it throws an error internally)
  redirect('/portal/dashboard');
}

export async function registerAction(prevState: any, formData: FormData) {
  const validatedFields = registerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data. Please check your inputs.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    // 1. Call WHMCS AddClient API
    const response = await callWhmcsApi<{ result: 'success'; clientid: number }>('AddClient', {
      ...data,
      // WHMCS requires specific formatting for some fields, ensure they match API docs
      noemail: false, // Send welcome email
    });

    // 2. Create secure HTTP-only session
    await createSession(response.clientid, data.email);

  } catch (error) {
    if (error instanceof WhmcsApiError) {
      return { error: error.userFriendlyMessage };
    }
    return { error: 'An unexpected error occurred during registration.' };
  }

  // 3. Redirect to portal
  redirect('/portal/dashboard');
}

export async function logoutAction() {
  await deleteSession();
  redirect('/login');
}
