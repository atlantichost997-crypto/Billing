import { getInvoices } from '../actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default async function BillingPage() {
  const { success, invoices, error } = await getInvoices();

  if (!success) {
    return <div className="text-red-500">{error}</div>;
  }

  const whmcsUrl = process.env.NEXT_PUBLIC_WHMCS_URL || 'https://billing.asianodes.com';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing History</h1>
        <p className="text-muted-foreground">View and pay your invoices.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>A complete history of your billing statements.</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No invoices found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Invoice #</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-tr-lg text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-4 font-medium">{invoice.invoicenum}</td>
                      <td className="px-4 py-4">{invoice.date}</td>
                      <td className="px-4 py-4">{invoice.duedate}</td>
                      <td className="px-4 py-4 font-bold">${invoice.total}</td>
                      <td className="px-4 py-4">
                        <Badge variant={invoice.status === 'Paid' ? 'default' : invoice.status === 'Unpaid' ? 'destructive' : 'secondary'}
                          className={invoice.status === 'Paid' ? 'bg-green-500 hover:bg-green-600' : ''}>
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <a href={`${whmcsUrl}/viewinvoice.php?id=${invoice.id}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            {invoice.status === 'Unpaid' ? 'Pay Now' : 'View'}
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </Button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
