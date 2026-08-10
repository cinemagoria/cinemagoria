# Architecture

## System Overview
Cinemagoria is a Nuxt.js application (v4.16.0) designed to help users discover movies and TV shows. It provides a rich user interface with features like content discovery, personalized lists, festival coverage, news, and user authentication. The system leverages a serverless architecture, with a Nuxt frontend and a backend API that interacts with a database (Turso) and external services like TMDB. Deployment is managed via Google Cloud Build and Cloud Run, with Docker for containerization.

## Entry Points
The application has several entry points:

| Type | Name | Description |
|---|---|---|
| **Web Interface** | `app.vue` | Root Vue component for the application, handling global SEO and rendering layouts/pages. |
| **CLI Scripts** | `build` | Builds the Nuxt application for production. |
| | `dev` | Starts the Nuxt development server. |
| | `generate` | Generates static files for the Nuxt application. |
| | `preview` | Previews the Nuxt production build. |
| | `postinstall` | Prepares the Nuxt project after installation. |
| | `node scripts/seed_tribeca_2026_awards.cjs` | Seeds the `festival_awards` table with Tribeca 2026 award winners. |
| **API Routes** | `GET /api/article/:slug` | Fetches a single article by its slug. |
| | `POST /api/article-report` | Handles reports for article issues. |
| | `GET /api/article/rss` | Redirects to the canonical RSS feed. |
| | `GET /api/articles/by-slugs` | Retrieves articles by a list of slugs. |
| | `GET /api/awards/index-page` | Serves award data for a specific type and year. |
| | `GET /api/awards/index` | Retrieves award information filtered by various criteria. |
| | `POST /api/contact` | Handles contact form submissions. |
| | `POST /api/festival-report` | Handles reports for festival data issues. |
| | `GET /api/festival/bafici/awards` | Fetches BAFICI 2026 awards data. |
| | `GET /api/festival/bafici/films` | Fetches BAFICI 2026 film data. |
| | `GET /api/festival/bafici/schedule` | Retrieves BAFICI 2026 screening schedule. |
| | `GET /api/festival/berlinale/awards` | Fetches Berlinale 2026 awards data. |
| | `GET /api/festival/berlinale/films` | Fetches Berlinale 2026 film data. |
| | `GET /api/festival/berlinale/schedule` | Retrieves Berlinale 2026 screening schedule. |
| | `GET /api/festival/bifan/awards` | Fetches BIFAN 2026 awards data. |
| | `GET /api/festival/bifan/films` | Fetches BIFAN 2026 film data. |
| | `GET /api/festival/bifan/schedule` | Retrieves BIFAN 2026 screening schedule. |
| | `GET /api/festival/bifff/awards` | Fetches BIFFF 2026 awards data. |
| | `GET /api/festival/bifff/films` | Fetches BIFFF 2026 film data. |
| | `GET /api/festival/bifff/schedule` | Retrieves BIFFF 2026 screening schedule. |
| **CI Workflows** | [.github/workflows/gitset-knowledge.yml](../../.github/workflows/gitset-knowledge.yml) | Refreshes AI knowledge base. |
| | [.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml) | Synchronizes hero and noir enrichment data. |
| | [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml) | Synchronizes N.O.I.R historical data. |

## Core Components
*   `.github`: Contains GitHub Actions workflows for CI/CD and project funding configuration.
*   `(root)`: Houses core application files like [app.vue](../../app.vue), [nuxt.config.ts](../../nuxt.config.ts), [package.json](../../package.json), and Docker/Cloud Build configurations.
*   `assets`: Stores static assets such as images, fonts, and stylesheets.
*   `components`: Contains reusable Vue components, including global UI elements, festival-specific cards, and media display components.
*   `composables`: Provides reusable Vue composition functions, such as `useConsentGuard` for managing cookie consent.
*   `docs`: Contains project documentation.
*   `layouts`: Defines application layouts, with `default.vue` providing the main structure.
*   `middleware`: Implements Nuxt route middleware, including `auth.global.ts` for client-side authentication checks.
*   `mixins`: Offers reusable Vue mixins for common functionalities like carousel management, data filtering, and utility functions.
*   `pages`: Defines the application's routes and corresponding Vue page components, covering various sections like home, movie/TV details, festivals, news, and user profiles.
*   `plugins`: Integrates third-party libraries and custom functionalities into Nuxt, such as an event bus and lazy loading directive.
*   `public`: Contains static files served directly, including the PWA manifest and a self-destroying service worker.
*   `scripts`: Houses one-shot and synchronization scripts for database seeding and data fetching.
*   `server/api`: Implements backend API routes for data retrieval, submission, and reporting.
*   `server/data`: Stores static data files, such as `awards.json`.
*   `server/middleware`: Contains server-side middleware for API requests.
*   `server/plugins`: Server-side Nuxt plugins.
*   `server/routes`: Defines additional server-side routes.
*   `server/types`: Contains TypeScript type definitions for server-side code.
*   `server/utils`: Provides server-side utility functions, including database interaction (`db.ts`) and RSS feed generation (`rss-feed.ts`).
*   `services`: Contains service-layer logic, potentially for external API interactions or complex business logic.
*   `stores`: Manages application state using Pinia.
*   `types`: Contains TypeScript type definitions for client-side code.
*   `utils`: Provides client-side utility functions.

## Data Flow
1.  User interacts with the Nuxt.js frontend, triggering a page load or action.
2.  Frontend components (e.g., `pages/movie/[id].vue`) make API requests to the `server/api` endpoints.
3.  Server-side API routes (e.g., `server/api/movie/[id].get.ts`) process the request.
4.  API routes interact with the database (Turso) via `server/utils/db.ts` to fetch or store data.
5.  API routes may also fetch data from external services (e.g., TMDB) or static data files (`server/data/awards.json`).
6.  The backend processes the data, potentially applying business logic or transformations.
7.  The processed data is returned to the frontend.
8.  Frontend components render the data, updating the UI.

## External Dependencies
*   `~`: General utility library.
*   `~~`: General utility library.
*   `h3`: HTTP framework for Nuxt server routes.
*   `vue`: Core JavaScript framework for building user interfaces.
*   `@/components`: Internal alias for reusable Vue components.
*   `@libsql/client`: Client for interacting with the Turso database.
*   `vue-router`: Routing library for Vue.js.
*   `@/utils`: Internal alias for client-side utility functions.
*   `fs`: Node.js file system module.
*   `path`: Node.js path module.
*   `pinia`: State management library for Vue.js.
*   `striptags`: Library for stripping HTML tags from strings.
*   `url`: Node.js URL module.
*   `#imports`: Nuxt auto-imports.
*   `dotenv`: Loads environment variables from a `.env` file.
