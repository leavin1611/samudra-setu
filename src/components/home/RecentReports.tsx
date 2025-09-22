
'use client';

import { HazardReportCard } from '../common/HazardReportCard';
import { useHazardReports } from '@/context/HazardReportsContext';
import { Skeleton } from '../ui/skeleton';

export function RecentReports() {
  const { reports, loading } = useHazardReports();
  
  if (loading) {
    return (
      <section id="posts" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
              Recent Ocean Hazard Reports
              <span className="block w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Community-submitted hazard alerts from coastal areas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="posts" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
            Recent Ocean Hazard Reports
            <span className="block w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Community-submitted hazard alerts from coastal areas
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reports.slice(0, 8).map((report) => (
            <HazardReportCard key={report.id} report={report} />
          ))}
        </div>
      </div>
    </section>
  );
}
