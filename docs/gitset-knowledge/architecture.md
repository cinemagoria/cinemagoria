# Architecture

## System Overview
Cinemagoria is a Nuxt.js application (v4.14.0) designed for discovering movies and TV shows. It provides a rich user interface for browsing, searching, and tracking content, including detailed information on films, TV series, people, and film festivals. The system integrates with external APIs for media data and utilizes a Turso database for internal data management. It features client-side authentication, a global event bus, and a self-destroying service worker for progressive web app (PWA) capabilities.

## Entry Points
| Type | Name | Description |
|---|---|---|
| Script | `build` | Builds the Nuxt application for production. |
| Script | `dev` | Starts the Nuxt development server. |
| Script | `generate` | Generates the Nuxt application as static files. |
| Script | `preview` | Previews the Nuxt application after a build. |
| Script | `postinstall` | Prepares the Nuxt application after dependencies are installed. |
| Route | `/` | Homepage, displaying featured content, news, and festival banners. |
| Route | `/auth-success` | Handles post-authentication redirects. |
| Route | `/awards` | Displays a list of major film awards. |
| Route | `/changelog` | Displays project release notes. |
| Route | `/contact` | Provides a user contact form. |
| Route | `/faq` | Presents frequently asked questions. |
| Route | `/festival/:name-2026` | Displays details for specific 2026 film festivals (e.g., `/festival/cannes-2026`). |
| Route | `/genre/:id/movie` | Displays movies filtered by genre. |
| Route | `/genre/:id/tv` | Displays TV shows filtered by genre. |
| Route | `/lists` | Manages user-defined lists. |
| Route | `/lists/:slug` | Displays a specific user-curated list. |
| Route | `/login` | Login page, opening the authentication modal. |
| Route | `/movie/:id` | Displays detailed information for a specific movie. |
| Route | `/movie/category/:name` | Displays movies by category. |
| Route | `/movie/followed` | Displays content from followed movie companies and streaming services. |
| Route | `/movie` | Discovery page for movies. |
| Route | `/news` | Displays a feed of news articles. |
| Route | `/news/:slug` | Displays a single news article. |
| Route | `/noir` | Presents the N.O.I.R Archive. |
| Route | `/notifications` | Displays user notifications. |
| Route | `/person/:id` | Displays detailed information about a person. |
| Route | `/production-companies` | Lists all supported production companies. |
| Route | `/production/:slug` | Displays details for a specific production company. |
| Route | `/recovery` | Password recovery interface. |
| Route | `/register` | Registration page, opening the authentication modal. |
| Route | `/search` | Global search functionality. |
| Route | `/settings` | User account settings. |
| Route | `/streaming-services` | Lists all available streaming services. |
| Route | `/streaming/:slug` | Displays details for a specific streaming platform. |
| Route | `/streaming/followed` | Displays followed streaming content. |
| Route | `/tv/:id` | Displays detailed information for a specific TV show. |
| Route | `/tv/category/:name` | Displays TV shows by category. |
| Route | `/tv/followed` | Displays followed TV shows. |
| Route | `/tv` | Discovery page for TV shows. |
| Route | `/u/:alias` | Displays a user's public profile. |
| Route | `/usage-policies` | Displays usage policies and privacy agreement. |
| Route | `/watchlist` | Manages a user's watchlist. |
| Route | `/wip` | Work in Progress page. |
| API Route | `/api/article-report` | Handles article issue reports. |
| API Route | `/api/article/:slug` | Retrieves a specific article. |
| API Route | `/api/article/rss` | Redirects to the canonical RSS feed. |
| API Route | `/api/articles/by-slugs` | Retrieves articles by slugs. |
| API Route | `/api/awards` | Retrieves award information. |
| API Route | `/api/awards/index-page` | Retrieves awards data for index page display. |
| API Route | `/api/contact` | Handles contact form submissions. |
| API Route | `/api/festival-report` | Handles festival data issue reports. |
| API Route | `/api/festival/:festival/awards` | Fetches festival-specific awards. |
| API Route | `/api/festival/:festival/films` | Fetches festival-specific films. |
| API Route | `/api/festival/:festival/schedule` | Retrieves festival-specific screening schedules. |
| API Route | `/api/feed` | Generates the RSS feed. |
| API Route | `/api/hero-data` | Retrieves hero selection data. |
| API Route | `/api/list-item` | Manages items within user lists. |
| API Route | `/api/list-items-by-tmdb-id` | Retrieves list items by TMDB ID. |
| API Route | `/api/lists` | Manages user lists. |
| API Route | `/api/lists/clone-noir` | Clones the N.O.I.R archive to a user's list. |
| API Route | `/api/lists/public` | Retrieves public lists. |
| API Route | `/api/media-progress` | Manages media watch progress. |
| API Route | `/api/media-rating` | Manages media ratings. |
| API Route | `/api/media-recommendations` | Retrieves media recommendations. |
| API Route | `/api/media-search` | Performs media searches. |
| API Route | `/api/media-videos` | Retrieves media videos. |
| API Route | `/api/movie-releases` | Retrieves movie release information. |
| API Route | `/api/movie/:id` | Retrieves detailed movie information. |
| API Route | `/api/movie/:id/credits` | Retrieves movie credits. |
| API Route | `/api/movie/:id/images` | Retrieves movie images. |
| API Route | `/api/movie/:id/soundtracks` | Retrieves movie soundtracks. |
| API Route | `/api/movie/:id/videos` | Retrieves movie videos. |
| API Route | `/api/movie/category/:name` | Retrieves movies by category. |
| API Route | `/api/movie/discover` | Discovers movies with filtering. |
| API Route | `/api/news` | Retrieves news articles. |
| API Route | `/api/noir-enrichment-data` | Retrieves N.O.I.R enrichment data. |
| API Route | `/api/noir-historical` | Retrieves N.O.I.R historical data. |
| API Route | `/api/notifications` | Manages user notifications. |
| API Route | `/api/person/:id` | Retrieves detailed person information. |
| API Route | `/api/person/:id/credits` | Retrieves person's credits. |
| API Route | `/api/person/:id/images` | Retrieves person's images. |
| API Route | `/api/production-company/:slug` | Retrieves production company details. |
| API Route | `/api/production-companies` | Retrieves a list of production companies. |
| API Route | `/api/search` | Performs global search. |
| API Route | `/api/settings` | Manages user settings. |
| API Route | `/api/streaming-platform/:slug` | Retrieves streaming platform details. |
| API Route | `/api/streaming-platforms` | Retrieves a list of streaming platforms. |
| API Route | `/api/title-overrides` | Retrieves custom title override data. |
| API Route | `/api/tv/:id` | Retrieves detailed TV show information. |
| API Route | `/api/tv/:id/credits` | Retrieves TV show credits. |
| API Route | `/api/tv/:id/episodes` | Retrieves TV show episodes. |
| API Route | `/api/tv/:id/images` | Retrieves TV show images. |
| API Route | `/api/tv/:id/soundtracks` | Retrieves TV show soundtracks. |
| API Route | `/api/tv/:id/videos` | Retrieves TV show videos. |
| API Route | `/api/tv/category/:name` | Retrieves TV shows by category. |
| API Route | `/api/tv/discover` | Discovers TV shows with filtering. |
| API Route | `/api/user-follow` | Manages user follows. |
| API Route | `/api/user-profile/:alias` | Retrieves a user's public profile. |
| API Route | `/api/user-watchlist` | Manages user watchlist. |
| API Route | `/api/vimeo-oembed` | Retrieves Vimeo oEmbed data. |
| Middleware | `auth.global.ts` | Client-side authentication guard. |
| Middleware | `server/middleware/01-log.ts` | Logs incoming requests on the server. |
| Middleware | `server/middleware/02-cache.ts` | Handles server-side caching for specific routes. |

## Core Components
*   `.github`: Manages GitHub Actions workflows for CI/CD and data synchronization.
*   `(root)`: Contains core application files like `app.vue`, `nuxt.config.ts`, and Docker configurations.
*   `assets`: Stores static assets such as images and styles.
*   `components`: Houses reusable Vue components for UI elements, cards, carousels, modals, and festival badges.
*   `composables`: Provides Vue composables for reactive logic, such as consent management.
*   `docs`: Contains documentation files.
*   `layouts`: Defines application layouts, including the default layout with navigation and modals.
*   `middleware`: Implements client-side route guards for authentication.
*   `mixins`: Offers reusable Vue mixins for carousel functionality, detail display, data formatting, and infinite scrolling.
*   `pages`: Defines the application's routes and corresponding Vue page components.
*   `plugins`: Registers Nuxt plugins for global event bus and lazy loading.
*   `public`: Contains public assets and the web application manifest.
*   `scripts`: Includes one-shot and synchronization scripts for data management.
*   `server/api`: Implements server-side API endpoints for data fetching and mutations.
*   `server/data`: Stores static data files, such as `awards.json`.
*   `server/middleware`: Implements server-side middleware for logging and caching.
*   `server/plugins`: Contains server-side Nuxt plugins.
*   `server/routes`: Defines server-side routes.
*   `server/types`: Defines TypeScript types for server-side operations.
*   `server/utils`: Provides server-side utility functions, including database interaction.
*   `services`: Contains service-layer logic.
*   `stores`: Manages application state using Pinia.
*   `types`: Defines global TypeScript types.
*   `utils`: Provides client-side utility functions.

## Data Flow
1.  User interacts with the client-side application (e.g., navigates to a page, submits a form).
2.  Client-side middleware ([middleware/auth.global.ts](../../middleware/auth.global.ts)) checks for authentication status.
3.  Vue components (`pages/` and `components/`) dispatch actions to fetch data or mutate state.
4.  Actions trigger API calls to server-side endpoints (`server/api/`).
5.  Server-side middleware ([server/middleware/01-log.ts](../../server/middleware/01-log.ts), [server/middleware/02-cache.ts](../../server/middleware/02-cache.ts)) processes incoming requests (logging, caching).
6.  API endpoints interact with the Turso database (via [server/utils/db.ts](../../server/utils/db.ts)) or external services to retrieve/store data.
7.  Data is returned to the client-side, often processed by Pinia stores (`stores/`).
8.  Vue components update their display based on the new data.

## External Dependencies
*   `~`: General alias for the project root.
*   `~~`: General alias for the project root.
*   `h3`: HTTP framework used by Nuxt server.
*   `vue`: Core JavaScript framework for building user interfaces.
*   `@/components`: Alias for the [components/](../../components/) directory.
*   `@libsql/client`: Client for interacting with the Turso database.
*   `vue-router`: Official router for Vue.js.
*   `@/utils`: Alias for the [utils/](../../utils/) directory.
*   `fs`: Node.js file system module.
*   `path`: Node.js path module.
*   `pinia`: The official state management library for Vue.js.
*   `striptags`: Library for stripping HTML tags from strings.
*   `url`: Node.js URL module.
*   `#imports`: Nuxt auto-imports.
*   `dotenv`: Module to load environment variables from a `.env` file.
