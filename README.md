
# SamudraSetu - An Integrated Intelligence Platform for INCOIS

## Abstract: SamudraSetu - An AI-Powered Intelligence Platform for Ocean Hazard Resilience

**Introduction:**
India's extensive coastline is highly vulnerable to a range of ocean-related hazards, including tsunamis, storm surges, and coastal flooding. The Indian National Centre for Ocean Information Services (INCOIS) provides critical early warnings using sophisticated scientific models. However, a significant gap exists between these official forecasts and the real-time, on-the-ground reality. This gap comprises two main challenges: a lack of immediate, verifiable field reports from affected citizens and the inability to harness the vast, unstructured data from public discussions on social media during a crisis. SamudraSetu is a web-based, AI-driven intelligence platform designed to bridge this critical information gap. It transforms the traditional one-way communication of alerts into a dynamic, two-way intelligence loop, empowering citizens and providing disaster management agencies with a comprehensive, real-time operational picture.

**Core Solution & Features:**
SamudraSetu directly addresses the INCOIS problem statement by integrating crowdsourcing with advanced AI analysis through a suite of tangible, working features:

1. **AI-Assisted Citizen Reporting:** The platform's core is the "Report a Hazard" feature, which allows users to submit geotagged reports of observed hazards. To streamline this process, the system employs an innovative AI workflow. Users can upload a photo or use their webcam to capture an image, which is then sent to a Google Gemini Vision model via a Genkit AI flow. The AI analyzes the image and automatically pre-fills the report form with the identified hazard type, severity level, and a detailed description, drastically reducing the time and effort required to submit a report while increasing data accuracy.

2. **Automated Authenticity Verification:** To ensure the credibility of crowdsourced data, every text-based report is automatically analyzed by a `verifyReportAuthenticity` AI flow. This system uses a specialized BERT (Bidirectional Encoder Representations from Transformers) model, fine-tuned on misinformation datasets, to calculate an "authenticity score." This score is transparently displayed to all users, helping them distinguish between credible alerts and potential misinformation.

3. **Social Media Intelligence:** The "Social Intelligence Dashboard" leverages a Natural Language Processing (NLP) engine to analyze trends from public social media feeds. This system identifies public sentiment, calculates an urgency score, and extracts key discussion topics and hashtags. By turning unstructured social chatter into actionable insights, it helps agencies understand the public's awareness, concerns, and the ground-level impact of a hazard event.

4. **Unified Interactive Dashboard:** The central hub of the platform is a live, interactive dashboard built on the Google Maps API. It visualizes all hazard reports and real-time data from integrated IoT sensors (like smart buoys) on a single map. With features like dynamic heatmaps and marker clustering, disaster managers can instantly identify hotspots, understand the scale of an event, and allocate resources more effectively.

## Technical Summary
- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, ShadCN UI.
- **AI Backend**: Google Genkit, Google Gemini (Multimodal), BERT (Authenticity Analysis).
- **Backend Services**: Firebase Authentication (OTP Login), Firestore (Scalable Database).
- **Maps**: Google Maps JS API (Heatmaps, Clustering).

## Deployment & Setup

### Setting up OTP Login (Phone Authentication)
1. Go to the **Firebase Console**.
2. Navigate to **Authentication** > **Sign-in method**.
3. Enable **Phone** authentication.
4. **Important**: Real SMS delivery requires the **Blaze (Pay-as-you-go) Plan**.
5. **For Testing**: You can add "Phone numbers for testing" in the Phone auth settings. These work for free even on the Spark plan. Use these numbers in the login form to bypass real SMS costs during development.

### Setting Secrets
Ensure the following secrets are added to your App Hosting backend in the Firebase Console:
- `GEMINI_API_KEY`: Your Google AI Studio API key.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps JavaScript API key.

## Getting Started Locally

1. Install dependencies: `npm install`
2. Start the web app: `npm run dev`
3. Start the AI server: `npm run genkit:dev` (in a separate terminal)
