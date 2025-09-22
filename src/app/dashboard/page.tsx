
'use client';

import { useState } from 'react';
import { useHazardReports } from '@/context/HazardReportsContext';
import { HazardReportCard } from '@/components/common/HazardReportCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, LocateFixed, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HazardReport } from '@/lib/data';

const REPORTS_PER_PAGE = 12;

// Haversine formula to calculate distance between two lat/lng points
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export default function DashboardPage() {
  const { reports, loading } = useHazardReports();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedReports, setSortedReports] = useState<HazardReport[] | null>(null);
  const [isSorting, setIsSorting] = useState(false);
  const { toast } = useToast();

  const activeReports = sortedReports || reports;

  const totalPages = Math.ceil(activeReports.length / REPORTS_PER_PAGE);
  const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
  const endIndex = startIndex + REPORTS_PER_PAGE;
  const currentReports = activeReports.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSortByProximity = () => {
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support geolocation.',
      });
      return;
    }

    setIsSorting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const reportsWithDistance = reports.map(report => ({
          ...report,
          distance: getDistance(latitude, longitude, report.lat, report.lng),
        }));
        
        reportsWithDistance.sort((a, b) => a.distance - b.distance);
        
        setSortedReports(reportsWithDistance);
        setCurrentPage(1); // Reset to first page
        setIsSorting(false);
        toast({
          title: 'Reports Sorted by Proximity',
          description: 'Showing hazards closest to you first.',
        });
      },
      (error) => {
        setIsSorting(false);
        toast({
          variant: 'destructive',
          title: 'Location Access Denied',
          description: 'Please enable location permissions to use this feature.',
        });
      }
    );
  };
  
  const handleClearSort = () => {
      setSortedReports(null);
      setCurrentPage(1);
      toast({
          title: 'Sort Cleared',
          description: 'Showing reports in default order.',
      });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">All Hazard Reports</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A comprehensive list of all crowdsourced hazard reports.
        </p>
      </header>
      
      <div className="flex justify-center gap-4 mb-8">
        <Button onClick={handleSortByProximity} disabled={isSorting}>
            <LocateFixed className="mr-2 h-4 w-4" />
            {isSorting ? 'Sorting...' : 'Sort by Proximity'}
        </Button>
        {sortedReports && (
            <Button onClick={handleClearSort} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Clear Sort
            </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: REPORTS_PER_PAGE }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentReports.map((report) => (
              <HazardReportCard key={report.id} report={report} />
            ))}
          </div>

          <div className="flex items-center justify-center mt-12 space-x-4">
            <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="outline">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
