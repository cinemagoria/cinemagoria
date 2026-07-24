# Developer Guide

## Prerequisites

To develop with Cinemagoria, you need:

*   Node.js (for `npm` and `npx`)

## Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/cinemagoria/cinemagoria.git
    cd cinemagoria
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Prepare Nuxt**:
    This step is automatically run after `npm install`.
    ```bash
    npm run postinstall
    ```
4.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Project Layout

*   `assets/`: Static assets like images, fonts, and stylesheets.
*   `components/`: Reusable Vue components.
*   `docs/`: Project documentation, including this guide.
*   `pages/`: Vue components that define the application's routes.
*   `public/`: Static files served directly by the web server.
*   `server/`: Backend API routes, middleware, and utilities.
*   `scripts/`: One-off or utility scripts for data synchronization and seeding.

## Testing

The provided structural digest and file summaries do not contain information about testing frameworks, test files, or testing scripts.

## Release & Deployment

Cinemagoria uses Google Cloud Build and Docker for deployment.

*   **Docker Image**: The [Dockerfile](../../Dockerfile) defines the Docker image, including build arguments for Supabase and a multi-stage build process.
*   **Google Cloud Build**: The [cloudbuild.yaml](../../cloudbuild.yaml) configuration handles building, pushing, and deploying the Docker image to Google Cloud Run.
*   **Nuxt Build**: The `build` script (`nuxt build`) compiles the Nuxt.js application for production.
*   **Nuxt Generate**: The `generate` script (`nuxt generate`) pre-renders the application into static HTML files.
*   **Nuxt Preview**: The `preview` script (`nuxt preview`) locally serves the production build.

CI workflows automate data synchronization:

*   **AI Knowledge Base**: The [.github/workflows/gitset-knowledge.yml](../../.github/workflows/gitset-knowledge.yml) workflow incrementally refreshes the project's AI knowledge base.
*   **Hero Data Sync**: The [.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml) workflow synchronizes hero enrichment data from a Turso database into JSON files.
*   **N.O.I.R. Historical Data Sync**: The [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml) workflow synchronizes N.O.I.R historical data and regenerates enrichment data.
