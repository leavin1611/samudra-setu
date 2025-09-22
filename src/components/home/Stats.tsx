'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHazardReports } from '@/context/HazardReportsContext';
import { SocialStats } from './SocialStats';

export function Stats() {
  const { reports } = useHazardReports();

  const totalReports = reports.length;
  const verifiedIncidents = reports.filter(report => report.verified).length;
  
  return (
    <Card className="bg-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle>Today's Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Reports</span>
            <span className="font-bold text-lg">{totalReports}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Verified Incidents</span>
            <span className="font-bold text-lg">{verifiedIncidents}</span>
          </div>
          <SocialStats />
        </div>
      </CardContent>
    </Card>
  );
}
