'use client';

import { useState, useEffect } from 'react';
import { getServices, createSsoToken } from '../../actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, Server, ShieldAlert } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ServiceDetailsPage() {
  const params = useParams();
  const serviceId = parseInt(params.serviceId as string, 10);
  
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ssoLoading, setSsoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchService() {
      const { success, services, error } = await getServices();
      if (success) {
        const found = services.find((s: any) => s.id === serviceId);
        if (found) setService(found);
        else setError('Service not found.');
      } else {
        setError(error || 'Failed to load service.');
      }
      setLoading(false);
    }
    fetchService();
  }, [serviceId]);

  const handleSsoLogin = async () => {
    setSsoLoading(true);
    const { success, redirectUrl, error } = await createSsoToken(serviceId);
    if (success && redirectUrl) {
      // Open the control panel in a new tab securely
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert(error || 'Failed to generate SSO token. Please try again.');
    }
    setSsoLoading(false);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error || !service) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
        <p className="text-muted-foreground">Manage your instance and access the control panel.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{service.name}</CardTitle>
                <Badge variant={service.status === 'Active' ? 'default' : 'secondary'} className={service.status === 'Active' ? 'bg-green-500' : ''}>
                  {service.status}
                </Badge>
              </div>
              <CardDescription>{service.groupname}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Domain / Hostname</p>
                  <p className="font-medium">{service.domain || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dedicated IP</p>
                  <p className="font-medium">{service.dedicatedip || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Billing Cycle</p>
                  <p className="font-medium capitalize">{service.billingcycle}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Recurring Amount</p>
                  <p className="font-medium">${service.recurringamount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Due Date</p>
                  <p className="font-medium">{service.nextduedate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{service.paymentmethodname}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Control Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Access your server management panel directly without entering a password.
              </p>
              <Button onClick={handleSsoLogin} disabled={ssoLoading || service.status !== 'Active'} className="w-full">
                {ssoLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />}
                Login to Panel
              </Button>
              {service.status !== 'Active' && (
                <div className="flex items-center text-xs text-amber-600 dark:text-amber-400 mt-2">
                  <ShieldAlert className="mr-1 h-3 w-3" />
                  Service must be active to access the panel.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
