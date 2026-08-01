# Architecture

## System Overview
Cinemagoria is a Nuxt.js application, version 4.15.0, designed to help users discover movies and TV shows. It provides a rich user interface with features like content discovery, personalized lists, progress tracking, and festival coverage. The system leverages a server-side API for data retrieval and user interactions, backed by a Turso database. Client-side authentication is handled via local storage, while actual data protection is managed by the backend. The application is deployed to Google Cloud Run using Docker and Google Cloud Build.

## Entry Points
The application provides several entry points:

| Type | Name | Description |
|---|---|---|
| Web | `/` | The main web interface, served by the Nuxt.js application. |
| Script | `build` | Builds the Nuxt application for production. |
| Script | `dev` | Starts the Nuxt development server. |
| Script | `generate` | Generates the Nuxt application for static hosting. |
| Script | `preview` | Locally previews the Nuxt build. |
| Script | `postinstall` | Prepares the Nuxt project after installation. |
| Script | `node scripts/seed_tribeca_2026_awards.cjs` | Seeds the `festival_awards` table with Tribeca 2026 award winners. |
| API Route | `POST /api/article-report` | Submits an article report. |
| API Route | `GET /api/article/[slug]` | Retrieves a specific article by slug. |
| API Route | `GET /api/article/rss` | Redirects to the canonical RSS feed URL. |
| API Route | `GET /api/articles/by-slugs` | Retrieves multiple articles by slugs. |
| API Route | `GET /api/awards/index-page` | Retrieves awards data for the index page. |
| API Route | `GET /api/awards/index` | Retrieves award information for a film or person. |
| API Route | `POST /api/contact` | Submits a contact form message. |
| API Route | `POST /api/festival-report` | Submits a festival data report. |
| API Route | `GET /api/festival/bafici/awards` | Fetches BAFICI 2026 awards data. |
| API Route | `GET /api/festival/bafici/films` | Fetches BAFICI 2026 film data. |
| API Route | `GET /api/festival/bafici/schedule` | Retrieves BAFICI 2026 screening schedule. |
| API Route | `GET /api/festival/berlinale/awards` | Fetches Berlinale 2026 awards data. |
| API Route | `GET /api/festival/berlinale/films` | Fetches Berlinale 2026 film data. |
| API Route | `GET /api/festival/berlinale/schedule` | Retrieves Berlinale 2026 screening schedule. |
| API Route | `GET /api/festival/bifff/awards` | Fetches BIFFF 2026 awards data. |
| API Route | `GET /api/festival/bifff/films` | Fetches BIFFF 2026 film data. |
| API Route | `GET /api/festival/bifff/schedule` | Retrieves BIFFF 2026 screening schedule. |
| API Route | `GET /api/festival/cannes/awards` | Fetches Cannes 2026 awards data. |
| API Route | `GET /api/festival/cannes/films` | Fetches Cannes 2026 film data. |
| API Route | `GET /api/festival/cannes/schedule` | Retrieves Cannes 2026 screening schedule. |
| CI Workflow | [.github/workflows/gitset-knowledge.yml](../../.github/workflows/gitset-knowledge.yml) | Refreshes the AI knowledge base. |
| CI Workflow | [.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml) | Synchronizes hero and noir enrichment data. |
| CI Workflow | [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml) | Synchronizes N.O.I.R historical data. |

## Core Components
*   `(root)`: Defines the main Nuxt application structure, including the root Vue component, Docker configuration, and Nuxt settings.
*   `components`: Houses reusable Vue components for UI elements, content display (cards, carousels), modals, and festival-specific badges and banners.
*   `composables`: Provides Vue composables for shared logic, such as consent management.
*   `layouts`: Defines the default application layout, including navigation, footer, and modals.
*   `middleware`: Contains Nuxt middleware for client-side authentication and route protection.
*   `mixins`: Offers Vue mixins for common functionalities like carousel management, data enrichment, filtering, and utility functions.
*   `pages`: Contains Vue components for all application routes, including discovery, detail pages for movies/TV/people, festival coverage, news, and user-specific pages.
*   `plugins`: Provides Nuxt plugins for global functionalities like an event bus and lazy loading.
*   `public`: Stores static assets and the PWA manifest and service worker.
*   `scripts`: Contains one-shot and synchronization scripts for database seeding and data generation.
*   `server/api`: Implements server-side API endpoints for data retrieval, user interactions, and festival-specific data.
*   `server/middleware`: Contains server-side middleware for API request processing.
*   `server/plugins`: Provides server-side Nuxt plugins.
*   `server/routes`: Defines server-side routes.
*   `server/types`: Defines TypeScript types for server-side data structures.
*   `server/utils`: Provides server-side utility functions, including database interaction.
*   `services`: Contains service-layer logic for interacting with external APIs or data sources.
*   `stores`: Manages application state using Pinia.
*   `types`: Defines shared TypeScript types.
*   `utils`: Provides client-side utility functions.

## Data Flow
1.  User interacts with the client-side application (e.g., navigates to a page, performs a search).
2.  Vue components and Nuxt pages dispatch actions or make API calls to the server.
3.  Nuxt server-side API routes (`server/api`) receive requests.
4.  API routes interact with the database (e.g., Turso) or external services via `server/utils` and `services` modules.
5.  Data is retrieved, processed, and returned to the client.
6.  Client-side Vue components render the received data.
7.  User authentication state is managed in `localStorage` by `middleware/auth.global.ts`.
8.  Background scripts (`scripts`) synchronize data from the Turso database to JSON files.

## External Dependencies
*   `~`: General purpose utilities and components.
*   `~~`: General purpose utilities and components.
*   `h3`: HTTP framework for Nuxt server routes.
*   `vue`: Core JavaScript framework for building user interfaces.
*   `@/components`: Internal components.
*   `@libsql/client`: Client for interacting with the Turso database.
*   `vue-router`: Vue's official router for navigation.
*   `@/utils`: Internal utilities.
*   `fs`: Node.js file system module.
*   `path`: Node.js path module.
*   `pinia`: Vuex-like state management library for Vue.
*   `striptags`: Library for stripping HTML tags from strings.
*   `url`: Node.js URL module.
*   `#imports`: Nuxt auto-imports.
*   `dotenv`: Loads environment variables from a `.env` file.
