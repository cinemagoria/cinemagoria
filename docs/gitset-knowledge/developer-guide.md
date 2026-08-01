# Developer Guide

## Prerequisites

To develop with Cinemagoria, you need:

*   Node.js (version 22-slim is used in production)

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Prepare Nuxt**:
    ```bash
    npm run postinstall
    ```
3.  **Run in development mode**:
    ```bash
    npm run dev
    ```
    This starts the Nuxt development server.

## Project Layout

*   [.github/](../../.github/) - Contains GitHub Actions workflows for CI/CD and project funding configuration.
*   [assets/](../../assets/) - Stores static assets like images, fonts, or stylesheets.
*   [components/](../../components/) - Reusable Vue components, including global components and festival-specific cards.
*   [composables/](../../composables/) - Vue composables for reusable logic across components.
*   [layouts/](../../layouts/) - Defines application layouts, such as the default layout with navigation and modals.
*   [middleware/](../../middleware/) - Nuxt middleware for route protection and global logic.
*   [pages/](../../pages/) - Vue components that define the application's routes and views.
*   [plugins/](../../plugins/) - Nuxt plugins for extending Vue or Nuxt functionality.
*   [public/](../../public/) - Static files served directly, like the web app manifest and a self-destroying service worker.
*   [scripts/](../../scripts/) - One-shot and synchronization scripts for data management.
*   [server/api/](../../server/api/) - API endpoints for data fetching and submission.
*   [server/middleware/](../../server/middleware/) - Server-side middleware for API routes.
*   [server/utils/](../../server/utils/) - Server-side utility functions.
*   [stores/](../../stores/) - Pinia stores for state management.
*   [types/](../../types/) - TypeScript type definitions.
*   [utils/](../../utils/) - Client-side utility functions.

## Testing

No dedicated test files were found in the repository.

## Release & Deployment

Cinemagoria uses Google Cloud Build and Google Cloud Run for deployment.

*   The [Dockerfile](../../Dockerfile) defines a multi-stage build process.
*   [cloudbuild.yaml](../../cloudbuild.yaml) configures Google Cloud Build to:
    *   Build a Docker image.
    *   Push the image to Artifact Registry.
    *   Deploy the image to the `cinemagoria-main` service in Google Cloud Run (region `us-east1`).
*   GitHub Actions workflows in [.github/workflows/](../../.github/workflows/) automate tasks like:
    *   Refreshing the AI knowledge base ([.github/workflows/gitset-knowledge.yml](../../.github/workflows/gitset-knowledge.yml)).
    *   Synchronizing hero data ([.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml)).
    *   Synchronizing Noir historical data ([.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml)).
