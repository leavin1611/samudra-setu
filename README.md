# SamudraSetu - Crowdsourced Ocean Hazard Reporting

This is a Next.js project created in Firebase Studio. It's a comprehensive platform for crowdsourcing, visualizing, and analyzing ocean hazard information to protect coastal communities.

## The INCOIS Problem Statement

The Indian National Centre for Ocean Information Services (INCOIS) provides essential early warnings for ocean hazards but faces a critical gap: a lack of real-time, on-the-ground field reports from citizens. Furthermore, valuable insights from public discussions on social media during these events remain largely untapped. This creates a need for a unified platform to bridge this information gap, aggregate data, and provide a comprehensive operational picture for disaster management.

## Our Solution: The SamudraSetu AI-Powered Intelligence Loop

SamudraSetu is an AI-driven platform designed to directly address the INCOIS problem statement by creating a unified intelligence loop. It transforms a disconnected and reactive system into a streamlined, proactive one.

The core of the solution is a **four-stage intelligence loop**:

1.  **Report (AI-Assisted Crowdsourcing):**
    The platform empowers citizens and on-ground personnel to become real-time sensors. The key innovation is the **AI-assisted reporting form**. When a user uploads a photo of a hazard, a powerful multimodal AI model (Google's Gemini) analyzes the image content. It automatically identifies the hazard type (e.g., "coastal flooding"), estimates its severity, and writes a detailed, factual description. This drastically reduces the time and effort required to submit a high-quality report, encouraging more participation and ensuring data is structured and accurate from the very start.

2.  **Analyze (AI-Powered Verification & Insight):**
    Once data is collected, it is immediately analyzed for authenticity and context.
    *   **Authenticity Scoring:** An AI model (BERT), trained specifically to identify misinformation, analyzes the text of each report to generate an authenticity score. This helps to automatically filter out hoaxes and exaggerations, allowing officials to focus on credible threats.
    *   **Social Media Analysis:** The platform continuously monitors public social media channels. It uses an LLM (Gemini) to analyze public sentiment, identify emerging hazard discussions, and calculate an overall "urgency score" based on the volume and tone of the chatter.

3.  **Visualize (A Unified Dashboard):**
    SamudraSetu aggregates all verified reports and social media insights into a single, interactive dashboard. The central feature is a live map that plots every incident, offering multiple views like a heatmap (to show hazard density) and marker clustering (to simplify busy areas). This provides everyone from the public to disaster managers with a clear, immediate, and unified operational picture.

4.  **Alert (Actionable Intelligence for Response):**
    By providing a filtered, verified, and real-time stream of information, the platform equips disaster managers with actionable intelligence. They can move from reacting to scattered information to proactively making data-driven decisions about where and when to issue alerts, deploy resources, or communicate with the public.

### How SamudraSetu Addresses the INCOIS Problem

*   **Problem 1: Lack of Real-time Field Reporting**
    *   **Solution:** The **Report a Hazard** page allows any citizen to submit geotagged reports with photos. **AI Image Analysis** makes this process fast and accurate, encouraging participation and providing the high-quality, structured data that INCOIS needs.

*   **Problem 2: Untapped Social Media Insights**
    *   **Solution:** The **Social Intelligence Dashboard** directly addresses this by using an AI (Gemini) to analyze public social media feeds for hazard keywords, trends, and sentiment, providing a real-time pulse on public discussion.

*   **Problem 3: Fragmented Data**
    *   **Solution:** The **Live Hazard Dashboard** is the unified platform. It plots both formal crowdsourced reports and social media hotspots on a single, interactive map, creating one common source of truth.

*   **Problem 4: Lack of Situational Awareness**
    *   **Solution:** The platform provides disaster managers with immediate insights into **scale** (via report density), **urgency** (via AI-driven scores), and **sentiment**. Comprehensive **filtering tools** allow officials to drill down by hazard type, location, and date, enabling faster validation of warning models.

### Key Innovations

*   **AI at the Point of Reporting:** Using AI to auto-fill reports from images, not just for backend analysis.
*   **Dual-Layer Authenticity:** Combining AI text analysis with human credibility to create a robust verification system.
*   **Data Fusion:** Uniquely integrating formal crowdsourced reports with unstructured social media intelligence for a complete hazard picture.

### How SamudraSetu Works: A Detailed Walkthrough

This description breaks down the entire process from a user's first interaction to the final visualization of their report, detailing the flow of data between the frontend, the AI backend, and external services.

**Step 1: User Authentication**
*   **Action:** A user visits the SamudraSetu website and clicks the "Login" button.
*   **Process:**
    *   They are directed to the `PhoneLoginForm`.
    *   The user enters their phone number in E.164 format (e.g., +919876543210).
    *   An invisible **Google reCAPTCHA** is triggered to verify the user is not a bot.
    *   Upon successful verification, the frontend calls **Firebase Authentication's** `signInWithPhoneNumber` function.
    *   Firebase sends a one-time password (OTP) to the user's mobile device.
    *   The user enters the 6-digit OTP, which is then verified by Firebase.
    *   Upon successful verification, the user is logged in and authenticated for the session.

**Step 2: Initiating a Hazard Report**
*   **Action:** The authenticated user observes a potential hazard and navigates to the "Report a Hazard" page.
*   **Process:** The `ReportHazardForm` component is rendered, presenting the user with an upload area and a form.

**Step 3: AI-Powered Image Analysis**
*   **Action:** The user clicks "Click to upload an image" and selects a photo of the hazard from their device.
*   **Process:**
    *   The frontend reads the selected image file.
    *   It uses the `FileReader` API to convert the image into a **Base64-encoded Data URI**. This is a text string that represents the image (e.g., `data:image/jpeg;base64,...`).
    *   The frontend makes an API call to the backend **Genkit AI Flow**: `analyzeReportImage`, sending the Data URI as a parameter.
    *   The Genkit flow forwards the image data and a specific text prompt to the **Google Gemini multimodal model**.
    *   The Gemini model analyzes the visual content of the image based on the prompt's instructions.
    *   The model returns a structured **JSON object** containing its analysis, like `{ "hazardType": "flooding", "severity": "high", "description": "Coastal road is submerged..." }`.

**Step 4: Form Pre-population and User Submission**
*   **Action:** The user sees the form fields automatically populated and submits the report.
*   **Process:**
    *   The frontend receives the JSON response from the Genkit flow.
    *   It uses this data to **automatically set the values** for the "Hazard Type," "Severity Level," and "Description" fields in the form.
    *   The user reviews the AI-generated information, manually fills in the remaining fields (Location, Date, Time), and clicks the "Submit Report" button.

**Step 5: Data Processing and Authenticity Verification**
*   **Action:** The submitted report is processed and verified by the system.
*   **Process:**
    *   The new report data is added to the application's central state using the `addReport` function from `HazardReportsContext`. This makes it immediately available to all components.
    *   Simultaneously, the text from the report's `description` is sent to another Genkit flow: `verifyReportAuthenticity`.
    *   This flow uses a fine-tuned **BERT model** (`xenova/bert-base-cased-fakeddit`) to analyze the text for patterns of misinformation.
    *   The BERT model returns an **authenticity score** (e.g., 0.9 for "likely real").
    *   Based on this score, the report is programmatically marked with a `verified: true` or `verified: false` flag.

**Step 6: Real-time Visualization and Alerting**
*   **Action:** The newly created and verified report instantly appears on the platform for all users.
*   **Process:**
    *   The **Live Hazard Dashboard** automatically re-renders because its data source (`HazardReportsContext`) has been updated.
    *   The new report appears as a pin on the interactive **Google Map**. The pin's color or icon can reflect its verification status.
    *   Key statistics on the dashboard, such as "Total Reports" and "Verified Incidents," are updated in real time.
    *   If the report was successfully verified, a system-wide toast notification is triggered to alert all active users of the new, credible threat.

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
