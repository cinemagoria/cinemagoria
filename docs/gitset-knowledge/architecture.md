# Architecture

## System Overview

Cinemagoria is a Nuxt.js application, version 4.15.0, designed to help users discover movies and TV shows. It provides features such as content discovery, user authentication, personalized lists, progress tracking, and festival coverage. The application leverages a multi-stage Docker build for deployment to Google Cloud Run and uses Turso for database interactions. GitHub Actions automate CI/CD tasks, including knowledge base refreshing and data synchronization.

## Entry Points

The application provides the following entry points:

| Type | Name | Description |
| :-- | :-- | :-- |
| Script | `build` | Builds the Nuxt application for production. |
| Script | `dev` | Starts the Nuxt development server. |
| Script | `generate` | Generates the Nuxt application as static files. |
| Script | `preview` | Previews the Nuxt production build. |
| Script | `postinstall` | Prepares the Nuxt project after installation. |
| Route | `GET /api/article-report` | Handles POST requests to submit article reports. |
| Route | `GET /api/article/[slug]` | Retrieves a specific article by slug. |
| Route | `GET /api/article/rss` | Redirects to the canonical RSS feed endpoint. |
| Route | `GET /api/articles/by-slugs` | Retrieves multiple articles by a list of slugs. |
| Route | `GET /api/awards/index-page` | Retrieves awards data for the index page, filtered by type and year. |
| Route | `GET /api/awards/index` | Retrieves award information for a film or person. |
| Route | `POST /api/contact` | Handles contact form submissions. |
| Route | `POST /api/festival-report` | Handles POST requests to submit festival reports. |
| Route | `GET /api/festival/bafici/awards` | Fetches awards data for BAFICI 2026. |
| Route | `GET /api/festival/bafici/films` | Fetches BAFICI 2026 film data. |
| Route | `GET /api/festival/bafici/schedule` | Retrieves BAFICI 2026 screening schedule. |
| Route | `GET /api/festival/berlinale/awards` | Fetches awards data for Berlinale 2026. |
| Route | `GET /api/festival/berlinale/films` | Fetches Berlinale 2026 film data. |
| Route | `GET /api/festival/berlinale/schedule` | Retrieves Berlinale 2026 screening schedule. |
| Route | `GET /api/festival/bifff/awards` | Fetches awards data for BIFFF 2026. |
| Route | `GET /api/festival/bifff/films` | Fetches BIFFF 2026 film data. |
| Route | `GET /api/festival/bifff/schedule` | Retrieves BIFFF 2026 screening schedule. |
| Route | `GET /api/festival/cannes/awards` | Fetches awards data for Cannes 2026. |
| Route | `GET /api/festival/cannes/films` | Fetches Cannes 2026 film data. |
| Route | `GET /api/festival/cannes/schedule` | Retrieves Cannes 2026 screening schedule. |
| Route | `GET /api/festival/cuff/awards` | Fetches awards data for CUFF 2026. |
| Route | `GET /api/festival/cuff/films` | Fetches CUFF 2026 film data. |
| Route | `GET /api/festival/cuff/schedule` | Retrieves CUFF 2026 screening schedule. |
| Route | `GET /api/festival/fantasia/awards` | Fetches awards data for Fantasia 2026. |
| Route | `GET /api/festival/fantasia/films` | Fetches Fantasia 2026 film data. |
| Route | `GET /api/festival/fantasia/schedule` | Retrieves Fantasia 2026 screening schedule. |
| Route | `GET /api/festival/frightfest/awards` | Fetches awards data for FrightFest 2026. |
| Route | `GET /api/festival/frightfest/films` | Fetches FrightFest 2026 film data. |
| Route | `GET /api/festival/frightfest/schedule` | Retrieves FrightFest 2026 screening schedule. |
| Route | `GET /api/festival/kviff/awards` | Fetches awards data for KVIFF 2026. |
| Route | `GET /api/festival/kviff/films` | Fetches KVIFF 2026 film data. |
| Route | `GET /api/festival/kviff/schedule` | Retrieves KVIFF 2026 screening schedule. |
| Route | `GET /api/festival/romford/awards` | Fetches awards data for Romford 2026. |
| Route | `GET /api/festival/romford/films` | Fetches Romford 2026 film data. |
| Route | `GET /api/festival/romford/schedule` | Retrieves Romford 2026 screening schedule. |
| Route | `GET /api/festival/rotterdam/awards` | Fetches awards data for Rotterdam 2026. |
| Route | `GET /api/festival/rotterdam/films` | Fetches Rotterdam 2026 film data. |
| Route | `GET /api/festival/rotterdam/schedule` | Retrieves Rotterdam 2026 screening schedule. |
| Route | `GET /api/festival/slamdance/awards` | Fetches awards data for Slamdance 2026. |
| Route | `GET /api/festival/slamdance/films` | Fetches Slamdance 2026 film data. |
| Route | `GET /api/festival/slamdance/schedule` | Retrieves Slamdance 2026 screening schedule. |
| Route | `GET /api/festival/sundance/awards` | Fetches awards data for Sundance 2026. |
| Route | `GET /api/festival/sundance/films` | Fetches Sundance 2026 film data. |
| Route | `GET /api/festival/sundance/schedule` | Retrieves Sundance 2026 screening schedule. |
| Route | `GET /api/festival/sxsw/awards` | Fetches awards data for SXSW 2026. |
| Route | `GET /api/festival/sxsw/films` | Fetches SXSW 2026 film data. |
| Route | `GET /api/festival/sxsw/schedule` | Retrieves SXSW 2026 screening schedule. |
| Route | `GET /api/festival/tiff/awards` | Fetches awards data for TIFF 2026. |
| Route | `GET /api/festival/tiff/films` | Fetches TIFF 2026 film data. |
| Route | `GET /api/festival/tiff/schedule` | Retrieves TIFF 2026 screening schedule. |
| Route | `GET /api/festival/tribeca/awards` | Fetches awards data for Tribeca 2026. |
| Route | `GET /api/festival/tribeca/films` | Fetches Tribeca 2026 film data. |
| Route | `GET /api/festival/tribeca/schedule` | Retrieves Tribeca 2026 screening schedule. |
| Route | `GET /api/festival/venice/awards` | Fetches awards data for Venice 2026. |
| Route | `GET /api/festival/venice/films` | Fetches Venice 2026 film data. |
| Route | `GET /api/festival/venice/schedule` | Retrieves Venice 2026 screening schedule. |
| Route | `GET /api/feed` | Generates an RSS feed of articles. |
| Route | `GET /api/hero-selections` | Retrieves hero selection data. |
| Route | `GET /api/list/[slug]` | Retrieves a specific user-created list. |
| Route | `POST /api/list/[slug]` | Updates a specific user-created list. |
| Route | `DELETE /api/list/[slug]` | Deletes a specific user-created list. |
| Route | `GET /api/lists` | Retrieves all user-created lists. |
| Route | `POST /api/lists` | Creates a new user-created list. |
| Route | `GET /api/media/awards` | Retrieves awards for a specific media item. |
| Route | `GET /api/media/credits` | Retrieves credits for a specific media item. |
| Route | `GET /api/media/external-links` | Retrieves external links for a specific media item. |
| Route | `GET /api/media/images` | Retrieves images for a specific media item. |
| Route | `GET /api/media/providers` | Retrieves streaming providers for a specific media item. |
| Route | `GET /api/media/recommendations` | Retrieves recommendations for a specific media item. |
| Route | `GET /api/media/related-articles` | Retrieves related articles for a specific media item. |
| Route | `GET /api/media/soundtracks` | Retrieves soundtracks for a specific media item. |
| Route | `GET /api/media/videos` | Retrieves videos for a specific media item. |
| Route | `GET /api/movie/category/[name]` | Retrieves movies by category. |
| Route | `GET /api/movie/discover` | Discovers movies based on various filters. |
| Route | `GET /api/movie/followed` | Retrieves movies from followed production companies and streaming platforms. |
| Route | `GET /api/movie/[id]` | Retrieves details for a specific movie. |
| Route | `GET /api/news` | Retrieves news articles, with filtering and search options. |
| Route | `GET /api/noir-historical` | Retrieves noir historical data. |
| Route | `GET /api/notifications` | Retrieves user notifications. |
| Route | `GET /api/person/[id]` | Retrieves details for a specific person. |
| Route | `GET /api/production-companies` | Retrieves a list of production companies. |
| Route | `GET /api/production/[slug]` | Retrieves details for a specific production company. |
| Route | `GET /api/search` | Performs a global search across various content types. |
| Route | `GET /api/streaming-services` | Retrieves a list of streaming services. |
| Route | `GET /api/streaming/[slug]` | Retrieves details for a specific streaming platform. |
| Route | `GET /api/tv/category/[name]` | Retrieves TV shows by category. |
| Route | `GET /api/tv/discover` | Discovers TV shows based on various filters. |
| Route | `GET /api/tv/followed` | Retrieves TV shows from followed streaming platforms. |
| Route | `GET /api/tv/episodes/[id]` | Retrieves episodes for a specific TV show. |
| Route | `GET /api/tv/[id]` | Retrieves details for a specific TV show. |
| Route | `GET /api/user/profile/[alias]` | Retrieves a user's public profile. |
| Route | `GET /api/user/settings` | Retrieves user settings. |
| Route | `POST /api/user/settings` | Updates user settings. |
| Route | `DELETE /api/user/settings` | Deletes a user account. |
| Route | `GET /api/watchlist` | Retrieves a user's watchlist. |
| Route | `POST /api/watchlist` | Adds an item to the watchlist. |
| Route | `DELETE /api/watchlist` | Removes an item from the watchlist. |
| Route | `GET /api/youtube-oembed` | Retrieves YouTube oEmbed data. |
| Route | `GET /api/youtube-search` | Searches YouTube for videos. |
| Route | `GET /api/youtube-video` | Retrieves details for a specific YouTube video. |
| Route | `GET /feed` | Generates an RSS feed of articles. |
| Route | `GET /sitemap.xml` | Generates the sitemap. |
| Route | `GET /sitemap/articles.xml` | Generates the sitemap for articles. |
| Route | `GET /sitemap/movies.xml` | Generates the sitemap for movies. |
| Route | `GET /sitemap/people.xml` | Generates the sitemap for people. |
| Route | `GET /sitemap/tv.xml` | Generates the sitemap for TV shows. |

## Core Components

*   `(root)`: Defines the main Nuxt application, including configuration, Docker setup, and the root Vue component.
*   `assets`: Contains static assets like images, fonts, or stylesheets.
*   `components`: Houses reusable Vue components for UI elements, content display, and interactive features.
*   `composables`: Provides reusable Vue composition functions for logic and stateful operations.
*   `docs`: Contains project documentation.
*   `layouts`: Defines application layouts, such as the default layout with navigation and modals.
*   `middleware`: Implements Nuxt route middleware for global logic like authentication checks.
*   `mixins`: Offers reusable Vue mixins for common properties and methods across components.
*   `pages`: Defines the application's routes and corresponding Vue page components.
*   `plugins`: Integrates Nuxt plugins for global functionalities like an event bus or lazy loading.
*   `public`: Stores publicly accessible static files, including the web app manifest and service worker.
*   `scripts`: Contains utility scripts for data seeding and synchronization with the database.
*   `server/api`: Implements API endpoints for data retrieval and submission.
*   `server/data`: Stores static data files, such as awards information.
*   `server/middleware`: Implements server-side Nuxt middleware for request processing.
*   `server/plugins`: Integrates server-side Nuxt plugins.
*   `server/routes`: Defines server routes for specific functionalities like RSS feeds and sitemaps.
*   `server/types`: Contains TypeScript type definitions for server-side code.
*   `server/utils`: Provides server-side utility functions, including database interactions.
*   `services`: Contains service modules for interacting with external APIs or data sources.
*   `stores`: Implements Pinia stores for centralized state management.
*   `types`: Contains TypeScript type definitions for client-side code.
*   `utils`: Provides client-side utility functions.

## Data Flow

1.  User interacts with the client-side Nuxt application (e.g., navigates to a page, submits a form).
2.  Vue components in `components` and `pages` dispatch actions or make API calls.
3.  Client-side `composables`, `mixins`, or `stores` may process data or trigger further actions.
4.  Nuxt `middleware` (e.g., `middleware/auth.global.ts`) intercepts routes for client-side authentication checks.
5.  API requests are sent to `server/api` endpoints (e.g., `server/api/movie/[id].vue`).
6.  Server-side `server/middleware` processes incoming requests before API handlers.
7.  API handlers in `server/api` use `server/utils` (e.g., `server/utils/db.ts`) to interact with the database.
8.  Data is retrieved from or stored in the database (Turso).
9.  API handlers return processed data to the client.
10. Client-side components update the UI based on the received data.

## External Dependencies

*   `~`: General alias for project root imports.
*   `~~`: General alias for project root imports.
*   `h3`: HTTP framework for building API routes.
*   `vue`: Core JavaScript framework for building user interfaces.
*   `@/components`: Alias for importing components from the `components` directory.
*   `@libsql/client`: Client for interacting with the LibSQL database.
*   `vue-router`: Official router for Vue.js.
*   `@/utils`: Alias for importing utilities from the `utils` directory.
*   `fs`: Node.js file system module.
*   `path`: Node.js path module.
*   `pinia`: State management library for Vue.js.
*   `striptags`: Library for stripping HTML tags from strings.
*   `url`: Node.js URL module.
*   `#imports`: Nuxt auto-imports.
*   `dotenv`: Module to load environment variables from a `.env` file.
