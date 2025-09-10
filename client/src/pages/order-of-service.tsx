import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderOfServiceCover } from "@/components/order-of-service-cover";
import { OrderOfServiceTimeline } from "@/components/order-of-service-timeline";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { DigitalOrderOfService, Memorial } from "@shared/schema";
import { 
  Download, 
  Share2, 
  Edit, 
  ArrowLeft, 
  Eye,
  Heart,
  Calendar,
  Users,
  Printer
} from "lucide-react";
import { useState, useEffect } from "react";
import { generatePrintableOrderOfService } from "@/lib/pdfUtils";

export default function OrderOfServicePage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

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

  // Increment view count
  const viewMutation = useMutation({
    mutationFn: () => apiRequest('PATCH', `/api/order-of-service/${id}/view`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/order-of-service', id] });
    }
  });

  // Increment download count (without triggering print)
  const downloadMutation = useMutation({
    mutationFn: () => apiRequest('PATCH', `/api/order-of-service/${id}/download`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/order-of-service', id] });
    }
  });

  // Track view on load
  useEffect(() => {
    if (id && !isLoading && orderOfService) {
      viewMutation.mutate();
    }
  }, [id, isLoading, orderOfService]);

  const handleShare = async () => {
    if (!orderOfService || !memorial) return;
    
    setIsSharing(true);
    const shareData = {
      title: `${orderOfService.title} - ${memorial.firstName} ${memorial.lastName}`,
      text: `Join us in celebrating the life of ${memorial.firstName} ${memorial.lastName}`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Order of Service link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Sharing failed",
        description: "Unable to share. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handlePrintDownload = async () => {
    if (!orderOfService || !memorial) {
      toast({
        title: "Error",
        description: "Order of Service data is not available",
        variant: "destructive"
      });
      return;
    }

    try {
      // 1. First, generate the enhanced printable version and wait for DOM preparation
      await generatePrintableOrderOfService(orderOfService, memorial);
      
      // 2. Update download count after layout is ready
      downloadMutation.mutate();
      
      // 3. Small delay to ensure print layout is fully applied
      setTimeout(() => {
        // 4. NOW trigger browser print dialog with prepared layout
        window.print();
        
        // 5. Show success toast after print dialog opens
        toast({
          title: "Print ready!",
          description: "Order of Service prepared for printing or saving as PDF",
        });
      }, 100);
      
    } catch (error) {
      console.error('Print error:', error);
      toast({
        title: "Print failed",
        description: "Unable to prepare the Order of Service for printing",
        variant: "destructive"
      });
    }
  };

  const canEdit = user && orderOfService && (
    orderOfService.createdBy === user.id || user.role === 'admin'
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 print:bg-white">
      {/* Header - Hidden when printing */}
      <div className="print:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => memorial ? setLocation(`/memorial/${memorial.id}`) : setLocation('/browse')}
                data-testid="back-button"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Memorial
              </Button>
              
              <div className="hidden md:flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{orderOfService.viewCount || 0} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>{orderOfService.downloadCount || 0} downloads</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                disabled={isSharing}
                data-testid="share-button"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintDownload}
                disabled={downloadMutation.isPending}
                data-testid="download-print-button"
              >
                <Printer className="h-4 w-4 mr-2" />
                {downloadMutation.isPending ? 'Preparing...' : 'Print/PDF'}
              </Button>

              {canEdit && (
                <Button
                  size="sm"
                  onClick={() => setLocation(`/order-of-service/${id}/edit`)}
                  data-testid="edit-button"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Order of Service Cover */}
        <OrderOfServiceCover
          orderOfService={orderOfService}
          memorial={{
            firstName: memorial.firstName,
            lastName: memorial.lastName,
            dateOfBirth: memorial.dateOfBirth.toISOString(),
            dateOfPassing: memorial.dateOfPassing.toISOString(),
            profilePhotoUrl: memorial.profilePhotoUrl || undefined,
            memorialMessage: memorial.memorialMessage || undefined
          }}
          theme={orderOfService.theme as 'classic' | 'modern' | 'elegant'}
        />

        {/* Service Timeline */}
        {orderOfService.events && orderOfService.events.length > 0 ? (
          <OrderOfServiceTimeline
            events={orderOfService.events}
            theme={orderOfService.theme as 'classic' | 'modern' | 'elegant'}
          />
        ) : (
          <Card className="p-8 text-center bg-slate-50 dark:bg-slate-800/50">
            <Users className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No Events Listed
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              This Order of Service doesn't have any events scheduled yet.
            </p>
            {canEdit && (
              <Button
                className="mt-4"
                onClick={() => setLocation(`/order-of-service/${id}/edit`)}
              >
                Add Events
              </Button>
            )}
          </Card>
        )}

        {/* Footer Information - Hidden when printing */}
        <div className="print:hidden text-center py-8 border-t border-slate-200 dark:border-slate-700">
          <div className="space-y-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Created with love on SoulBridge
            </p>
            <div className="flex justify-center items-center space-x-4 text-xs text-slate-400">
              <span>Privacy: {orderOfService.privacy === 'public' ? 'Public' : 'Private'}</span>
              <span>•</span>
              <span>Created: {orderOfService.createdAt ? new Date(orderOfService.createdAt).toLocaleDateString() : 'Unknown'}</span>
              {orderOfService.updatedAt && orderOfService.updatedAt !== orderOfService.createdAt && (
                <>
                  <span>•</span>
                  <span>Updated: {new Date(orderOfService.updatedAt).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}