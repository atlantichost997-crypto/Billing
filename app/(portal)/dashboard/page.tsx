import { getSession } from '@/lib/session';
import { getInvoices, getServices, getTickets } from '../actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Server, Receipt, LifeBuoy } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  
  // Fetch data in parallel
  const [invoicesRes, servicesRes, ticketsRes] = await Promise.all([
    getInvoices('Unpaid'),
    getServices(),
    getTickets()
  ]);

  const unpaidInvoices = invoicesRes.success ? invoicesRes.invoices : [];
  const activeServices = servicesRes.success ? servicesRes.services.filter(s => s.status === 'Active') : [];
  const openTickets = ticketsRes.success ? ticketsRes.tickets.filter(t => t.status !== 'Closed') : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session?.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServices.length}</div>
            <p className="text-xs text-muted-foreground">Nodes currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unpaidInvoices.length}</div>
            <p className="text-xs text-muted-foreground">Require your attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <LifeBuoy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting support response</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Services</CardTitle>
            <CardDescription>Your latest deployed infrastructure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeServices.slice(0, 5).map(service => (
              <div key={service.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-muted-foreground">{service.domain}</p>
                </div>
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
              </div>
            ))}
            {activeServices.length === 0 && (
              <p className="text-sm text-muted-foreground">No active services found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unpaid Invoices</CardTitle>
            <CardDescription>Invoices that need to be paid.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {unpaidInvoices.slice(0, 5).map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">Invoice #{invoice.invoicenum}</p>
                  <p className="text-sm text-muted-foreground">Due: {invoice.duedate}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${invoice.balance}</p>
                  <Badge variant="destructive">Unpaid</Badge>
                </div>
              </div>
            ))}
            {unpaidInvoices.length === 0 && (
              <p className="text-sm text-muted-foreground">You have no unpaid invoices.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
