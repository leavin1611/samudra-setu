# SamudraSetu - Crowdsourced Ocean Hazard Reporting

This is a Next.js project created in Firebase Studio. It's a comprehensive platform for crowdsourcing, visualizing, and analyzing ocean hazard information to protect coastal communities.

## The INCOIS Problem Statement

The Indian National Centre for Ocean Information Services (INCOIS) provides essential early warnings for ocean hazards but faces a critical gap: a lack of real-time, on-the-ground field reports from citizens. Furthermore, valuable insights from public discussions on social media during these events remain largely untapped. This creates a need for a unified platform to bridge this information gap, aggregate data, and provide a comprehensive operational picture for disaster management.

## SamudraSetu: System Architecture & Technical Deep Dive

### 1. Core Mission & The INCOIS Problem Statement

SamudraSetu is an AI-driven intelligence platform designed to address a critical gap for the Indian National Centre for Ocean Information Services (INCOIS). The core problems it solves are:

*   **Lack of Real-time Field Reporting:** INCOIS has sophisticated warning systems but lacks on-the-ground data from citizens to verify and complement its models.
*   **Untapped Social Media Insights:** Public discussions on social media during hazard events are a rich but unstructured source of information that is largely unused.
*   **Fragmented Information:** Data is scattered, leading to a delayed and incomplete operational picture for disaster managers.

SamudraSetu solves this by creating a unified, real-time **intelligence loop** that integrates crowdsourced data with AI analysis.

### 2. Technology Stack

*   **Frontend Framework:** **Next.js with React** (App Router). This provides server-side rendering for fast initial loads and a modern, component-based architecture.
*   **Language:** **TypeScript**. Used across the entire project for type safety, better developer tooling, and more maintainable code.
*   **UI Components:** **ShadCN UI**. A collection of beautifully designed, accessible, and composable components built on Radix UI and Tailwind CSS.
*   **Styling:** **Tailwind CSS** with a custom theme defined in `globals.css` using HSL CSS variables for easy theming (Primary: `#4A90E2`, Accent: `#77D8D8`, etc.).
*   **AI Backend & Orchestration:** **Google Genkit**. All AI-powered features are implemented as Genkit "flows." This provides a structured way to define and run chains of AI prompts, model calls, and business logic. It runs as a separate server that the Next.js frontend communicates with.
*   **Authentication & Database:** **Google Firebase**.
    *   **Firebase Authentication:** Used for secure, OTP-based phone number login, including reCAPTCHA verification.
    *   **Firestore:** While not fully integrated for backend storage yet, the data structures are designed for it. It's intended to be the primary database for storing user data, reports, and needs requests.
*   **Mapping:** **Google Maps API**. Used for the interactive dashboard, providing features like custom markers, heatmaps, and marker clustering.
*   **State Management:** **React Context API**. Used to manage global application state for hazard reports (`HazardReportsContext`) and assistance requests (`NeedsContext`), making data available across all components in real-time.

### 3. Key Features & How They Work (The Intelligence Loop)

**Stage 1: Report (AI-Assisted Crowdsourcing)**

This is the primary data-gathering stage, designed to be as frictionless as possible.

*   **Feature:** **Report a Hazard Page (`/report`)**
    *   **Functionality:** Allows any authenticated user to submit a report. It includes two innovative methods for data entry:
        1.  **Geo-tagged Image Upload:** The user can upload a photo from their device. The system uses the **`exif-js` library** to read the photo's metadata. **Crucially, if the image does not contain GPS coordinates (geo-tag), it is rejected**, ensuring all reports are location-specific.
        2.  **Live Webcam Capture:** The user can grant camera and location permissions. The form displays a live video feed. When the user clicks "Capture Photo," it takes a snapshot, automatically records the **current date and time**, and captures their precise **geolocation** using the browser's Geolocation API.
    *   **AI Integration (`analyzeReportImage` flow):** Once an image is captured or uploaded, it's converted to a Base64 Data URI and sent to the `analyzeReportImage` Genkit flow. This flow uses the **Google Gemini Pro Vision model** to analyze the image content. The model returns a structured JSON object with the `hazardType`, `severity`, and a detailed `description`, which automatically pre-fills the form for the user.

*   **Feature:** **Request Assistance Page (`/needs`)**
    *   **Functionality:** A separate form for users in an affected area to request specific aid (e.g., Water, Food, Medical, Shelter). It also includes the **webcam and geolocation capture** feature to help responders pinpoint and verify the need.

**Stage 2: Analyze (AI-Powered Verification & Insight)**

This stage processes and enriches the raw data.

*   **Algorithm:** **Authenticity Scoring (`verifyReportAuthenticity` flow)**
    *   **Functionality:** The text description from every hazard report is sent to this Genkit flow. It uses a pre-trained **BERT (Bidirectional Encoder Representations from Transformers) model**, specifically `xenova/bert-base-cased-fakeddit`, which has been fine-tuned to detect patterns of misinformation and fake news.
    *   **Output:** The flow returns an `authenticityScore` between 0 and 1, providing a probabilistic measure of the report's credibility. This is displayed in the "Authenticity Analysis" dialog.

*   **Algorithm:** **Social Media Trend Analysis (`analyzeSocialMediaTrends` flow)**
    *   **Functionality:** The Social Intelligence Dashboard (`/social-intelligence`) fetches mock social media data from `ocean_data.json` and feeds it into this Genkit flow.
    *   **AI Model:** It uses a powerful LLM (like **Gemini**) to perform several tasks in one go:
        *   **Sentiment Analysis:** Classifies posts as positive, negative, or neutral.
        *   **Urgency Scoring:** Calculates an "urgency score" based on keywords and sentiment.
        *   **Topic Extraction:** Identifies key topics and hashtags being discussed.
        *   **Influence Ranking:** Identifies the most impactful posts based on engagement (likes).

**Stage 3: Visualize (A Unified Operational Picture)**

This stage presents the processed data in an easy-to-understand format.

*   **Feature:** **Live Hazard Dashboard (`/dashboard` and homepage)**
    *   **Functionality:** An interactive dashboard centered around a **Google Map**. It plots all verified and unverified hazard reports. Users can switch between three views:
        1.  **Default View:** Standard pins for each report.
        2.  **Heatmap View:** Shows the density of reports, making it easy to spot clusters.
        3.  **Cluster View:** Groups nearby pins into a single numbered icon for better readability in dense areas, using the **`@googlemaps/markerclusterer`** library.
    *   **Components:** Includes filter controls (by hazard type, date, etc.) and a live stats panel.

*   **Feature:** **Alerts Feed (`/alerts`)**
    *   **Functionality:** A dedicated page that combines both official hazard reports and social media posts into a single, reverse-chronological feed, offering a complete, unfiltered view of all incoming information.

**Stage 4: Alert (Actionable Intelligence for Response)**

This is the final, crucial step where intelligence drives action.

*   **Feature:** **High-Priority Alert Section (Homepage)**
    *   **Algorithm:** This component has a specific activation logic. It scans all hazard reports and finds one that meets two strict criteria:
        1.  It is **manually verified** (`verified: true`), implying a disaster manager has confirmed it.
        2.  Its text content achieves a high **AI authenticity score** (e.g., > 0.75).
    *   **AI Integration (`generateSafetyPrecautions` flow):** Once such an alert is identified, its `hazardType` and `severity` are sent to this new Genkit flow. This flow uses **Gemini** to generate a practical, easy-to-understand list of **"Do's and Don'ts"** and a concise public safety bulletin.
    *   **Display:** The resulting alert—containing the location, hazard type, and clear safety instructions—is prominently displayed at the top of the homepage, ensuring it's the first thing visitors see.

### 4. Future Vision: IoT Integration

To further enhance its proactive capabilities, SamudraSetu is designed for future integration with a network of coastal **Internet of Things (IoT) sensors**.

*   **Concept:** Low-cost devices like **water level sensors**, **weather stations**, and **buoys** could be deployed along the coastline. These devices would transmit real-time data (e.g., tide height, wind speed, wave patterns) to a cloud backend.
*   **Workflow:**
    1.  IoT devices send data to a cloud endpoint (e.g., Google Cloud IoT Core).
    2.  A backend service (e.g., a Firebase Function) processes this data, formats it like a standard hazard report, and saves it to Firestore.
    3.  The data appears on the SamudraSetu dashboard with a unique icon to distinguish it from citizen reports.
*   **Benefit:** This creates a fully automated, 24/7 monitoring system. The platform can then trigger alerts based on sensor thresholds (e.g., multiple sensors reporting a rapid water level rise), enabling even earlier warnings and a more comprehensive view of coastal conditions.


## Getting Started Locally

To run this project on your local machine using Visual Studio Code, follow these steps.

### 1. Prerequisites

Make sure you have **Node.js** (which includes **npm**) installed on your computer. You can download it from [nodejs.org](https://nodejs.org/).

### 2. Unzip and Open Project

1.  Unzip the downloaded project folder.
2.  Open Visual Studio Code, then go to `File > Open Folder...` and select the unzipped project folder.

### 3. Set Up Environment File

The project requires an API key for Google Maps.

1.  In the root of the project, find the `.env` file.
2.  Ensure it contains your Google Maps API key, like so:

    ```
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAwNOYjQTLk42O-JpKHXGvxkraaMU8Oldc
    ```

### 4. Install Dependencies

Open the integrated terminal in VS Code (`Terminal > New Terminal`) and run this command to install all the required packages:

```bash
npm install
```

### 5. Run the Application

The application requires two services to run at the same time: the Next.js web app and the Genkit AI server. You will need two separate terminals for this.

**Terminal 1: Start the Web App**

In your first terminal, run the following command to start the main application:

```bash
npm run dev
```

Your website will be available at **http://localhost:9002**.

**Terminal 2: Start the AI Server**

Open a second terminal in VS Code (click the `+` icon in the terminal panel). In this new terminal, run the following command to start the AI services:

```bash
npm run genkit:dev
```

This server handles all the AI-powered features, such as image analysis and authenticity scoring. The web app automatically communicates with this server.

You are now all set! Open your browser to `http://localhost:9002` to see your application running.

## References and Research Work

### 1. AI Models & Natural Language Processing

*   **BERT (Bidirectional Encoder Representations from Transformers):** The core algorithm for our authenticity scoring, using a model fine-tuned on the Fakeddit dataset to spot misinformation.
    *   **Paper:** [arxiv.org/abs/1810.04805](https://arxiv.org/abs/1810.04805)
    *   **Dataset:** [arxiv.org/abs/1911.03854](https://arxiv.org/abs/1911.03854)

*   **Google Gemini (Multimodal Models):** The model family powering our image analysis (photo-to-report) and social media intelligence features.
    *   **Reference:** [deepmind.google/technologies/gemini](https://deepmind.google/technologies/gemini/)

### 2. Crowdsourcing in Disaster Management

*   **Ushahidi Platform:** A pioneering open-source project that proved the effectiveness of using citizen reporting for crisis mapping and social accountability.
    *   **Link:** [www.ushahidi.com](https://www.ushahidi.com/)

*   **Volunteered Geographic Information (VGI):** Academic research validating the use of crowdsourced geographic data during disasters for tasks like rapid flood damage estimation.
    *   **See:** Poser, K., & Dransch, D. (2010).

### 3. Coastal Hazard & Disaster Management

*   **Indian National Centre for Ocean Information Services (INCOIS):** The primary stakeholder and source for the problem statement. Their work provides the official framework for our solution.
    *   **Link:** [www.incois.gov.in](https://www.incois.gov.in/)

*   **National Disaster Management Authority (NDMA), India:** The apex body for disaster management in India, providing the strategic context for integrating technology into national response plans.
    *   **Link:** [ndma.gov.in](https://ndma.gov.in/)
