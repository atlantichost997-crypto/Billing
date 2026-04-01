import { getServices } from '../actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Server } from 'lucide-react';

export default async function ServicesPage() {
  const { success, services, error } = await getServices();

  if (!success) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Services</h1>
        <p className="text-muted-foreground">Manage your cloud infrastructure and game servers.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 ? (
          <div className="col-span-full p-8 text-center text-muted-foreground">
            You don&apos;t have any active services.
            <div className="mt-4">
              <Link href="/store">
                <Button>Browse Store</Button>
              </Link>
            </div>
          </div>
        ) : (
          services.map(service => (
            <Card key={service.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <Badge variant={service.status === 'Active' ? 'default' : 'secondary'} className={service.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                    {service.status}
                  </Badge>
                </div>
                <CardDescription>{service.domain || 'No domain assigned'}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Server className="h-4 w-4" />
                  <span>{service.groupname}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Recurring: </span>
                  <span className="font-medium">${service.recurringamount} / {service.billingcycle}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Next Due: </span>
                  <span className="font-medium">{service.nextduedate}</span>
                </div>
                <div className="pt-4">
                  <Link href={`/portal/services/${service.id}`} className="w-full">
                    <Button className="w-full" variant="outline">Manage Service</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
