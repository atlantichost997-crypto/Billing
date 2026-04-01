import Link from 'next/link';
import { getSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Server, Receipt, LifeBuoy, LogOut } from 'lucide-react';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  async function logout() {
    'use server';
    await deleteSession();
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 md:flex-row">
      {/* Sidebar */}
      <aside className="w-full border-r bg-card md:w-64 md:flex-shrink-0">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/portal/dashboard" className="text-lg font-bold tracking-tight">
            AsiaNodes <span className="text-primary">Portal</span>
          </Link>
        </div>
        <div className="flex flex-col justify-between p-4" style={{ height: 'calc(100vh - 4rem)' }}>
          <nav className="space-y-2">
            <Link href="/portal/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/portal/services">
              <Button variant="ghost" className="w-full justify-start">
                <Server className="mr-2 h-4 w-4" />
                My Services
              </Button>
            </Link>
            <Link href="/portal/billing">
              <Button variant="ghost" className="w-full justify-start">
                <Receipt className="mr-2 h-4 w-4" />
                Billing
              </Button>
            </Link>
            <Link href="/portal/support">
              <Button variant="ghost" className="w-full justify-start">
                <LifeBuoy className="mr-2 h-4 w-4" />
                Support
              </Button>
            </Link>
          </nav>
          
          <div className="space-y-4">
            <div className="px-4 text-sm text-muted-foreground">
              Logged in as<br/>
              <span className="font-medium text-foreground">{session.email}</span>
            </div>
            <form action={logout}>
              <Button variant="outline" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
