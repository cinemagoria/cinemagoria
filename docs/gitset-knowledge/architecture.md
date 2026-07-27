# Cinemagoria Architecture

## System Overview

Cinemagoria is a Nuxt.js application, version 4.14.0, designed for discovering movies and TV shows. It integrates with various film festivals and provides user-centric features like watchlists, custom lists, and progress tracking. The system leverages a server-side API for data retrieval and user interactions, backed by a Turso database. Deployment is managed via Google Cloud Build and Docker.

## Entry Points

| Type | Name | Description |
|---|---|---|
| Web | `/` | Main application entry point, rendering the primary layout and pages. |
| CLI | `nuxt build` | Builds the Nuxt.js application for production. |
| CLI | `nuxt dev` | Runs the Nuxt.js application in development mode. |
| CLI | `nuxt generate` | Generates a static Nuxt.js application. |
| CLI | `nuxt preview` | Previews the Nuxt.js application after a build. |
| CLI | `nuxt prepare` | Prepares the Nuxt.js project for development or build. |
| API | `/api/*` | Server-side API endpoints for data operations and user interactions. |
| Workflow | `gitset-knowledge` | GitHub Actions workflow to refresh the AI knowledge base. |
| Workflow | `sync-hero-data` | GitHub Actions workflow to synchronize hero selection data. |
| Workflow | `sync-noir-historical` | GitHub Actions workflow to synchronize N.O.I.R historical data. |
| Script | `node scripts/seed_tribeca_2026_awards.cjs` | Seeds the `festival_awards` table with Tribeca Festival award winners. |

## Core Components

*   **app.vue**: Main application entry point, setting up global SEO metadata and rendering the primary layout.
*   **components**: Houses reusable Vue components for UI elements like cards, carousels, modals, and navigation.
*   **composables**: Provides reusable Vue composition functions, such as `useConsentGuard` for managing cookie consent.
*   **layouts**: Defines application layouts, with `default.vue` serving as the primary layout for navigation, search, and modals.
*   **middleware**: Contains Nuxt.js middleware, including `auth.global.ts` for client-side authentication checks.
*   **mixins**: Offers reusable Vue mixins for carousel functionality, media details, data formatting, and utility functions.
*   **pages**: Defines the various routes and views of the application, including discovery pages, festival pages, user profiles, and settings.
*   **plugins**: Nuxt.js plugins for global functionalities like an event bus (`bus.js`) and a lazyload directive (`lazyload.js`).
*   **public**: Contains static assets and the web app manifest (`manifest.json`) and a self-destroying service worker (`sw.js`).
*   **scripts**: Utility scripts for data synchronization and database seeding.
*   **server/api**: Handles server-side API routes for all data interactions, including articles, awards, festivals, and user data.
*   **server/middleware**: Server-side middleware for request processing.
*   **server/plugins**: Server-side plugins.
*   **server/routes**: Defines server-side routes, including sitemap and RSS feed generation.
*   **server/utils**: Server-side utility functions, including database interactions (`db.ts`).
*   **services**: Contains service-layer logic for interacting with external APIs or business logic.
*   **stores**: Manages application state using Pinia.
*   **utils**: Client-side utility functions.

## Data Flow

1.  User navigates to a page (e.g., `/movie/category/popular`).
2.  Nuxt.js application renders the page using Vue components and layouts.
3.  Components make API calls to `/api/*` endpoints to fetch data (e.g., movie lists).
4.  Server-side API routes (in `server/api`) process requests, often interacting with the Turso database.
5.  Data is retrieved from the database or external sources and returned to the client.
6.  Client-side components update to display the fetched data.
7.  User interactions (e.g., favoriting a movie) trigger further API calls to update data.
8.  Server-side scripts (e.g., `scripts/syncHeroData.js`) periodically synchronize data into JSON files for public consumption.

## External Dependencies

*   `~`: General alias for project root imports.
*   `~~`: General alias for project root imports.
*   `h3`: HTTP framework for the server routes.
*   `vue`: Core JavaScript framework for building user interfaces.
*   `@/components`: Alias for importing components.
*   `@libsql/client`: Client for interacting with the Turso database.
*   `vue-router`: Official router for Vue.js.
*   `@/utils`: Alias for importing client-side utility functions.
*   `fs`: Node.js file system module.
*   `path`: Node.js path module.
*   `pinia`: State management library for Vue.js.
*   `striptags`: Library for stripping HTML tags from strings.
*   `url`: Node.js URL module.
*   `#imports`: Nuxt.js auto-imports.
*   `dotenv`: Module to load environment variables from a `.env` file.
