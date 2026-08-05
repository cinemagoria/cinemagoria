# Developer Guide

## Prerequisites

To develop with Cinemagoria, ensure you have the following installed:

*   Node.js (version 22-slim is used in production)

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
    This will also run the `postinstall` script, which prepares Nuxt.
3.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Project Layout

*   [.github/](../../.github/) — Contains GitHub Actions workflows for CI/CD and project funding configuration.
*   [components/](../../components/) — Vue components, including global components, festival-specific cards, and media-related UI.
*   [layouts/](../../layouts/) — Defines the default application layout.
*   [pages/](../../pages/) — Vue pages that define the application's routes and views.
*   [plugins/](../../plugins/) — Nuxt plugins for global functionalities like an event bus and lazy loading.
*   [public/](../../public/) — Static assets and the PWA manifest.
*   [scripts/](../../scripts/) — One-shot and synchronization scripts for data management.
*   [server/api/](../../server/api/) — API endpoints for data fetching and submission.
*   [server/middleware/](../../server/middleware/) — Server-side middleware.
*   [utils/](../../utils/) — Client-side utility functions.

## Testing

The provided structural digest and file summaries do not contain information about testing methodologies, frameworks, or specific test files within the `cinemagoria` repository.

## Release & Deployment

Cinemagoria uses Google Cloud Build and Google Cloud Run for deployment.

*   **Docker Image Build**: The [Dockerfile](../../Dockerfile) defines a multi-stage build process for the Nuxt application. It uses a pinned `Node.js 22-slim` image to address a `node-fetch` gzip issue.
*   **Google Cloud Build**: The [cloudbuild.yaml](../../cloudbuild.yaml) file configures Google Cloud Build to automate the Docker image build, push to Artifact Registry, and deployment to Google Cloud Run.
*   **Cloud Run Service**: The application is deployed to the `cinemagoria-main` Cloud Run service in the `us-east1` region.
*   **Nuxt Build Commands**:
    *   `npm run build`: Builds the Nuxt application for production.
    *   `npm run generate`: Generates a static Nuxt application.
    *   `npm run preview`: Locally previews the production build.
