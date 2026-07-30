# Developer Guide

## Prerequisites

Cinemagoria is a Nuxt.js application. The following are required:

*   Node.js (v22-slim is used in the Dockerfile)
*   npm (or yarn/pnpm)

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Prepare Nuxt**:
    ```bash
    npm run postinstall
    ```
3.  **Run in Development Mode**:
    ```bash
    npm run dev
    ```
    This starts the Nuxt development server.

## Project Layout

*   [.github/](../../.github/): Contains GitHub Actions workflows for CI/CD.
*   [components/](../../components/): Vue components, including global, festival-specific, and media-related components.
*   [pages/](../../pages/): Vue components defining the application's routes and views.
*   [public/](../../public/): Static assets and the web application manifest.
*   [scripts/](../../scripts/): Node.js scripts for data synchronization and seeding.
*   [server/api/](../../server/api/): Nuxt server routes for API endpoints.

## Testing

The provided structural digest and file summaries do not contain information about testing frameworks, test scripts, or test files.

## Release & Deployment

Cinemagoria v4.15.0 is deployed to Google Cloud Run.

*   **Build**:
    ```bash
    npm run build
    ```
*   **Generate Static Site**:
    ```bash
    npm run generate
    ```
*   **Preview Production Build**:
    ```bash
    npm run preview
    ```
*   **Docker**: The [Dockerfile](../../Dockerfile) defines a multi-stage build process.
*   **Google Cloud Build**: The [cloudbuild.yaml](../../cloudbuild.yaml) configures automated Docker image builds, pushes to Artifact Registry, and deployments to the `cinemagoria-main` service in `us-east1` on Google Cloud Run.
*   **GitHub Actions**:
    *   [.github/workflows/gitset-knowledge.yml](../../.github/workflows/gitset-knowledge.yml): Refreshes the AI knowledge base.
    *   [.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml): Synchronizes hero data daily.
    *   [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml): Synchronizes N.O.I.R historical data.
