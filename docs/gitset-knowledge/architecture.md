# Architecture

## System Overview
Cinemagoria is a Nuxt.js application, version 4.14.0, designed to help users discover movies and TV shows. It provides a rich user interface for browsing, searching, and managing personal watchlists and lists, integrating with various film festivals and external media databases. The system uses a serverless architecture for its API endpoints and leverages a Turso database for data storage. Deployment is managed via Google Cloud Build and Docker.

## Entry Points
The application has several entry points:

| Type | Name | Description |
|---|---|---|
| Web App | `app.vue` | Main application entry point for the Nuxt.js application, setting up global SEO metadata and rendering the primary layout and pages. |
| CLI Script | `build` | Builds the Nuxt.js application for production. |
| CLI Script | `dev` | Starts the Nuxt.js development server. |
| CLI Script | `generate` | Generates the Nuxt.js application as static files. |
| CLI Script | `preview` | Previews the Nuxt.js application after a build. |
| CLI Script | `postinstall` | Prepares the Nuxt.js application after installation. |
| API Route | `/api/article-report` | Handles POST requests to submit article reports. |
| API Route | `/api/article/[slug]` | Handles GET requests for a specific article by slug. |
| API Route | `/api/article/rss` | Provides a permanent redirect for the legacy RSS feed endpoint to `/feed`. |
| API Route | `/api/articles/by-slugs` | Handles GET requests to retrieve multiple articles based on a comma-separated list of slugs. |
| API Route | `/api/awards/index-page` | Handles GET requests for awards data, filtering by award type and year. |
| API Route | `/api/awards/index` | Handles GET requests to retrieve award information related to a specific film or person. |
| API Route | `/api/contact` | Handles POST requests for the contact form. |
| API Route | `/api/festival-report` | Handles POST requests to submit festival reports. |
| API Route | `/api/festival/bafici/awards` | Handles GET requests to fetch awards data specifically for the BAFICI 2026 festival. |
| API Route | `/api/festival/bafici/films` | API endpoint to fetch BAFICI 2026 film data. |
| API Route | `/api/festival/bafici/schedule` | API endpoint to retrieve the BAFICI 2026 festival screening schedule. |
| API Route | `/api/festival/berlinale/awards` | API endpoint to fetch awards data for the Berlinale 2026 film festival. |
| API Route | `/api/festival/berlinale/films` | API endpoint to fetch Berlinale 2026 film data. |
| API Route | `/api/festival/berlinale/schedule` | API endpoint to retrieve the Berlinale 2026 festival screening schedule. |
| API Route | `/api/festival/bifff/awards` | API endpoint to fetch awards data for the BIFFF 2026 film festival. |
| API Route | `/api/festival/bifff/films` | API endpoint to fetch BIFFF 2026 film data. |
| API Route | `/api/festival/bifff/schedule` | API endpoint to retrieve the BIFFF 2026 festival screening schedule. |
| API Route | `/api/festival/cannes/awards` | API endpoint to fetch awards data for the Cannes 2026 film festival. |
| API Route | `/api/festival/cannes/films` | API endpoint to fetch Cannes 2026 film data. |
| API Route | `/api/festival/cannes/schedule` | API endpoint to retrieve the 2026 Cannes Film Festival screening schedule. |
| API Route | `/api/festival/cuff/awards` | API endpoint to fetch the awards for the 2026 Calgary Underground Film Festival (CUFF). |

## Core Components
*   `.github`: Contains GitHub Actions workflows for CI/CD and data synchronization.
*   `assets`: Stores static assets like images and stylesheets.
*   `components`: Houses reusable Vue components for UI elements, cards, carousels, modals, and navigation.
*   `composables`: Provides Vue composables for reactive logic and state management.
*   `docs`: Contains project documentation.
*   `layouts`: Defines application layouts, such as the default layout with navigation and footer.
*   `middleware`: Implements Nuxt.js middleware for route protection and global logic.
*   `mixins`: Offers Vue mixins for common functionalities like carousel management, data formatting, and utility functions.
*   `pages`: Defines the application's routes and corresponding page components.
*   `plugins`: Integrates third-party libraries and provides global functionalities.
*   `public`: Serves static files directly, including the web app manifest and service worker.
*   `scripts`: Contains one-shot and synchronization scripts for data management.
*   `server/api`: Implements API endpoints for data retrieval and submission.
*   `server/data`: Stores static data, such as `awards.json`.
*   `server/middleware`: Defines server-side middleware for API routes.
*   `server/plugins`: Provides server-side Nuxt plugins.
*   `server/routes`: Defines server-side routes.
*   `server/types`: Contains TypeScript type definitions for server-side code.
*   `server/utils`: Provides server-side utility functions, including database interaction.
*   `services`: Contains service-layer logic for interacting with external APIs or databases.
*   `stores`: Manages application state using Pinia.
*   `types`: Contains TypeScript type definitions for client-side code.
*   `utils`: Provides client-side utility functions.

## Data Flow
1.  User interacts with the client-side application (e.g., navigates to a page, performs a search).
2.  Vue components in `components` and `pages` dispatch actions or make API calls.
3.  Client-side `middleware` (e.g., [middleware/auth.global.ts](../../middleware/auth.global.ts)) may intercept requests for authentication.
4.  API requests are routed to `server/api` endpoints.
5.  Server-side `server/middleware` may process requests before reaching the API handler.
6.  API handlers in `server/api` interact with the database (e.g., via [server/utils/db.ts](../../server/utils/db.ts)) or static data (e.g., [server/data/awards.json](../../server/data/awards.json)).
7.  Data is retrieved, processed, and returned to the client.
8.  Client-side `stores` (Pinia) update the application state.
9.  Vue components react to state changes and re-render the UI.

## External Dependencies
*   `~`: General utility library.
*   `~~`: General utility library.
*   `h3`: HTTP framework for building API routes.
*   `vue`: Core JavaScript framework for building user interfaces.
*   `@/components`: Internal alias for components module.
*   `@libsql/client`: Client for interacting with the Turso database.
*   `vue-router`: Official router for Vue.js.
*   `@/utils`: Internal alias for client-side utilities.
*   `fs`: Node.js file system module.
*   `path`: Node.js path module.
*   `pinia`: The official state management library for Vue.js.
*   `striptags`: Library for stripping HTML tags from strings.
*   `url`: Node.js URL module.
*   `#imports`: Nuxt.js auto-imports.
*   `dotenv`: Module to load environment variables from a `.env` file.
