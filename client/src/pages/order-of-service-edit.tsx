import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { OrderOfServiceForm } from "@/components/order-of-service-form";
import { useAuth } from "@/hooks/useAuth";
import type { DigitalOrderOfService, Memorial } from "@shared/schema";
import { ArrowLeft } from "lucide-react";

export default function OrderOfServiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Fetch Order of Service data
  const { data: orderOfService, isLoading, error } = useQuery<DigitalOrderOfService & { events?: any[] }>({
    queryKey: ['/api/order-of-service', id],
    enabled: !!id
  });

  // Fetch related memorial data
  const { data: memorial } = useQuery<Memorial>({
    queryKey: ['/api/memorials', orderOfService?.memorialId],
    enabled: !!orderOfService?.memorialId
  });

  // Check permissions
  const canEdit = user && orderOfService && (
    orderOfService.createdBy === user.id || user.role === 'admin'
  );

  const handleSave = (updatedOrderOfService: DigitalOrderOfService) => {
    setLocation(`/order-of-service/${updatedOrderOfService.id}`);
  };

  const handleCancel = () => {
    if (orderOfService) {
      setLocation(`/order-of-service/${orderOfService.id}`);
    } else {
      setLocation('/browse');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-96 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !orderOfService) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Order of Service Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            This Order of Service may not exist or may have been removed.
          </p>
          <Button onClick={() => setLocation('/browse')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </Card>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            You don't have permission to edit this Order of Service.
          </p>
          <Button onClick={() => setLocation(`/order-of-service/${orderOfService.id}`)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to View
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="container mx-auto px-4">
        <OrderOfServiceForm
          memorial={{
            id: memorial.id,
            firstName: memorial.firstName,
            lastName: memorial.lastName
          }}
          initialData={orderOfService}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}