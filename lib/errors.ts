/**
 * Custom error class for WHMCS API failures.
 * Translates raw backend errors into user-friendly messages suitable for toast notifications.
 */
export class WhmcsApiError extends Error {
  public readonly originalMessage: string;
  public readonly userFriendlyMessage: string;

  constructor(message: string) {
    super(message);
    this.name = 'WhmcsApiError';
    this.originalMessage = message;
    this.userFriendlyMessage = translateWhmcsError(message);
  }
}

/**
 * Translates raw WHMCS API error messages into safe, user-friendly strings.
 * This prevents exposing internal database or system errors to the frontend.
 */
function translateWhmcsError(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Authentication & Session
  if (lowerMessage.includes('authentication failed') || lowerMessage.includes('api credentials')) {
    return 'We encountered an issue connecting to the billing system. Please try again later.';
  }
  if (lowerMessage.includes('login details incorrect') || lowerMessage.includes('invalid email or password')) {
    return 'The email or password you entered is incorrect.';
  }
  
  // Registration & Client Management
  if (lowerMessage.includes('email address already in use')) {
    return 'An account with this email address already exists.';
  }
  
  // Domains
  if (lowerMessage.includes('domain not found')) {
    return 'The requested domain could not be found.';
  }

  // Cart & Checkout
  if (lowerMessage.includes('out of stock')) {
    return 'This product is currently out of stock.';
  }
  if (lowerMessage.includes('invalid promo code')) {
    return 'The promotional code entered is invalid or has expired.';
  }

  // Fallback for unhandled errors
  // Log the original message to your monitoring system in a real production environment
  return 'An unexpected error occurred. Please contact support if the issue persists.';
}
