import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-24 dark:bg-zinc-950">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight lg:text-5xl">
          AsiaNodes <span className="text-primary">Headless</span>
        </h1>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left gap-8">
        
        {/* Storefront Link */}
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Storefront{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Browse our high-performance VPS and Game Server nodes.
          </p>
          <div className="mt-4 flex gap-4">
            <Link href="/store">
              <Button>View Products</Button>
            </Link>
          </div>
        </div>

        {/* Domain Search Link */}
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Domains{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Search and register your perfect domain name today.
          </p>
          <div className="mt-4 flex gap-4">
            <Link href="/domain-search">
              <Button variant="secondary">Search Domains</Button>
            </Link>
          </div>
        </div>

        {/* Client Portal Link */}
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Client Portal{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Manage your services, billing, and support tickets.
          </p>
          <div className="mt-4 flex gap-4">
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
