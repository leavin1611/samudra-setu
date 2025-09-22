'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHazardReports } from '@/context/HazardReportsContext';

export function Stats() {
  const { reports } = useHazardReports();

  const totalReports = reports.length;
  const verifiedIncidents = reports.filter(report => report.verified).length;
  // Mock data for social mentions and new alerts as we don't have a live source
  const socialMentions = 283 + totalReports; 
  const newAlerts = 5 + Math.floor(totalReports / 5);

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
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Social Media Mentions</span>
            <span className="font-bold text-lg">{socialMentions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">New Alerts</span>
            <span className="font-bold text-lg">{newAlerts}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
