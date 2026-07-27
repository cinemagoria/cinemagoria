# Developer Guide

## Prerequisites

To develop with Cinemagoria, you need:

*   Node.js (for `npm` and `npx`)
*   A Turso database (for `LIBSQL_CLIENT_URL` and `LIBSQL_CLIENT_TOKEN` environment variables)
*   Supabase credentials (for `SUPABASE_URL` and `SUPABASE_KEY` environment variables)
*   TMDB API key (for `TMDB_API_KEY` environment variable)

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
3.  **Prepare Nuxt.js**:
    ```bash
    npm run postinstall
    ```
4.  **Environment Variables**: Create a `.env` file in the root directory and populate it with your Turso, Supabase, and TMDB credentials.
5.  **Run in development mode**:
    ```bash
    npm run dev
    ```
    This starts the Nuxt.js development server.

## Project Layout

*   **[.github/](../../.github/)**: Contains GitHub Actions workflows for CI/CD and funding configuration.
*   **[assets/](../../assets/)**: Stores static assets like images, fonts, or stylesheets.
*   **[components/](../../components/)**: Reusable Vue components used throughout the application.
*   **[pages/](../../pages/)**: Defines the application's routes and views.
*   **[public/](../../public/)**: Static files served directly by the web server.
*   **[server/](../../server/)**: Contains server-side API routes, middleware, and utilities.

## Testing

The provided structural digest and file summaries do not contain information about testing frameworks, test files, or testing scripts.

## Release & Deployment

The Cinemagoria application uses Google Cloud Build and Docker for deployment.

*   **[Dockerfile](../../Dockerfile)**: Defines the Docker image for the application.
*   **[cloudbuild.yaml](../../cloudbuild.yaml)**: Configures Google Cloud Build to build the Docker image, push it to Google Artifact Registry, and update a Cloud Run service.
*   **Build script**: `npm run build`
*   **Generate static site**: `npm run generate`
*   **Preview build**: `npm run preview`

The repository also includes GitHub Actions workflows for automated data synchronization:

*   [.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml): Synchronizes hero and noir enrichment data.
*   [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml): Synchronizes N.O.I.R historical data.
*   [.github/workflows/gitset-knowledge.yml](../../.github/workflows/gitset-knowledge.yml): Refreshes the AI knowledge base.
