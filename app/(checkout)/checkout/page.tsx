'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart-store';
import { submitOrder } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, promocode, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const paymentMethod = formData.get('paymentmethod') as string;

    const result = await submitOrder(items, promocode, paymentMethod);

    if (result.success && result.invoiceId) {
      // Clear the local cart
      clearCart();
      
      // Redirect to WHMCS invoice page for payment gateway processing.
      // E.g., Razorpay requires WHMCS's specific gateway callback structure.
      // The user is already logged in via SSO or their session, so they can view the invoice.
      // In a real app, you might fetch the gateway HTML from WHMCS and render it here,
      // but redirecting to the invoice is the most robust way to handle 3D Secure / UPI flows.
      const whmcsUrl = process.env.NEXT_PUBLIC_WHMCS_URL || 'https://billing.asianodes.com';
      window.location.href = `${whmcsUrl}/viewinvoice.php?id=${result.invoiceId}`;
    } else {
      setError(result.error || 'Failed to process checkout.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
        <h2 className="mb-2 text-2xl font-bold tracking-tight">Order Complete</h2>
        <p className="mb-8 text-muted-foreground">Your cart is empty. Thank you for your business!</p>
        <Button onClick={() => router.push('/portal/dashboard')} size="lg">Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>

      <form onSubmit={handleCheckout}>
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Select your preferred payment method to complete the order.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Label>Payment Method</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Razorpay (Indian Gateway) */}
                <label className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="paymentmethod" value="razorpay" defaultChecked className="h-4 w-4" />
                    <span className="font-medium">UPI / NetBanking (Razorpay)</span>
                  </div>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </label>

                {/* PayPal / Stripe */}
                <label className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="paymentmethod" value="paypal" className="h-4 w-4" />
                    <span className="font-medium">PayPal</span>
                  </div>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </label>
              </div>
            </div>

            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Due Today</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                By clicking &quot;Complete Order&quot;, you agree to our Terms of Service and Privacy Policy.
                You will be redirected to our secure payment gateway to complete your purchase.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Order...
                </>
              ) : (
                'Complete Order & Pay'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
