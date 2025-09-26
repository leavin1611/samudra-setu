# SamudraSetu - Crowdsourced Ocean Hazard Reporting

This is a Next.js project created in Firebase Studio. It's a comprehensive platform for crowdsourcing, visualizing, and analyzing ocean hazard information to protect coastal communities.

## The INCOIS Problem Statement

The Indian National Centre for Ocean Information Services (INCOIS) provides essential early warnings for ocean hazards but faces a critical gap: a lack of real-time, on-the-ground field reports from citizens. Furthermore, valuable insights from public discussions on social media during these events remain largely untapped. This creates a need for a unified platform to bridge this information gap, aggregate data, and provide a comprehensive operational picture for disaster management.

## Our Solution: The SamudraSetu AI-Powered Intelligence Loop

SamudraSetu is an AI-driven platform designed to directly address the INCOIS problem statement by creating a unified intelligence loop. It transforms a disconnected and reactive system into a streamlined, proactive one.

### How SamudraSetu Addresses the Problem

*   **Problem: Lack of Real-time Field Reporting**
    *   **Solution:** The **AI-Powered Reporting Form** allows any citizen with a smartphone to become a real-time sensor. By using AI to analyze an uploaded image and pre-fill the report, it makes submitting accurate, geotagged data faster and easier than ever, directly feeding the on-the-ground information that INCOIS needs.

*   **Problem: Untapped Social Media Insights**
    *   **Solution:** The **Social Intelligence Dashboard** is purpose-built for this. It uses a powerful AI (Google's Gemini) to continuously monitor and analyze public social media feeds, extracting key trends, public sentiment, and urgency levels related to coastal hazards.

*   **Problem: Fragmented Data & Lack of a Unified View**
    *   **Solution:** The **Live Hazard Dashboard** serves as the single, unified platform. It aggregates both formal crowdsourced reports and social media activity onto one interactive map. With features like dynamic heatmaps and report clustering, it provides the comprehensive, at-a-glance operational picture required by disaster managers.

*   **Problem: Poor Situational Awareness for Emergency Agencies**
    *   **Solution:** SamudraSetu provides direct, actionable intelligence. The AI-driven authenticity scoring filters out noise, while the analytics on report volume and social media urgency help agencies understand the **scale** and **urgency** of an event. Robust filtering allows officials to drill down by hazard type, location, and date to validate models and make faster, more informed decisions.

### Key Innovations

*   **AI at the Point of Reporting:** Using AI to auto-fill reports from images, not just for backend analysis.
*   **Dual-Layer Authenticity:** Combining AI text analysis with human credibility to create a robust verification system.
*   **Data Fusion:** Uniquely integrating formal crowdsourced reports with unstructured social media intelligence for a complete hazard picture.

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
