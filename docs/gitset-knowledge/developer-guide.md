# Developer Guide

## Prerequisites

To develop with Cinemagoria, you need:

*   **Node.js**: Version 22-slim (pinned in [Dockerfile](../../Dockerfile)).
*   **pnpm**: For package management.

## Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/cinemagoria/cinemagoria.git
    cd cinemagoria
    ```
2.  **Install dependencies**:
    ```bash
    pnpm install
    ```
3.  **Run in development mode**:
    ```bash
    pnpm dev
    ```
    This starts the Nuxt development server.

## Project Layout

*   **components**: Reusable Vue components.
*   **layouts**: Application layout components.
*   **pages**: Vue components defining application routes.
*   **public**: Static assets served directly.
*   **scripts**: One-shot or utility scripts.
*   **server**: Backend API routes, middleware, and utilities.

## Testing

The project does not contain any dedicated test files.

## Release & Deployment

Cinemagoria uses Google Cloud Build and Cloud Run for deployment.

*   **Build**: `pnpm build`
*   **Generate static site**: `pnpm generate`
*   **Preview**: `pnpm preview`

The [cloudbuild.yaml](../../cloudbuild.yaml) file configures Google Cloud Build to:
1.  Build a Docker image using the [Dockerfile](../../Dockerfile).
2.  Push the image to Google Artifact Registry.
3.  Deploy the image to the `cinemagoria-main` service in Google Cloud Run (region `us-east1`).

GitHub Actions workflows automate data synchronization and knowledge base updates:
*   [.github/workflows/gitset-knowledge.yml](../../.github/workflows/gitset-knowledge.yml): Refreshes the AI knowledge base.
*   [.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml): Synchronizes hero enrichment data.
*   [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml): Synchronizes N.O.I.R historical data.
