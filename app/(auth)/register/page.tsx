'use client';

import { useActionState } from 'react';
import { registerAction } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Join AsiaNodes to deploy and manage your infrastructure.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {state?.error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                {state.error}
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input id="firstname" name="firstname" required disabled={isPending} />
                {state?.fieldErrors?.firstname && (
                  <p className="text-sm text-red-500">{state.fieldErrors.firstname[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input id="lastname" name="lastname" required disabled={isPending} />
                {state?.fieldErrors?.lastname && (
                  <p className="text-sm text-red-500">{state.fieldErrors.lastname[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={isPending} />
              {state?.fieldErrors?.email && (
                <p className="text-sm text-red-500">{state.fieldErrors.email[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required disabled={isPending} />
              {state?.fieldErrors?.password && (
                <p className="text-sm text-red-500">{state.fieldErrors.password[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phonenumber">Phone Number</Label>
              <Input id="phonenumber" name="phonenumber" type="tel" required disabled={isPending} />
              {state?.fieldErrors?.phonenumber && (
                <p className="text-sm text-red-500">{state.fieldErrors.phonenumber[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address1">Address</Label>
              <Input id="address1" name="address1" required disabled={isPending} />
              {state?.fieldErrors?.address1 && (
                <p className="text-sm text-red-500">{state.fieldErrors.address1[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required disabled={isPending} />
                {state?.fieldErrors?.city && (
                  <p className="text-sm text-red-500">{state.fieldErrors.city[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Region</Label>
                <Input id="state" name="state" required disabled={isPending} />
                {state?.fieldErrors?.state && (
                  <p className="text-sm text-red-500">{state.fieldErrors.state[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode / ZIP</Label>
                <Input id="postcode" name="postcode" required disabled={isPending} />
                {state?.fieldErrors?.postcode && (
                  <p className="text-sm text-red-500">{state.fieldErrors.postcode[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country Code (e.g., US, IN)</Label>
                <Input id="country" name="country" maxLength={2} required disabled={isPending} />
                {state?.fieldErrors?.country && (
                  <p className="text-sm text-red-500">{state.fieldErrors.country[0]}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
