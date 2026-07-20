# Architecture

## System Overview
Cinemagoria is a Nuxt.js application, version 4.14.0, designed to help users discover movies and TV shows. It provides a comprehensive platform for browsing content, tracking watch progress, managing custom lists, and staying updated on film festivals and news. The system integrates with external APIs for media data and utilizes a Turso database for internal data management. It is built with a multi-stage Docker setup and deployed via Google Cloud Build to Google Cloud Run.

## Entry Points
| Type | Name | Description |
|---|---|---|
| Package Script | `build` | Builds the Nuxt application for production. |
| Package Script | `dev` | Runs the Nuxt application in development mode. |
| Package Script | `generate` | Generates a static Nuxt application. |
| Package Script | `preview` | Previews the Nuxt application after a build. |
| Package Script | `postinstall` | Prepares the Nuxt application after installation. |
| CI Workflow | `.github/workflows/gitset-knowledge.yml` | Refreshes the AI knowledge base. |
| CI Workflow | `.github/workflows/sync-hero-data.yml` | Synchronizes hero enrichment data from Turso to JSON. |
| CI Workflow | `.github/workflows/sync-noir-historical.yml` | Synchronizes N.O.I.R historical data and regenerates enrichment data. |
| API Route | `POST /api/article-report` | Reports issues with articles. |
| API Route | `GET /api/article/:slug` | Retrieves a specific article by slug. |
| API Route | `GET /api/article/rss` | Redirects to the canonical RSS feed. |
| API Route | `GET /api/articles/by-slugs` | Retrieves multiple articles by slugs. |
| API Route | `GET /api/awards/index-page` | Retrieves awards data for a specific award type and year. |
| API Route | `GET /api/awards` | Retrieves awards data filtered by various criteria. |
| API Route | `POST /api/contact` | Handles contact form submissions. |
| API Route | `POST /api/festival-report` | Reports issues with festival data. |
| API Route | `GET /api/festival/bafici/awards` | Fetches BAFICI 2026 awards. |
| API Route | `GET /api/festival/bafici/films` | Retrieves BAFICI 2026 films. |
| API Route | `GET /api/festival/bafici/schedule` | Retrieves BAFICI 2026 schedule. |
| API Route | `GET /api/festival/berlinale/awards` | Fetches Berlinale 2026 awards. |
| API Route | `GET /api/festival/berlinale/films` | Retrieves Berlinale 2026 films. |
| API Route | `GET /api/festival/berlinale/schedule` | Retrieves Berlinale 2026 schedule. |
| API Route | `GET /api/festival/bifff/awards` | Fetches BIFFF 2026 awards. |
| API Route | `GET /api/festival/bifff/films` | Retrieves BIFFF 2026 films. |
| API Route | `GET /api/festival/bifff/schedule` | Retrieves BIFFF 2026 schedule. |
| API Route | `GET /api/festival/cannes/awards` | Fetches Cannes 2026 awards. |
| API Route | `GET /api/festival/cannes/films` | Retrieves Cannes 2026 films. |
| API Route | `GET /api/festival/cannes/schedule` | Retrieves Cannes 2026 schedule. |
| API Route | `GET /api/festival/cuff/awards` | Fetches CUFF 2026 awards. |
| API Route | `GET /api/festival/cuff/films` | Retrieves CUFF 2026 films. |
| API Route | `GET /api/festival/cuff/schedule` | Retrieves CUFF 2026 schedule. |
| API Route | `GET /api/festival/fantasia/awards` | Fetches Fantasia 2026 awards. |
| API Route | `GET /api/festival/fantasia/films` | Retrieves Fantasia 2026 films. |
| API Route | `GET /api/festival/fantasia/schedule` | Retrieves Fantasia 2026 schedule. |
| API Route | `GET /api/festival/films-batch` | Fetches films for multiple festivals in a single request. |
| Script | `node scripts/seed_tribeca_2026_awards.cjs` | Seeds Tribeca 2026 festival awards. |

## Core Components
*   `components`: Provides reusable Vue components for UI elements, including cards, carousels, modals, and navigation.
*   `composables`: Offers Vue composables for encapsulating reusable logic, such as consent management.
*   `layouts`: Defines the structural layouts for the application pages, including common navigation and footer elements.
*   `middleware`: Implements Nuxt route middleware for client-side authentication and other global route handling.
*   `mixins`: Contains Vue mixins for sharing common component logic like carousel functionality, data formatting, and infinite scrolling.
*   `pages`: Houses the main application views, each corresponding to a specific route or feature, such as movie details, festival pages, and user profiles.
*   `plugins`: Integrates third-party libraries and custom functionalities into the Nuxt application, like an event bus and lazy loading.
*   `scripts`: Contains utility scripts for data synchronization and database seeding.
*   `server/api`: Defines the backend API endpoints for data retrieval and submission.
*   `server/middleware`: Implements server-side middleware for request processing.
*   `server/plugins`: Integrates server-side plugins into the Nuxt application.
*   `server/routes`: Defines server-side routes for custom endpoints.
*   `server/utils`: Provides server-side utility functions, including database interactions.
*   `services`: Encapsulates business logic for interacting with external services or APIs.
*   `stores`: Manages application state using Pinia.
*   `utils`: Offers client-side utility functions for various common tasks.

## Data Flow
1.  User interacts with the client-side application (e.g., navigates to a movie page).
2.  Vue components in `pages` and `components` dispatch requests to the backend API.
3.  Client-side middleware in `middleware` may intercept requests for authentication checks.
4.  Requests are routed to `server/api` endpoints.
5.  API endpoints in `server/api` interact with the database (e.g., Turso) via `server/utils/db.ts` or fetch data from external sources.
6.  Data is processed and structured by `server/api` and returned to the client.
7.  Client-side `stores` (Pinia) manage the fetched data and application state.
8.  Vue components render the UI based on the data from `stores`.

## External Dependencies
*   `~`: General alias for the project root.
*   `~~`: General alias for the project root.
*   `h3`: HTTP framework for Nuxt server routes.
*   `vue`: Core JavaScript framework for building user interfaces.
*   `@/components`: Alias for internal components.
*   `@libsql/client`: Client for interacting with LibSQL databases (e.g., Turso).
*   `vue-router`: Official router for Vue.js.
*   `@/utils`: Alias for internal utility functions.
*   `fs`: Node.js file system module.
*   `path`: Node.js path module.
*   `pinia`: State management library for Vue.js.
*   `striptags`: Library for stripping HTML tags from strings.
*   `url`: Node.js URL module.
*   `#imports`: Nuxt auto-imports.
*   `dotenv`: Module for loading environment variables from a `.env` file.
