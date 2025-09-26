
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useHazardReports } from '@/context/HazardReportsContext';
import { verifyReportAuthenticity } from '@/ai/flows/verify-report-authenticity';
import { generateSafetyPrecautions, GenerateSafetyPrecautionsOutput } from '@/ai/flows/generate-safety-precautions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, ShieldCheck, Siren } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

export function HighPriorityAlert() {
  const { reports, loading: reportsLoading } = useHazardReports();
  const [highestAlert, setHighestAlert] = useState<any>(null);
  const [safetyAdvice, setSafetyAdvice] = useState<GenerateSafetyPrecautionsOutput | null>(null);
  const [loading, setLoading] = useState(true);

  const verifiedReports = useMemo(() => reports.filter(r => r.verified), [reports]);

  useEffect(() => {
    if (reportsLoading || verifiedReports.length === 0) {
      setLoading(reportsLoading);
      return;
    }

    async function findHighestAlert() {
      setLoading(true);
      let highestRatedReport = null;
      let maxScore = -1;

      for (const report of verifiedReports) {
        try {
          const authResult = await verifyReportAuthenticity({ text: report.description, isAuthenticated: report.verified });
          // We consider "high priority" if it's verified AND has an AI score over 0.75
          if (authResult.authenticityScore > 0.75 && authResult.authenticityScore > maxScore) {
            maxScore = authResult.authenticityScore;
            highestRatedReport = report;
          }
        } catch (e) {
          console.error("Error verifying authenticity for high priority alert:", e);
        }
      }

      if (highestRatedReport) {
        setHighestAlert(highestRatedReport);
        try {
            const advice = await generateSafetyPrecautions({ 
                hazardType: highestRatedReport.type, 
                severity: highestRatedReport.severity 
            });
            setSafetyAdvice(advice);
        } catch (e) {
            console.error("Error generating safety advice:", e);
            setSafetyAdvice(null); // Fallback if AI fails
        }
      } else {
        setHighestAlert(null);
        setSafetyAdvice(null);
      }
      setLoading(false);
    }

    findHighestAlert();
  }, [verifiedReports, reportsLoading]);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
            <Skeleton className="h-64 w-full" />
        </div>
      </section>
    );
  }

  if (!highestAlert) {
    return null; // Don't render anything if there are no high-priority alerts
  }

  return (
    <section className="py-12 md:py-16 bg-red-50 dark:bg-red-900/20">
      <div className="container mx-auto px-4">
        <Card className="border-2 border-destructive bg-white shadow-2xl overflow-hidden">
          <CardHeader className="bg-destructive text-destructive-foreground p-4">
            <CardTitle className="flex items-center gap-4 text-2xl">
              <Siren className="h-8 w-8 animate-pulse" />
              <span>High-Priority Public Safety Alert</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
                <h3 className="text-xl font-bold">Event Details</h3>
                 <p className="text-lg">
                    <span className="font-semibold">Location:</span> {highestAlert.location}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Hazard:</span> <span className="capitalize">{highestAlert.type}</span>
                </p>
                 <p className="text-lg">
                    <span className="font-semibold">Severity:</span> <Badge variant="destructive" className="text-lg">{highestAlert.severity.toUpperCase()}</Badge>
                </p>
                 <div className="flex items-center gap-2 pt-2">
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                    <span className="font-semibold text-green-700">Verified by AI & Disaster Management</span>
                </div>
            </div>
            <div className="md:col-span-2 space-y-4">
                {safetyAdvice ? (
                     <>
                        <p className="text-lg font-bold text-center bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                            {safetyAdvice.bulletin}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h4 className="flex items-center gap-2 text-lg font-bold text-green-700 mb-2"><CheckCircle /> DOs:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    {safetyAdvice.dos.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h4 className="flex items-center gap-2 text-lg font-bold text-red-700 mb-2"><AlertCircle /> DON'Ts:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                     {safetyAdvice.donts.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    </>
                ): (
                    <div className="flex items-center justify-center h-full">
                        <p>Generating safety recommendations...</p>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
