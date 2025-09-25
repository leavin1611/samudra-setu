# SamudraSetu - Crowdsourced Ocean Hazard Reporting

This is a Next.js project created in Firebase Studio. It's a comprehensive platform for crowdsourcing, visualizing, and analyzing ocean hazard information to protect coastal communities.

## Project Summary

**SamudraSetu** is an AI-driven platform designed to bridge the gap in coastal safety by creating a unified intelligence loop. It addresses the problems of misinformation, slow reporting, and disconnected data by leveraging cutting-edge AI at every step.

*   **The Problem:** Current hazard reporting is chaotic, relying on slow manual processes and unverified social media chatter, which leads to public confusion and delayed responses from authorities.

*   **Our Solution (The AI Intelligence Loop):**
    1.  **Report (AI-Assisted):** Citizens easily report hazards. Our AI (Gemini) analyzes uploaded photos to instantly pre-fill report details, ensuring speed and accuracy.
    2.  **Analyze (AI-Verified):** A specialized AI (BERT) scores the authenticity of reports to filter out hoaxes, while another AI (Gemini) analyzes social media for public sentiment and urgency.
    3.  **Visualize (Unified Dashboard):** All verified data is plotted on a single, live map with heatmaps and hotspots, providing a clear and immediate operating picture.
    4.  **Alert (Actionable Intelligence):** Disaster managers get real-time, verified intelligence, enabling faster and more effective community alerts.

*   **Key Innovations:**
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
