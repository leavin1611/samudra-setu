
'use client';

import { useState } from 'react';
import { useHazardReports } from '@/context/HazardReportsContext';
import { HazardReportCard } from '@/components/common/HazardReportCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const REPORTS_PER_PAGE = 12;

export default function DashboardPage() {
  const { reports, loading } = useHazardReports();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reports.length / REPORTS_PER_PAGE);
  const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
  const endIndex = startIndex + REPORTS_PER_PAGE;
  const currentReports = reports.slice(startIndex, endIndex);

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

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">All Hazard Reports</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A comprehensive list of all crowdsourced hazard reports.
        </p>
      </header>

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
