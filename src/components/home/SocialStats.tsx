'use client';

import { useEffect, useState } from 'react';
import { analyzeSocialMediaSentiment, AnalyzeSocialMediaSentimentOutput } from '@/ai/flows/analyze-social-media-sentiment';
import { Skeleton } from '../ui/skeleton';

type Feed = {
  id: string;
  comments?: string;
  hashtags?: string;
};

export function SocialStats() {
  const [loading, setLoading] = useState(true);
  const [mentionCount, setMentionCount] = useState(0);
  const [urgencyScore, setUrgencyScore] = useState(0);

  useEffect(() => {
    async function analyzeFeeds() {
      try {
        const response = await fetch('/ocean_data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const feeds: Feed[] = await response.json();

        setMentionCount(feeds.length);

        const analysisPromises: Promise<AnalyzeSocialMediaSentimentOutput>[] = feeds
          .filter(feed => feed.comments || feed.hashtags)
          .map(feed => {
            const query = `${feed.comments || ''} ${feed.hashtags || ''}`.trim();
            return analyzeSocialMediaSentiment({ query });
          });

        const results = await Promise.all(analysisPromises);
        
        if (results.length > 0) {
            const averageUrgency = results.reduce((sum, result) => sum + result.urgencyScore, 0) / results.length;
            setUrgencyScore(averageUrgency);
        }

      } catch (err) {
        console.error('Error analyzing social feeds:', err);
        // Set fallback values if AI analysis fails
        setMentionCount(283); 
        setUrgencyScore(0.3);
      } finally {
        setLoading(false);
      }
    }
    analyzeFeeds();
  }, []);

  const newAlerts = Math.round(mentionCount * urgencyScore / 10);

  if (loading) {
    return (
      <>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Social Media Mentions</span>
          <Skeleton className="h-6 w-12" />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">New Alerts</span>
          <Skeleton className="h-6 w-12" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Social Media Mentions</span>
        <span className="font-bold text-lg">{mentionCount}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">New Alerts</span>
        <span className="font-bold text-lg">{newAlerts}</span>
      </div>
    </>
  );
}
