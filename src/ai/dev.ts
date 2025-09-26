import { config } from 'dotenv';
config();

import '@/ai/flows/generate-hazard-hotspots.ts';
import '@/ai/flows/analyze-social-media-sentiment.ts';
import '@/ai/flows/verify-report-authenticity.ts';
import '@/ai/flows/analyze-report-image.ts';
import '@/ai/flows/analyze-social-media-trends.ts';
import '@/ai/flows/generate-safety-precautions.ts';
