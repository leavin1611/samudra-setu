'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Filters } from './Filters';
import { MapWrapper } from './MapWrapper';
import { Stats } from './Stats';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useHazardReports } from '@/context/HazardReportsContext';

export type FiltersState = {
  hazardType: string;
  dateRange: string;
  location: string;
  severity: 'all' | 'low' | 'medium' | 'high' | 'extreme';
};

export function Dashboard() {
  const [filters, setFilters] = useState<FiltersState>({
    hazardType: 'all',
    dateRange: 'all',
    location: '',
    severity: 'all',
  });
  const { reports } = useHazardReports();

  return (
    <section id="dashboard" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
            Live Hazard Dashboard
            <span className="block w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Real-time monitoring of ocean hazards and community reports
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg">
              <CardContent className="p-0">
                <Filters filters={filters} setFilters={setFilters} />
                <div className="mt-6">
                  <Stats />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <MapWrapper reports={reports} />
          </div>
        </div>
         <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/dashboard">View Full Dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
