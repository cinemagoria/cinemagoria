# Developer Guide

## Prerequisites

To develop with Cinemagoria, you need:

*   Node.js 22-slim (pinned to avoid a `node-fetch` v2 gzip issue with `@libsql/client`).

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
    This will also run `nuxt prepare`.
3.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Project Layout

*   [.github/](../../.github/): GitHub Actions workflows and funding configuration.
*   [assets/](../../assets/): Static assets like images, fonts, or stylesheets.
*   [components/](../../components/): Reusable Vue components.
*   [composables/](../../composables/): Vue composables for reusable logic.
*   [layouts/](../../layouts/): Application layouts.
*   [pages/](../../pages/): Vue pages that define application routes.
*   [public/](../../public/): Static files served directly, like `manifest.json`.
*   [server/](../../server/): Server-side API routes, middleware, and utilities.
*   [scripts/](../../scripts/): One-off utility scripts for data seeding or synchronization.

## Testing

No dedicated test files were found in the repository structure.

## Release & Deployment

Cinemagoria uses Google Cloud Build to automate its deployment process. The [cloudbuild.yaml](../../cloudbuild.yaml) file configures Cloud Build to:

1.  Build a Docker image from the [Dockerfile](../../Dockerfile).
2.  Push the image to Google Artifact Registry.
3.  Deploy the image to the `cinemagoria-main` Cloud Run service in `us-east1`.

The `package.json` includes scripts for building and generating the Nuxt application:

*   `npm run build`: Builds the Nuxt application for production.
*   `npm run generate`: Generates a static Nuxt application.
*   `npm run preview`: Locally previews a production build.
