# Architecture

## System Overview

Cinemagoria is a Nuxt.js application designed to help users discover movies and TV shows. It provides detailed information on media, people, production companies, and streaming platforms, alongside curated festival coverage and news. The system leverages a multi-stage Docker build for deployment to Google Cloud Run and uses a Turso database for data storage. Client-side authentication is handled via global middleware, while backend APIs provide data and handle user interactions.

## Entry Points

| Type | Name | Description |
| :-- | :--- | :---------- |
| Web | `/` | The main entry point for the Nuxt.js application, rendering the homepage. |
| API | `POST /api/article-report` | Submits a report about an article. |
| API | `GET /api/article/[slug]` | Retrieves details for a specific article. |
| API | `GET /api/article/rss` | Redirects to the canonical RSS feed. |
| API | `GET /api/articles/by-slugs` | Retrieves multiple articles by a list of slugs. |
| API | `GET /api/awards/index-page` | Retrieves awards data for the awards index page. |
| API | `GET /api/awards/index` | Retrieves award information for a film or person. |
| API | `POST /api/contact` | Submits a contact form message. |
| API | `POST /api/festival-report` | Submits a report about festival data. |
| API | `GET /api/festival/bafici/awards` | Fetches BAFICI 2026 awards data. |
| API | `GET /api/festival/bafici/films` | Fetches BAFICI 2026 film data. |
| API | `GET /api/festival/bafici/schedule` | Retrieves BAFICI 2026 screening schedule. |
| API | `GET /api/festival/berlinale/awards` | Fetches Berlinale 2026 awards data. |
| API | `GET /api/festival/berlinale/films` | Fetches Berlinale 2026 film data. |
| API | `GET /api/festival/berlinale/schedule` | Retrieves Berlinale 2026 screening schedule. |
| API | `GET /api/festival/bifff/awards` | Fetches BIFFF 2026 awards data. |
| API | `GET /api/festival/bifff/films` | Fetches BIFFF 2026 film data. |
| API | `GET /api/festival/bifff/schedule` | Retrieves BIFFF 2026 screening schedule. |
| API | `GET /api/festival/cannes/awards` | Fetches Cannes 2026 awards data. |
| API | `GET /api/festival/cannes/films` | Fetches Cannes 2026 film data. |
| API | `GET /api/festival/cannes/schedule` | Retrieves Cannes 2026 screening schedule. |
| Script | `build` | Builds the Nuxt application for production. |
| Script | `dev` | Starts the Nuxt development server. |
| Script | `generate` | Generates static Nuxt application files. |
| Script | `preview` | Previews the Nuxt production build locally. |
| Script | `postinstall` | Prepares the Nuxt project after installation. |

## Core Components

*   `(root)`: Defines the core Nuxt application, Docker build, and project configuration.
*   `assets`: Manages static assets like images, fonts, and stylesheets.
*   `components`: Houses reusable Vue components for UI elements, cards, carousels, modals, and festival badges.
*   `composables`: Provides reusable Vue composition functions, such as `useConsentGuard`.
*   `layouts`: Defines the structural layouts for different pages, including the default layout.
*   `middleware`: Contains Nuxt middleware functions, like `auth.global.ts` for client-side authentication.
*   `mixins`: Offers reusable Vue mixins for carousel functionality, detail enrichment, data filtering, and utility functions.
*   `pages`: Contains Vue components that define the application's routes and views.
*   `plugins`: Provides Nuxt plugins for global functionality, such as an event bus and lazy loading.
*   `public`: Stores publicly accessible static files, including the PWA manifest and service worker.
*   `scripts`: Contains one-shot and synchronization scripts for data management.
*   `server/api`: Implements backend API endpoints for data retrieval and submission.
*   `server/data`: Stores static data files, such as `awards.json`.
*   `server/middleware`: Contains server-side middleware for API routes.
*   `server/plugins`: Provides server-side Nuxt plugins.
*   `server/routes`: Defines server-side routes.
*   `server/types`: Defines TypeScript types for server-side components.
*   `server/utils`: Provides server-side utility functions, including database interaction.
*   `services`: Contains service-layer logic for interacting with external APIs or data sources.
*   `stores`: Implements Pinia stores for state management.
*   `types`: Defines global TypeScript types.
*   `utils`: Provides client-side utility functions.

## Data Flow

1.  User navigates to a page (e.g., `/movie/[id]`).
2.  Nuxt.js application loads, and `middleware/auth.global.ts` checks for an access token.
3.  Vue components in `pages` (e.g., [pages/movie/[id].vue](../../pages/movie/[id].vue)) initiate data fetching.
4.  Client-side components make requests to `server/api` endpoints (e.g., `/api/movie/[id]`).
5.  `server/api` endpoints (e.g., [server/api/movie/[id].get.ts](../../server/api/imdb-rating/[id].get.ts)) query the Turso database via `server/utils/db.ts`.
6.  Data is retrieved from the database and potentially enriched with external API calls.
7.  The `server/api` endpoint returns the processed data to the client.
8.  Vue components render the data, utilizing `components` for UI, `mixins` for data enrichment, and `stores` for state management.

## External Dependencies

*   `~`: General purpose utilities and components.
*   `~~`: General purpose utilities and components.
*   `h3`: HTTP framework for Nuxt server routes.
*   `vue`: Core JavaScript framework for building user interfaces.
*   `@/components`: Internal components.
*   `@libsql/client`: Client for interacting with the Turso database.
*   `vue-router`: Routing library for Vue.js.
*   `@/utils`: Internal utilities.
*   `fs`: Node.js file system module.
*   `path`: Node.js path module.
*   `pinia`: State management library for Vue.js.
*   `striptags`: Library for stripping HTML tags from strings.
*   `url`: Node.js URL module.
*   `#imports`: Nuxt auto-imports.
*   `dotenv`: Module to load environment variables from a `.env` file.
