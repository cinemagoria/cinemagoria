# Developer Guide

## Prerequisites

To develop with Cinemagoria, you need:

*   Node.js (for `npm` and `npx`)
*   Familiarity with Vue.js and Nuxt.js

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Prepare Nuxt.js**:
    ```bash
    npm run postinstall
    ```
3.  **Start development server**:
    ```bash
    npm run dev
    ```
    This will launch the application in development mode, typically accessible at `http://localhost:3000`.

## Project Layout

*   [.github/](../../.github/) - GitHub Actions workflows for CI/CD and automation.
*   [assets/](../../assets/) - Static assets like images, fonts, or stylesheets.
*   [components/](../../components/) - Reusable Vue components, categorized by global, common, festival, etc.
*   [composables/](../../composables/) - Vue composables for reusable stateful logic.
*   [docs/](../../docs/) - Project documentation.
*   [layouts/](../../layouts/) - Nuxt.js layouts for consistent page structures.
*   [middleware/](../../middleware/) - Nuxt.js middleware for route-level logic.
*   [mixins/](../../mixins/) - Vue mixins for shared component options.
*   [pages/](../../pages/) - Vue components that define application routes.
*   [plugins/](../../plugins/) - Nuxt.js plugins for extending Vue or Nuxt.
*   [public/](../../public/) - Static files served directly, like `manifest.json`.
*   [scripts/](../../scripts/) - One-shot or utility scripts for data synchronization and seeding.
*   [server/](../../server/) - Backend API routes, middleware, and utilities.
*   [services/](../../services/) - Client-side services for API interaction.
*   [stores/](../../stores/) - Pinia stores for global state management.
*   [types/](../../types/) - TypeScript type definitions.
*   [utils/](../../utils/) - General utility functions.

## Testing

The provided structural digest and file summaries do not contain information about testing frameworks, test files, or testing scripts.

## Release & Deployment

Cinemagoria uses Google Cloud Build and Google Cloud Run for deployment.

*   The [Dockerfile](../../Dockerfile) defines the Docker image.
*   [cloudbuild.yaml](../../cloudbuild.yaml) configures the build, push, and deployment process to Google Cloud Run.

CI workflows automate data synchronization:

*   [.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml): Synchronizes hero enrichment data from Turso to JSON files daily at 06:00 UTC.
*   [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml): Synchronizes N.O.I.R historical data and regenerates enrichment data.
