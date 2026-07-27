# Developer Guide

## Prerequisites

To develop with Cinemagoria, you need:

*   Node.js (version 18 or later recommended)
*   npm or yarn
*   A Turso database for local development (optional, but recommended for full functionality)

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
    or
    ```bash
    yarn install
    ```
    The `postinstall` script will automatically run `nuxt prepare`.
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```
    This starts the Nuxt.js development server.

## Project Layout

*   [components/](../../components/) - Reusable Vue components for UI elements.
*   [pages/](../../pages/) - Defines the application's routes and views.
*   [server/api/](../../server/api/) - Backend API routes.
*   [server/middleware/](../../server/middleware/) - Server-side middleware.
*   [scripts/](../../scripts/) - Utility scripts for data synchronization and seeding.
*   [public/](../../public/) - Static assets and web app manifest.

## Testing

The provided structural digest does not contain information about testing frameworks or test files.

## Release & Deployment

Cinemagoria uses Google Cloud Build for deployment, configured via [cloudbuild.yaml](../../cloudbuild.yaml). This process involves:

1.  Building a Docker image based on the [Dockerfile](../../Dockerfile).
2.  Pushing the Docker image to Google Artifact Registry.
3.  Updating a Cloud Run service with the new image.

GitHub Actions workflows automate various tasks:

*   [.github/workflows/gitset-knowledge.yml](../../.github/workflows/gitset-knowledge.yml): Refreshes the AI knowledge base.
*   [.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml): Synchronizes hero data.
*   [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml): Synchronizes N.O.I.R historical data.
