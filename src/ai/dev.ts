import { config } from 'dotenv';
config();

import '@/ai/flows/generate-hazard-hotspots.ts';
import '@/ai/flows/analyze-social-media-sentiment.ts';
import '@/ai/flows/verify-report-authenticity.ts';
