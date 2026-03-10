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

**Technical Architecture:**
SamudraSetu is built on a modern, robust, and scalable technology stack:
- **Frontend:** A responsive and interactive user interface built with **Next.js** and **React**, using **TypeScript** for type safety. The UI is composed of beautifully designed, accessible components from **ShadCN UI**, styled with **Tailwind CSS**.
- **AI Backend:** All AI-powered functionalities are orchestrated by **Google Genkit**, which runs as a dedicated server. It manages calls to **Google Gemini** for multimodal analysis and content generation, and to a local **BERT model** for authenticity scoring.
- **Backend Services:** User management and authentication are securely handled by **Firebase Authentication**, utilizing OTP-based phone login. **Firestore** is the intended backend database for storing all user data and reports.

## The Core Idea: Solving the INCOIS Problem Statement

**SamudraSetu** is an AI-driven, web-based intelligence platform designed as a direct response to a critical challenge faced by the **Indian National Centre for Ocean Information Services (INCOIS)**. While INCOIS excels at issuing early warnings for ocean hazards using sophisticated models, it operates with two significant information gaps:

1.  **A Lack of Real-Time Field Reporting:** Official models cannot be validated or enriched without on-the-ground observations from citizens.
2.  **Untapped Social Media Insights:** Public discussions during hazard events are a rich, unstructured source of real-time information that is largely unused.

SamudraSetu bridges these gaps by creating a unified, real-time **intelligence loop**. It transforms the one-way flow of information (from INCOIS to the public) into a two-way dialogue, empowering citizens to become active participants in disaster risk reduction. It is the functional, implemented solution to the INCOIS problem statement.

## How SamudraSetu Directly Solves the Problem

Our platform connects every requirement in the problem statement to a tangible, working feature:

**1. Enables Real-Time, Geotagged Citizen Reporting**
*   **The Need:** "Allow citizens to submit geotagged reports, photos, or videos."
*   **Our Solution:** The **Report a Hazard (`/report`)** page is a core feature. A user can upload a geo-tagged photo, and the system's AI automatically analyzes the image to pre-fill the report with the hazard type, severity, and a detailed description. This makes reporting fast, accurate, and directly addresses the need for on-the-ground data.

**2. Taps into Social Media Intelligence with NLP**
*   **The Need:** "Integrate social media feeds... and apply Text Classification/Natural Language Processing."
*   **Our Solution:** The **Social Intelligence Dashboard (`/social-intelligence`)** uses a Genkit NLP engine to analyze public posts. It automatically extracts public **sentiment**, calculates an **urgency score**, and identifies **key discussion topics**, turning unstructured social chatter into actionable intelligence for emergency response agencies.

**3. Provides a Unified, Dynamic Dashboard for Situational Awareness**
*   **The Need:** "Aggregate and visualize real-time crowdsourced data on a dynamic dashboard... with hotspots."
*   **Our Solution:** The **Live Hazard Dashboard** serves as the central command center. It visualizes all reports on an interactive Google Map, with features like **Heatmaps** and **Marker Clustering** to instantly identify hotspots where report density is high. This provides the comprehensive operational picture required for faster validation and better resource allocation.

**4. Implements Data Verification and Role-Based Design**
*   **The Need:** "Support role-based access" and help validate information.
*   **Our Solution:** The platform is designed with role-based access in mind (as seen in the `/signup` page). Crucially, every report is automatically analyzed for authenticity by a **BERT AI model**, providing a credibility score that helps officials distinguish between verified incidents and potential misinformation.

**5. Delivers Multilingual Support for Regional Accessibility**
*   **The Need:** "Multilingual support for regional accessibility."
*   **Our Solution:** The platform includes an integrated **Google Translate widget** in the header, allowing users to instantly switch the interface to their preferred language, ensuring the tool is accessible to diverse coastal communities across India.

---

## SamudraSetu: System Architecture & Technical Deep Dive

### 1. Technology Stack

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

### 2. Key Features & How They Work (The Intelligence Loop)

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

### 3. Future Vision: The IoT Connection to the INCOIS Problem Statement

While INCOIS uses satellites and numerical models to predict hazards, what’s missing is last-mile, real-time validation from the ground. This is where IoT fits in. By deploying smart buoys, tide sensors, coastal weather stations, and GPS-enabled fishing boats, we can feed live ocean and coastal data directly into the SamudraSetu platform.

This sensor data, combined with geo-tagged citizen reports and AI-driven social media analysis, creates a 360-degree operational picture for disaster managers. It strengthens INCOIS’s early warning models, validates forecasts faster, and ensures coastal communities get timely, accurate alerts—even in remote areas.

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

## RESEARCH AND REFERENCES

### 1. AI Models & Natural Language Processing

**BERT (Bidirectional Encoder Representations from Transformers):** The core algorithm for our authenticity scoring, using a model fine-tuned on the Fakeddit dataset to spot misinformation.
- **Paper:** [arxiv.org/abs/1810.04805](https://arxiv.org/abs/1810.04805)
- **Dataset:** [arxiv.org/abs/1911.03854](https://arxiv.org/abs/1911.03854)

**Google Gemini (Multimodal Models):** The model family powering our image analysis (photo-to-report) and social media intelligence features.
- **Reference:** [deepmind.google/technologies/gemini](https://deepmind.google/technologies/gemini/)

### 2. Crowdsourcing in Disaster Management

**Ushahidi Platform:** A pioneering open-source project that proved the effectiveness of using citizen reporting for crisis mapping and social accountability.
- **Link:** [www.ushahidi.com](https://www.ushahidi.com/)

**Volunteered Geographic Information (VGI):** Academic research validating the use of crowdsourced geographic data during disasters for tasks like rapid flood damage estimation.
- **See:** Poser, K., & Dransch, D. (2010).

### 3. Coastal Hazard & Disaster Management

**Indian National Centre for Ocean Information Services (INCOIS):** The primary stakeholder and source for the problem statement. Their work provides the official framework for our solution.
- **Link:** [www.incois.gov.in](https://www.incois.gov.in/)

**National Disaster Management Authority (NDMA), India:** The apex body for disaster management in India, providing the strategic context for integrating technology into national response plans.
- **Link:** [ndma.gov.in](https://ndma.gov.in/)
