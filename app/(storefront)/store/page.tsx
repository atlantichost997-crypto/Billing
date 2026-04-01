import { getProducts } from '../actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function StorePage() {
  const { success, products, error } = await getProducts();

  if (!success) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <div className="rounded-md bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error || 'Failed to load products.'}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
        <h2 className="mb-2 text-2xl font-bold tracking-tight">No Products Available</h2>
        <p className="text-muted-foreground">Check back later for new hosting plans.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Cloud Infrastructure</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          High-performance compute nodes for your applications and game servers.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          // Extract USD pricing (fallback to first available currency if USD not found)
          const pricing = product.pricing?.USD || Object.values(product.pricing || {})[0];
          const priceDisplay = pricing ? `${pricing.prefix}${pricing.monthly}${pricing.suffix}/mo` : 'Free / Custom';

          return (
            <Card key={product.pid} className="flex flex-col transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <Badge variant="secondary">{product.type}</Badge>
                </div>
                <CardDescription className="mt-2 line-clamp-2">
                  {/* WHMCS descriptions often contain HTML, so we strip it for the preview or render safely */}
                  {product.description.replace(/<[^>]*>?/gm, '')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4 text-3xl font-bold text-primary">
                  {priceDisplay}
                </div>
                <Separator className="mb-4" />
                
                {/* Display Configurable Options Preview if they exist */}
                {product.configoptions?.configoption && product.configoptions.configoption.length > 0 && (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Configurable Options:</p>
                    <ul className="list-inside list-disc">
                      {product.configoptions.configoption.slice(0, 3).map((opt) => (
                        <li key={opt.id}>{opt.name}</li>
                      ))}
                      {product.configoptions.configoption.length > 3 && (
                        <li>+ {product.configoptions.configoption.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href={`/store/product/${product.pid}`} className="w-full">
                  <Button className="w-full">Configure & Order</Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
