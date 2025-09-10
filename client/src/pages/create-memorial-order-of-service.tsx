import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { OrderOfServiceForm } from "@/components/order-of-service-form";
import { useAuth } from "@/hooks/useAuth";
import type { Memorial } from "@shared/schema";
import { ArrowLeft } from "lucide-react";

export default function CreateMemorialOrderOfServicePage() {
  const { memorialId } = useParams<{ memorialId: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Fetch memorial data
  const { data: memorial, isLoading, error } = useQuery<Memorial>({
    queryKey: ['/api/memorials', memorialId],
    enabled: !!memorialId
  });

  // Check permissions
  const canCreate = user && memorial && (
    memorial.submittedBy === user.id || user.role === 'admin'
  );

  const handleSave = (orderOfService: any) => {
    // Navigate to the newly created Order of Service
    setLocation(`/order-of-service/${orderOfService.id}`);
  };

  const handleCancel = () => {
    if (memorial) {
      setLocation(`/memorial/${memorial.id}`);
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

  if (error || !memorial) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Memorial Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            This memorial may not exist or may have been removed.
          </p>
          <Button onClick={() => setLocation('/browse')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </Card>
      </div>
    );
  }

  if (!canCreate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Permission Denied
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            You can only create Order of Service for memorials you created.
          </p>
          <Button onClick={() => setLocation(`/memorial/${memorial.id}`)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Memorial
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCancel}
            data-testid="back-to-memorial-button"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Memorial
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Create Order of Service
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Create a beautiful Order of Service for {memorial.firstName} {memorial.lastName}
            </p>
          </div>
        </div>

        {/* Order of Service Form */}
        <Card className="p-6">
          <OrderOfServiceForm
            memorial={memorial}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </Card>
      </div>
    </div>
  );
}