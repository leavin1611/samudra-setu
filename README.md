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

*   **BERT (Bidirectional Encoder Representations from Transformers):** The core algorithm for our authenticity scoring. Its ability to understand deep context in language is critical for identifying misinformation.
    *   **Reference Paper:** Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2018). "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding."
    *   **Link:** [https://arxiv.org/abs/1810.04805](https://arxiv.org/abs/1810.04805)

*   **Google Gemini (Multimodal Models):** The model family powering our image analysis and social media intelligence features.
    *   **Reference:** Google. (2023). "Gemini: A Family of Highly Capable Multimodal Models."
    *   **Link:** [https://deepmind.google/technologies/gemini/](https://deepmind.google/technologies/gemini/)

*   **Misinformation Detection:** The fine-tuned BERT model we use (`xenova/bert-base-cased-fakeddit`) is based on research into detecting fake news.
    *   **Fakeddit Dataset Paper:** Nakamura, K., Levy, S., & Ttoy, W. C. (2020). "Fakeddit: A New Multimodal Benchmark Dataset for Fine-grained Fake News Detection."
    *   **Link:** [https://arxiv.org/abs/1911.03854](https://arxiv.org/abs/1911.03854)

### 2. Crowdsourcing in Disaster Management

*   **Ushahidi Platform:** A pioneering open-source project that uses crowdsourcing for social activism and public accountability, demonstrating the power of citizen reporting.
    *   **Link:** [https://www.ushahidi.com/](https://www.ushahidi.com/)

*   **Academic Research:** Studies have validated the effectiveness of using crowdsourced geographic information during disasters.
    *   **Reference Paper:** Poser, K., & Dransch, D. (2010). "Volunteered Geographic Information for disaster management with application to rapid flood damage estimation."

### 3. Coastal Hazard & Disaster Management

*   **Indian National Centre for Ocean Information Services (INCOIS):** The primary stakeholder and source for the problem statement.
    *   **Link:** [https://www.incois.gov.in/](https://www.incois.gov.in/)

*   **National Disaster Management Authority (NDMA), India:** The apex body for disaster management in India, providing strategic context.
    *   **Link:** [https://ndma.gov.in/](https://ndma.gov.in/)
