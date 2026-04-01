import { getTicket } from '../../actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { ArrowLeft, User, ShieldCheck } from 'lucide-react';

export default async function TicketDetailsPage({ params }: { params: { ticketId: string } }) {
  const ticketId = parseInt(params.ticketId, 10);
  const { success, ticket, error } = await getTicket(ticketId);

  if (!success || !ticket) {
    return <div className="text-red-500 p-8">{error || 'Ticket not found.'}</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/portal/support">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">#{ticket.tid} - {ticket.subject}</h1>
          <p className="text-muted-foreground">Created on {ticket.date}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge variant="outline">{ticket.priority} Priority</Badge>
          <Badge variant={ticket.status === 'Closed' ? 'secondary' : 'default'}>{ticket.status}</Badge>
        </div>
      </div>

      <div className="space-y-6">
        {/* Original Ticket Message */}
        <Card>
          <CardHeader className="bg-muted/30 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{ticket.name}</CardTitle>
                <CardDescription>{ticket.date}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="whitespace-pre-wrap text-sm">{ticket.subject} (Original Message Content would be here depending on WHMCS API response structure)</div>
          </CardContent>
        </Card>

        {/* Replies */}
        {ticket.replies?.reply?.map((reply, index) => (
          <Card key={index} className={reply.admin ? 'border-primary/50' : ''}>
            <CardHeader className={`border-b pb-4 ${reply.admin ? 'bg-primary/5' : 'bg-muted/30'}`}>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${reply.admin ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                  {reply.admin ? <ShieldCheck className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {reply.name}
                    {reply.admin && <Badge variant="default" className="text-[10px] h-5 px-1.5">Staff</Badge>}
                  </CardTitle>
                  <CardDescription>{reply.date}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="whitespace-pre-wrap text-sm">{reply.message}</div>
            </CardContent>
          </Card>
        ))}

        {/* Reply Form */}
        {ticket.status !== 'Closed' && (
          <Card>
            <CardHeader>
              <CardTitle>Add Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Textarea placeholder="Type your reply here..." rows={5} required />
                <Button type="submit">Send Reply</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
