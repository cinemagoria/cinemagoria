# Architecture

## System Overview
Cinemagoria is a Nuxt.js application, version 4.16.0, designed to help users discover movies and TV shows. It provides a rich user interface for browsing content, managing watchlists, tracking progress, and exploring festival information. The application leverages a multi-stage Docker build process for deployment to Google Cloud Run and uses Turso as its primary database backend. Key features include content discovery, personalized lists, festival coverage (e.g., Cannes, Sundance), news articles, and user authentication.

## Entry Points
The application's primary entry points are:

*   **Web Interface**: Accessed via the main Nuxt.js application, defined by [app.vue](../../app.vue) and configured by [nuxt.config.ts](../../nuxt.config.ts).
*   **API Endpoints**: Handled by the `server/api` module, which registers various GET and POST routes for data retrieval and submission.
*   **CLI Scripts**: Executed via `package.json` scripts:
    *   `build`: `nuxt build`
    *   `dev`: `nuxt dev`
    *   `generate`: `nuxt generate`
    *   `preview`: `nuxt preview`
    *   `postinstall`: `nuxt prepare`
*   **CI Workflows**: Triggered by GitHub Actions for specific tasks:
    *   `gitset-knowledge.yml`: Refreshes the AI knowledge base.
    *   `sync-hero-data.yml`: Synchronizes hero enrichment data.
    *   `sync-noir-historical.yml`: Synchronizes N.O.I.R historical data.

## Core Components
*   `.github`: Manages GitHub-specific configurations, including funding and CI workflows.
*   `assets`: Stores static assets like images, fonts, and stylesheets.
*   `components`: Contains reusable Vue components for UI elements, content display (e.g., cards, carousels), and modals.
*   `composables`: Provides reusable Vue composition functions for managing state and logic (e.g., consent, discovery queries).
*   `layouts`: Defines the structural layouts for different pages of the application.
*   `middleware`: Implements Nuxt route middleware for client-side authentication and other global logic.
*   `mixins`: Offers reusable Vue mixins for common functionalities like carousel management, data enrichment, and utility functions.
*   `pages`: Contains the main Vue page components, defining the application's routes and views.
*   `plugins`: Registers Nuxt plugins for global functionalities like an event bus and lazy loading.
*   `public`: Serves static files directly, including the web application manifest and a self-destroying service worker.
*   `scripts`: Houses one-shot and synchronization scripts for database seeding and data generation.
*   `server/api`: Defines the backend API endpoints for data fetching and submission.
*   `server/middleware`: Implements server-side Nuxt middleware.
*   `server/plugins`: Registers server-side Nuxt plugins.
*   `server/routes`: Defines custom server routes.
*   `server/types`: Contains TypeScript type definitions for server-side code.
*   `server/utils`: Provides utility functions for server-side operations, including database interactions.
*   `services`: Encapsulates business logic for interacting with external APIs or data sources.
*   `stores`: Manages application state using Pinia.
*   `types`: Contains global TypeScript type definitions.
*   `utils`: Provides client-side utility functions.

## Data Flow
1.  User interacts with the Nuxt.js frontend, triggering a data request.
2.  Frontend components (e.g., `components/discover/DiscoverHub.vue`, `pages/movie/[id].vue`) use composables or directly call API endpoints.
3.  Client-side requests are routed to `server/api` endpoints (e.g., `/api/movie/[id].get.ts`, `/api/discover/movie.get.ts`).
4.  Server-side API handlers in `server/api` utilize `server/utils` (e.g., `server/utils/db.ts`) to interact with the Turso database.
5.  Data is retrieved from the database or external services.
6.  Server-side API handlers process and format the data.
7.  Formatted data is returned to the client.
8.  Frontend components render the data, updating the UI.

## External Dependencies
*   `~`: General alias for the project root.
*   `~~`: General alias for the project root.
*   `h3`: HTTP framework used by Nuxt.
*   `vue`: Core JavaScript framework.
*   `@/components`: Alias for the `components` module.
*   `@libsql/client`: Client for interacting with the Turso database.
*   `vue-router`: Routing library for Vue.
*   `@/utils`: Alias for the `utils` module.
*   `fs`: Node.js file system module.
*   `path`: Node.js path module.
*   `pinia`: State management library for Vue.
*   `striptags`: Library for stripping HTML tags.
*   `url`: Node.js URL module.
*   `#imports`: Nuxt auto-imports.
*   `dotenv`: Library for loading environment variables.
