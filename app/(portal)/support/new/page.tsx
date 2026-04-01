'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function NewTicketPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const deptid = formData.get('deptid') as string;
    const priority = formData.get('priority') as string;

    try {
      // Note: In a real app, this should be a Server Action to keep WHMCS calls strictly server-side.
      // For brevity in this module, we are simulating the call structure.
      // A proper implementation would pass this to a server action in actions.ts.
      const res = await fetch('/api/whmcs/ticket', {
        method: 'POST',
        body: JSON.stringify({ action: 'OpenTicket', subject, message, deptid, priority }),
      });
      
      if (!res.ok) throw new Error('Failed to create ticket');
      
      router.push('/portal/support');
      router.refresh();
    } catch (err) {
      setError('An error occurred while creating the ticket. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Open Ticket</h1>
        <p className="text-muted-foreground">Submit a new support request.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>Please provide as much detail as possible so we can best assist you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deptid">Department</Label>
                <select id="deptid" name="deptid" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                  <option value="1">General Support</option>
                  <option value="2">Billing</option>
                  <option value="3">Technical Support</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select id="priority" name="priority" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" required disabled={isSubmitting} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={6} required disabled={isSubmitting} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Ticket
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
