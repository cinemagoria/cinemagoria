# Developer Guide

## Prerequisites

To develop with Cinemagoria, you need:

*   Node.js (for `npm` package management and script execution)
*   A Turso database (for `scripts/syncCustomOverrides.js`, `scripts/syncHeroData.js`, `scripts/syncNoirEnrichmentData.js`, `scripts/syncNoirHistorical.js`)

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
4.  **Build for Production**:
    ```bash
    npm run build
    ```
5.  **Generate Static Site**:
    ```bash
    npm run generate
    ```
6.  **Preview Production Build**:
    ```bash
    npm run preview
    ```

## Project Layout

*   [`assets/`](../../assets/) : Static assets like images, fonts, or stylesheets.
*   [`components/`](../../components/) : Reusable Vue components (e.g., `components/Card.vue`, `components/global/Nav.vue`).
*   [`composables/`](../../composables/) : Vue composables for reusable stateful logic (e.g., `composables/useConsentGuard.js`).
*   [`layouts/`](../../layouts/) : Application layouts (e.g., `layouts/default.vue`).
*   [`middleware/`](../../middleware/) : Nuxt middleware functions (e.g., `middleware/auth.global.ts`).
*   [`pages/`](../../pages/) : Vue components for application routes (e.g., `pages/index.vue`, `pages/movie/[id].vue`).
*   [`plugins/`](../../plugins/) : Nuxt plugins for global functionality (e.g., `plugins/bus.js`, `plugins/lazyload.js`).
*   [`public/`](../../public/) : Statically served files (e.g., `public/manifest.json`).
*   [`scripts/`](../../scripts/) : Utility scripts for data synchronization and seeding (e.g., `scripts/syncHeroData.js`).
*   [`server/api/`](../../server/api/) : API endpoints (e.g., `server/api/movie/[id].get.ts`).
*   [`stores/`](../../stores/) : Pinia stores for state management.

## Testing

No dedicated test files were found in the repository.

## Release & Deployment

Cinemagoria uses Google Cloud Build and Google Cloud Run for deployment, configured via [`cloudbuild.yaml`](../../cloudbuild.yaml) and [`Dockerfile`](../../Dockerfile).

GitHub Actions workflows are used for data synchronization:

*   **Sync Hero Data**: [`sync-hero-data.yml`](../../.github/workflows/sync-hero-data.yml) runs daily at 6 AM UTC and can be triggered manually.
*   **Sync Noir Historical Data**: [`sync-noir-historical.yml`](../../.github/workflows/sync-noir-historical.yml) is triggered manually.
