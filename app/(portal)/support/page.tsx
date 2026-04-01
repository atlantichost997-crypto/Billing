import { getTickets } from '../actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function SupportPage() {
  const { success, tickets, error } = await getTickets();

  if (!success) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground">Get help with your services.</p>
        </div>
        <Link href="/portal/support/new">
          <Button>Open New Ticket</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
          <CardDescription>Your communication history with our support team.</CardDescription>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You have no support tickets.</p>
              <Link href="/portal/support/new">
                <Button variant="outline">Create a Ticket</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Link key={ticket.id} href={`/portal/support/${ticket.id}`} className="block">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="space-y-1 mb-2 sm:mb-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-primary">#{ticket.tid}</span>
                        <h3 className="font-semibold">{ticket.subject}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Department: {ticket.deptname} • Last Updated: {ticket.lastreply}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{ticket.priority} Priority</Badge>
                      <Badge variant={ticket.status === 'Closed' ? 'secondary' : ticket.status === 'Customer-Reply' ? 'destructive' : 'default'}
                        className={ticket.status === 'Open' ? 'bg-green-500' : ''}>
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
