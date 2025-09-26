
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { HazardReportCard } from '@/components/common/HazardReportCard';
import { FeedCard } from '@/components/common/FeedCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useHazardReports } from '@/context/HazardReportsContext';
import type { HazardReport } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Rss } from 'lucide-react';

type Feed = {
  id: number;
  user_handle: string;
  hazard_type: string;
  location_name: string;
  comments: string;
  likes: number;
  hashtags: string;
  image_url: string;
  authenticated: boolean;
};

type CombinedItem = (
    | { type: 'report'; data: HazardReport }
    | { type: 'feed'; data: Feed }
) & { date: Date };


export default function AlertsPage() {
    const { reports, loading: reportsLoading } = useHazardReports();
    const [feeds, setFeeds] = useState<Feed[]>([]);
    const [feedsLoading, setFeedsLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const fetchAndSetFeeds = useCallback(async () => {
        try {
            const response = await fetch('/ocean_data.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setFeeds(data);
        } catch (err) {
            console.error('Error loading feeds:', err);
        } finally {
            setFeedsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAndSetFeeds();
    }, [fetchAndSetFeeds]);
    
    const handleViewDetails = () => {
        setIsPaused(true);
        const checkDialog = setInterval(() => {
            const dialogs = document.querySelectorAll('[role="dialog"]');
            let oneOpen = false;
            dialogs.forEach(d => {
                if(d.hasAttribute('data-state') && d.getAttribute('data-state') === 'open') {
                    oneOpen = true;
                }
            })
            if (!oneOpen) {
                setIsPaused(false);
                clearInterval(checkDialog);
            }
        }, 500);
    };

    const combinedFeed = useMemo(() => {
        const reportItems: CombinedItem[] = reports.map(r => ({ type: 'report', data: r, date: new Date(r.date) }));
        const feedItems: CombinedItem[] = feeds.map(f => ({ type: 'feed', data: f, date: new Date() })); // Feeds don't have a date, so use current
        
        return [...reportItems, ...feedItems].sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [reports, feeds]);

    const loading = reportsLoading || feedsLoading;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <header className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-primary">Alerts Feed</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                A live feed of all crowdsourced reports and social media mentions.
                </p>
            </header>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mx-auto max-w-md">
                    <TabsTrigger value="all"><List className="mr-2 h-4 w-4"/> All</TabsTrigger>
                    <TabsTrigger value="reports"><List className="mr-2 h-4 w-4"/> Official Reports</TabsTrigger>
                    <TabsTrigger value="feeds"><Rss className="mr-2 h-4 w-4" /> Social Feeds</TabsTrigger>
                </TabsList>

                <div className="mt-8">
                    {loading ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 12 }).map((_, i) => (
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
                        <TabsContent value="all">
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {combinedFeed.map((item, index) => (
                                    item.type === 'report' 
                                        ? <HazardReportCard key={`report-${item.data.id}-${index}`} report={item.data} onViewDetails={handleViewDetails} />
                                        : <FeedCard key={`feed-${item.data.id}-${index}`} feed={item.data} onViewDetails={handleViewDetails} />
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="reports">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {reports.map((report) => <HazardReportCard key={report.id} report={report} onViewDetails={handleViewDetails} />)}
                            </div>
                        </TabsContent>
                        <TabsContent value="feeds">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {feeds.map((feed) => <FeedCard key={feed.id} feed={feed} onViewDetails={handleViewDetails} />)}
                            </div>
                        </TabsContent>
                        </>
                    )}
                </div>
            </Tabs>
        </div>
    );
}
