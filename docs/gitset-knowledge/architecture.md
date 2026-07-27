# Architecture

## System Overview

Cinemagoria is a Nuxt.js application, version 4.14.0, designed to help users discover movies and TV shows. It integrates with external services for media data and provides features such as user authentication, personalized lists, news feeds, and festival coverage. The application uses a Turso database for custom data and relies on GitHub Actions for automated data synchronization and knowledge base updates.

## Entry Points

| Type | Name | Description |
| :-- | :--- | :---------- |
| Web | `app.vue` | Main application entry point for the Nuxt.js application, setting up global SEO metadata and rendering the primary layout and pages. |
| CLI | `build` | Builds the Nuxt.js application. |
| CLI | `dev` | Runs the Nuxt.js application in development mode. |
| CLI | `generate` | Generates the Nuxt.js application for static deployment. |
| CLI | `preview` | Previews the Nuxt.js application after a build. |
| CLI | `postinstall` | Prepares the Nuxt.js application after installation. |
| Route | `/api/article-report` | Handles POST requests to submit article reports. |
| Route | `/api/article/[slug]` | Handles GET requests for a specific article by slug. |
| Route | `/api/article/rss` | Provides a permanent redirect for the legacy RSS feed endpoint to `/feed`. |
| Route | `/api/articles/by-slugs` | Handles GET requests to retrieve multiple articles based on a comma-separated list of slugs. |
| Route | `/api/awards/index-page` | Handles GET requests for awards data, filtering by award type and year. |
| Route | `/api/awards/index` | Handles GET requests to retrieve award information related to a specific film or person. |
| Route | `/api/contact` | Handles POST requests for the contact form. |
| Route | `/api/festival-report` | Handles POST requests to submit festival reports. |
| Route | `/api/festival/bafici/awards` | Handles GET requests to fetch awards data specifically for the BAFICI 2026 festival. |
| Route | `/api/festival/bafici/films` | API endpoint to fetch BAFICI 2026 film data. |
| Route | `/api/festival/bafici/schedule` | API endpoint to retrieve the BAFICI 2026 festival screening schedule. |
| Route | `/api/festival/berlinale/awards` | API endpoint to fetch awards data for the Berlinale 2026 film festival. |
| Route | `/api/festival/berlinale/films` | API endpoint to fetch Berlinale 2026 film data. |
| Route | `/api/festival/berlinale/schedule` | API endpoint to retrieve the Berlinale 2026 festival screening schedule. |
| Route | `/api/festival/bifff/awards` | API endpoint to fetch awards data for the BIFFF 2026 film festival. |
| Route | `/api/festival/bifff/films` | API endpoint to fetch BIFFF 2026 film data. |
| Route | `/api/festival/bifff/schedule` | API endpoint to retrieve the BIFFF 2026 festival screening schedule. |
| Route | `/api/festival/cannes/awards` | API endpoint to fetch awards data for the Cannes 2026 film festival. |
| Route | `/api/festival/cannes/films` | API endpoint to fetch Cannes 2026 film data. |
| Route | `/api/festival/cannes/schedule` | API endpoint to retrieve the 2026 Cannes Film Festival screening schedule. |
| Route | `/api/festival/cuff/awards` | API endpoint to fetch the awards for the 2026 Calgary Underground Film Festival (CUFF). |
| Route | `/api/festival/cuff/films` | API endpoint to retrieve films for the 2026 Calgary Underground Film Festival (CUFF). |
| Route | `/api/festival/cuff/schedule` | API endpoint to retrieve the 2026 Calgary Underground Film Festival (CUFF) screening schedule. |
| Workflow | `gitset-knowledge.yml` | GitHub Actions workflow to incrementally refresh the project's AI knowledge base. |
| Workflow | `sync-hero-data.yml` | Automates the synchronization of hero and noir enrichment data. |
| Workflow | `sync-noir-historical.yml` | Automates the synchronization of N.O.I.R historical data and regenerates noir enrichment data. |

## Core Components

*   `.github`: Manages GitHub-specific configurations and workflows.
*   `(root)`: Contains core application files, including the main Nuxt.js configuration, Docker setup, and the primary Vue application entry.
*   `assets`: Stores static assets like images, fonts, and stylesheets.
*   `components`: Houses reusable Vue components for UI elements, content display, and interactive features.
*   `composables`: Provides reusable Vue composition functions for logic and stateful operations.
*   `docs`: Contains project documentation.
*   `layouts`: Defines the structural layouts for different sections of the application.
*   `middleware`: Implements Nuxt.js middleware for route protection and global logic.
*   `mixins`: Offers reusable Vue mixins for common functionalities across components.
*   `pages`: Contains Vue components that define the application's routes and views.
*   `plugins`: Provides Nuxt.js plugins for extending application functionality, such as an event bus and lazy loading.
*   `public`: Serves static files directly, including the web app manifest and a self-destroying service worker.
*   `scripts`: Contains one-shot and synchronization scripts for data management.
*   `server/api`: Implements API endpoints for data retrieval and submission.
*   `server/data`: Stores static data files used by the server.
*   `server/middleware`: Implements server-side middleware for API routes.
*   `server/plugins`: Provides server-side Nuxt.js plugins.
*   `server/routes`: Defines server-side routes.
*   `server/types`: Contains TypeScript type definitions for server-side code.
*   `server/utils`: Provides utility functions for server-side operations, including database interactions.
*   `services`: Encapsulates logic for interacting with external services.
*   `stores`: Manages application state using Pinia.
*   `types`: Contains TypeScript type definitions for client-side code.
*   `utils`: Provides general utility functions for client-side operations.

## Data Flow

1.  User interacts with the frontend application ([app.vue](../../app.vue)).
2.  Frontend components in [components/](../../components/) dispatch actions or make API requests.
3.  Nuxt.js [middleware/auth.global.ts](../../middleware/auth.global.ts) checks for client-side authentication.
4.  API requests are routed to `server/api` endpoints (e.g., [server/api/article/[slug].get.ts](../../server/api/article/[slug].get.ts)).
5.  Server-side API endpoints interact with the database (e.g., Turso) via `server/utils/db.ts` or fetch data from `server/data/awards.json`.
6.  Data is processed and returned to the frontend.
7.  Frontend components update the UI based on the received data, potentially using Pinia stores ([stores/](../../stores/)) for state management.
8.  GitHub Actions workflows ([.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml), [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml)) periodically synchronize data from the Turso database using scripts in [scripts/](../../scripts/).
9.  Synchronized data is committed to the repository, making it available for the application.

## External Dependencies

*   `~`: General purpose utility library (414 imports).
*   `~~`: General purpose utility library (55 imports).
*   `h3`: HTTP framework for Nuxt.js server routes (50 imports).
*   `vue`: Core JavaScript framework for building user interfaces (44 imports).
*   `@/components`: Internal alias for components module (27 imports).
*   `@libsql/client`: Client for LibSQL database (16 imports).
*   `vue-router`: Official router for Vue.js (9 imports).
*   `@/utils`: Internal alias for utils module (4 imports).
*   `fs`: Node.js file system module (4 imports).
*   `path`: Node.js path module (4 imports).
*   `pinia`: The intuitive store for Vue.js (4 imports).
*   `striptags`: Strips HTML tags from strings (4 imports).
*   `url`: Node.js URL module (4 imports).
*   `#imports`: Nuxt.js auto-imports (3 imports).
*   `dotenv`: Loads environment variables from a `.env` file (3 imports).
