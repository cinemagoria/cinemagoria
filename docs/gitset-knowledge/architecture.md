# Architecture

## System Overview
Cinemagoria is a Nuxt.js application designed for discovering movies and TV shows. It provides features such as personalized watchlists, progress tracking, user authentication, and detailed information on films, TV series, people, and festivals. The system leverages a serverless backend for API endpoints and data synchronization, with a focus on delivering a rich, interactive user experience.

## Entry Points
The application provides several entry points for users and automated processes:

| Entry Point | Type | Description |
| :---------- | :--- | :---------- |
| `nuxt dev` | CLI command | Starts the development server. |
| `nuxt build` | CLI command | Builds the application for production. |
| `nuxt generate` | CLI command | Generates a static version of the application. |
| `nuxt preview` | CLI command | Locally previews the production build. |
| `nuxt prepare` | CLI command | Prepares the Nuxt project for development/build. |
| `/` | Route | The main homepage of the application. |
| `/api/*` | Route | Server-side API endpoints for data retrieval and submission. |
| `.github/workflows/gitset-knowledge.yml` | CI workflow | Triggered on `workflow_dispatch` and `push` to `main` (excluding docs, markdown, gitignore, LICENSE) to refresh the AI knowledge base. |
| `.github/workflows/sync-hero-data.yml` | CI workflow | Triggered by `cron: 0 6 * * *` and `workflow_dispatch` to synchronize hero and noir enrichment data. |
| `.github/workflows/sync-noir-historical.yml` | CI workflow | Triggered by `workflow_dispatch` to synchronize N.O.I.R historical data and regenerate noir enrichment data. |

## Core Components
*   **app.vue**: The root Vue component for the application, handling global SEO and layout.
*   **components**: A collection of reusable Vue components for UI elements like cards, carousels, modals, and navigation.
*   **composables**: Provides `useConsentGuard` for managing consent-gated functionality.
*   **layouts**: Defines the `default.vue` layout, including navigation, footer, and modals.
*   **middleware**: Contains `auth.global.ts` for client-side authentication checks.
*   **mixins**: Offers reusable logic for carousel management, detail enrichment, data filtering, and utility functions.
*   **pages**: Vue components defining the various routes and views of the application, such as home, movie/TV details, festival pages, and user profiles.
*   **plugins**: Includes `bus.js` for a global event bus and `lazyload.js` for image lazy loading.
*   **public**: Stores static assets and the PWA manifest (`public/manifest.json`) and a self-destroying service worker (`public/sw.js`).
*   **scripts**: Contains utility scripts for database seeding and data synchronization (e.g., `scripts/seed_tribeca_2026_awards.cjs`, `scripts/syncHeroData.js`).
*   **server/api**: Defines server-side API routes for data fetching and submission (e.g., `/api/article-report`, `/api/festival/cannes/films`).
*   **server/middleware**: Server-side middleware for request processing.
*   **server/plugins**: Server-side plugins.
*   **server/routes**: Defines server-side routes (e.g., `/feed.xml`, `/sitemap.xml`).
*   **server/utils**: Provides server-side utility functions, including database interactions (`server/utils/db.ts`).
*   **services**: Contains service-layer logic.
*   **stores**: Manages application state using Pinia.
*   **utils**: Client-side utility functions.

## Data Flow
1.  User interacts with the client-side application (e.g., navigates to a page, performs a search).
2.  Vue components in [components/](../../components/) and [pages/](../../pages/) dispatch actions or make API calls.
3.  Client-side middleware ([middleware/auth.global.ts](../../middleware/auth.global.ts)) may intercept requests for authentication checks.
4.  API calls are routed to server-side endpoints defined in [server/api/](../../server/api/) or [server/routes/](../../server/routes/).
5.  Server-side endpoints process requests, often interacting with a database (e.g., Turso via `server/utils/db.ts`) or external APIs.
6.  Data is retrieved, processed, and potentially enriched (e.g., with TMDB details).
7.  The server responds with structured data (e.g., JSON).
8.  Client-side components receive the data and update the UI.
9.  State management (via [stores/](../../stores/)) updates the application state.
10. UI re-renders to reflect the new data.

## External Dependencies
*   **~**: General alias for project root imports.
*   **~~**: General alias for project root imports.
*   **h3**: HTTP framework used by Nuxt for server routes.
*   **vue**: Core JavaScript framework for building user interfaces.
*   **@/components**: Alias for importing components from the [components/](../../components/) directory.
*   **@libsql/client**: Client for interacting with LibSQL databases (e.g., Turso).
*   **vue-router**: Official router for Vue.js.
*   **@/utils**: Alias for importing utilities from the [utils/](../../utils/) directory.
*   **fs**: Node.js file system module (server-side).
*   **path**: Node.js path module (server-side).
*   **pinia**: The official state management library for Vue.js.
*   **striptags**: Library for stripping HTML tags from strings.
*   **url**: Node.js URL module (server-side).
*   **#imports**: Nuxt auto-imports.
*   **dotenv**: Module for loading environment variables from a `.env` file.
