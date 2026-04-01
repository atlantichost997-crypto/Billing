'use client';

import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, promocode, removeItem, applyPromo, removePromo, getTotal } = useCartStore();

  const handleApplyPromo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get('promo') as string;
    if (code) applyPromo(code);
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground opacity-50" />
        <h2 className="mb-2 text-2xl font-bold tracking-tight">Your cart is empty</h2>
        <p className="mb-8 text-muted-foreground">Looks like you haven&apos;t added any services yet.</p>
        <Link href="/store">
          <Button size="lg">Browse Store</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
              <div className="space-y-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {item.type} • {item.billingcycle}
                </p>
                {item.domain && (
                  <p className="text-xs text-muted-foreground">Domain: {item.domain}</p>
                )}
              </div>
              <div className="mt-4 flex w-full items-center justify-between sm:mt-0 sm:w-auto sm:space-x-6">
                <span className="font-bold">${item.price.toFixed(2)}</span>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your items and apply promotions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>

              {promocode && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Promo ({promocode})</span>
                  <button onClick={removePromo} className="text-xs hover:underline">Remove</button>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total Due Today</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>

              <form onSubmit={handleApplyPromo} className="flex gap-2 pt-4">
                <Input name="promo" placeholder="Promo code" defaultValue={promocode || ''} />
                <Button type="submit" variant="secondary">Apply</Button>
              </form>
            </CardContent>
            <CardFooter>
              <Link href="/checkout" className="w-full">
                <Button className="w-full" size="lg">Proceed to Checkout</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
