'use client';

import { useState } from 'react';
import { checkDomainAvailability } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, CheckCircle2, XCircle } from 'lucide-react';

export default function DomainSearchPage() {
  const [domain, setDomain] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    status?: string;
    domain?: string;
    error?: string;
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    setIsSearching(true);
    setResult(null);

    const res = await checkDomainAvailability(domain);
    setResult(res);
    setIsSearching(false);
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">Find Your Perfect Domain</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Search for the perfect domain name for your next project or game server.
        </p>

        <Card className="mx-auto w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Domain Search</CardTitle>
            <CardDescription>Enter a domain name to check its availability.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="e.g., asianodes.com"
                  className="pl-10 text-lg"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={isSearching}
                />
              </div>
              <Button type="submit" size="lg" disabled={isSearching || !domain}>
                {isSearching ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Search'}
              </Button>
            </form>

            {/* Results Section */}
            {result && (
              <div className="mt-8 rounded-lg border p-6 text-left transition-all">
                {result.error ? (
                  <div className="flex items-center text-red-600 dark:text-red-400">
                    <XCircle className="mr-3 h-6 w-6" />
                    <span className="font-medium">{result.error}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-between sm:flex-row">
                    <div className="flex items-center">
                      {result.status === 'available' ? (
                        <CheckCircle2 className="mr-3 h-8 w-8 text-green-500" />
                      ) : (
                        <XCircle className="mr-3 h-8 w-8 text-red-500" />
                      )}
                      <div>
                        <h3 className="text-xl font-bold">{result.domain}</h3>
                        <p className={`text-sm font-medium ${result.status === 'available' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {result.status === 'available' ? 'Available to register!' : 'Already taken.'}
                        </p>
                      </div>
                    </div>
                    
                    {result.status === 'available' && (
                      <Button className="mt-4 sm:mt-0" variant="default">
                        Add to Cart
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
