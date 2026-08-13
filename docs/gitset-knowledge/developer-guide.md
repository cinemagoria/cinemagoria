# Developer Guide

## Prerequisites

To develop with Cinemagoria, you need:

*   Node.js (a pinned version is used in the [Dockerfile](../../Dockerfile) to avoid `node-fetch` v2 and `@libsql/client` issues)
*   pnpm (specified in [package.json](../../package.json))

## Setup

1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```
2.  **Prepare Nuxt**:
    ```bash
    pnpm run postinstall
    ```
3.  **Run in Development Mode**:
    ```bash
    pnpm run dev
    ```

## Project Layout

*   `assets`: Contains static assets like images, fonts, or stylesheets.
*   `components`: Reusable Vue components used throughout the application.
*   `composables`: Vue composables for reusable stateful logic.
*   `layouts`: Defines the application's main layouts, such as [default.vue](../../layouts/default.vue).
*   `pages`: Vue components that define the application's routes and views.
*   `server`: Contains server-side API routes, middleware, and utilities.
*   `scripts`: One-shot scripts for data seeding or synchronization.

## Testing

No dedicated test files are present in the repository.

## Release & Deployment

Cinemagoria uses Google Cloud Build for deployment, configured via [cloudbuild.yaml](../../cloudbuild.yaml). This process builds a Docker image (defined in [Dockerfile](../../Dockerfile)) and deploys it to Google Cloud Run, registering the `cinemagoria-main` service.

CI workflows manage data synchronization and knowledge base updates:

*   [.github/workflows/gitset-knowledge.yml](../../.github/workflows/gitset-knowledge.yml): Refreshes the AI knowledge base.
*   [.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml): Synchronizes hero and noir enrichment data.
*   [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml): Synchronizes N.O.I.R historical data.
