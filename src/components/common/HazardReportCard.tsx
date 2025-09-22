'use client';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { HazardReport } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Clock, User, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { verifyReportAuthenticity } from '@/ai/flows/verify-report-authenticity';
import { Skeleton } from '../ui/skeleton';

type HazardReportCardProps = {
  report: HazardReport;
};

export function HazardReportCard({ report }: HazardReportCardProps) {
  const [authenticityScore, setAuthenticityScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAuthenticity() {
      try {
        const result = await verifyReportAuthenticity({ text: report.description });
        setAuthenticityScore(result.authenticityScore);
      } catch (e) {
        console.error("Failed to verify authenticity:", e);
        setAuthenticityScore(0.5); // Fallback score
      } finally {
        setLoading(false);
      }
    }
    getAuthenticity();
  }, [report.description]);

  const getAuthenticityColor = () => {
    if (authenticityScore === null) return 'bg-gray-400';
    if (authenticityScore > 0.75) return 'bg-green-500';
    if (authenticityScore > 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image
          src={report.imageUrl}
          alt={report.title}
          fill
          className="object-cover"
          data-ai-hint={report.imageHint}
        />
      </div>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2">{report.title}</CardTitle>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{report.user}</span>
            </div>
            <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{report.timeAgo}</span>
            </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 h-10 overflow-hidden">
          {report.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            {report.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
            <Badge
              variant={report.verified ? 'default' : 'destructive'}
              className={cn(report.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}
            >
              {report.verified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
          {loading ? (
             <Skeleton className="h-6 w-24" />
          ) : (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-semibold">
                    <ShieldCheck className={cn("h-4 w-4", getAuthenticityColor().replace('bg-', 'text-'))} />
                    <span>Authenticity</span>
                </div>
                <div className="relative w-16 h-2 bg-gray-200 rounded-full">
                    <div className={cn("absolute top-0 left-0 h-2 rounded-full", getAuthenticityColor())} style={{ width: `${(authenticityScore ?? 0) * 100}%` }}></div>
                </div>
            </div>
          )}
        </div>
        
        <Button variant="outline" className="w-full">View Details</Button>
      </CardContent>
    </Card>
  );
}
