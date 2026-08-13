# Architecture

## System Overview
Cinemagoria is a Nuxt.js application, version 4.16.0, designed to help users discover movies and TV shows. It integrates with various external APIs for media data and uses a Turso database for custom content and user data. The application provides a rich user interface with features like personalized lists, progress tracking, festival coverage, and news articles. Deployment is managed via Google Cloud Build and Cloud Run, utilizing Docker for containerization.

## Entry Points
The application offers several entry points:

| Type | Name | Description |
|---|---|---|
| **Web Interface** | `/` | The main Nuxt.js application, rendered via [app.vue](../../app.vue). |
| **CLI Script** | `build` | Builds the Nuxt.js application for production. |
| **CLI Script** | `dev` | Starts the Nuxt.js development server. |
| **CLI Script** | `generate` | Generates static files for the Nuxt.js application. |
| **CLI Script** | `preview` | Locally previews the Nuxt.js production build. |
| **CLI Script** | `postinstall` | Prepares the Nuxt.js project after installation. |
| **API Route** | `/api/festival-report` | Handles POST requests for festival reports. |
| **API Route** | `/api/festival/bafici/awards` | Handles GET requests for BAFICI 2026 awards. |
| **API Route** | `/api/festival/bafici/films` | Handles GET requests for BAFICI 2026 films. |
| **API Route** | `/api/festival/bafici/schedule` | Handles GET requests for BAFICI 2026 schedule. |
| **API Route** | `/api/festival/berlinale/awards` | Handles GET requests for Berlinale 2026 awards. |
| **API Route** | `/api/festival/berlinale/films` | Handles GET requests for Berlinale 2026 films. |
| **API Route** | `/api/festival/berlinale/schedule` | Handles GET requests for Berlinale 2026 schedule. |
| **API Route** | `/api/festival/bifan/awards` | Handles GET requests for BIFAN 2026 awards. |
| **API Route** | `/api/festival/bifan/films` | Handles GET requests for BIFAN 2026 films. |
| **API Route** | `/api/festival/bifan/schedule` | Handles GET requests for BIFAN 2026 schedule. |
| **API Route** | `/api/festival/bifff/awards` | Handles GET requests for BIFFF 2026 awards. |
| **API Route** | `/api/festival/bifff/films` | Handles GET requests for BIFFF 2026 films. |
| **API Route** | `/api/festival/bifff/schedule` | Handles GET requests for BIFFF 2026 schedule. |
| **API Route** | `/api/festival/cannes/awards` | Handles GET requests for Cannes 2026 awards. |
| **API Route** | `/api/festival/cannes/films` | Handles GET requests for Cannes 2026 films. |
| **API Route** | `/api/festival/cannes/schedule` | Handles GET requests for Cannes 2026 schedule. |
| **API Route** | `/api/festival/cuff/awards` | Handles GET requests for CUFF 2026 awards. |
| **API Route** | `/api/festival/cuff/films` | Handles GET requests for CUFF 2026 films. |
| **API Route** | `/api/festival/cuff/schedule` | Handles GET requests for CUFF 2026 schedule. |
| **API Route** | `/api/festival/fantasia/awards` | Handles GET requests for Fantasia 2026 awards. |
| **API Route** | `/api/festival/fantasia/films` | Handles GET requests for Fantasia 2026 films. |
| **API Route** | `/api/festival/fantasia/schedule` | Handles GET requests for Fantasia 2026 schedule. |
| **API Route** | `/api/festival/frightfest/awards` | Handles GET requests for FrightFest 2026 awards. |
| **API Route** | `/api/festival/frightfest/films` | Handles GET requests for FrightFest 2026 films. |
| **API Route** | `/api/festival/frightfest/schedule` | Handles GET requests for FrightFest 2026 schedule. |
| **API Route** | `/api/festival/kviff/awards` | Handles GET requests for KVIFF 2026 awards. |
| **API Route** | `/api/festival/kviff/films` | Handles GET requests for KVIFF 2026 films. |
| **API Route** | `/api/festival/kviff/schedule` | Handles GET requests for KVIFF 2026 schedule. |
| **API Route** | `/api/festival/locarno/awards` | Handles GET requests for Locarno 2026 awards. |
| **API Route** | `/api/festival/locarno/films` | Handles GET requests for Locarno 2026 films. |
| **API Route** | `/api/festival/locarno/schedule` | Handles GET requests for Locarno 2026 schedule. |
| **API Route** | `/api/festival/romford/awards` | Handles GET requests for Romford 2026 awards. |
| **API Route** | `/api/festival/romford/films` | Handles GET requests for Romford 2026 films. |
| **API Route** | `/api/festival/romford/schedule` | Handles GET requests for Romford 2026 schedule. |
| **API Route** | `/api/festival/rotterdam/awards` | Handles GET requests for Rotterdam 2026 awards. |
| **API Route** | `/api/festival/rotterdam/films` | Handles GET requests for Rotterdam 2026 films. |
| **API Route** | `/api/festival/rotterdam/schedule` | Handles GET requests for Rotterdam 2026 schedule. |
| **API Route** | `/api/festival/slamdance/awards` | Handles GET requests for Slamdance 2026 awards. |
| **API Route** | `/api/festival/slamdance/films` | Handles GET requests for Slamdance 2026 films. |
| **API Route** | `/api/festival/slamdance/schedule` | Handles GET requests for Slamdance 2026 schedule. |
| **API Route** | `/api/festival/sundance/awards` | Handles GET requests for Sundance 2026 awards. |
| **API Route** | `/api/festival/sundance/films` | Handles GET requests for Sundance 2026 films. |
| **API Route** | `/api/festival/sundance/schedule` | Handles GET requests for Sundance 2026 schedule. |
| **API Route** | `/api/festival/sxsw/awards` | Handles GET requests for SXSW 2026 awards. |
| **API Route** | `/api/festival/sxsw/films` | Handles GET requests for SXSW 2026 films. |
| **API Route** | `/api/festival/sxsw/schedule` | Handles GET requests for SXSW 2026 schedule. |
| **API Route** | `/api/festival/tiff/awards` | Handles GET requests for TIFF 2026 awards. |
| **API Route** | `/api/festival/tiff/films` | Handles GET requests for TIFF 2026 films. |
| **API Route** | `/api/festival/tiff/schedule` | Handles GET requests for TIFF 2026 schedule. |
| **API Route** | `/api/festival/tribeca/awards` | Handles GET requests for Tribeca 2026 awards. |
| **API Route** | `/api/festival/tribeca/films` | Handles GET requests for Tribeca 2026 films. |
| **API Route** | `/api/festival/tribeca/schedule` | Handles GET requests for Tribeca 2026 schedule. |
| **API Route** | `/api/festival/venice/awards` | Handles GET requests for Venice 2026 awards. |
| **API Route** | `/api/festival/venice/films` | Handles GET requests for Venice 2026 films. |
| **API Route** | `/api/festival/venice/schedule` | Handles GET requests for Venice 2026 schedule. |
| **API Route** | `/api/feed` | Generates an RSS feed of recent articles. |
| **API Route** | `/api/follow/person` | Handles POST/DELETE requests for following/unfollowing people. |
| **API Route** | `/api/follow/production-company` | Handles POST/DELETE requests for following/unfollowing production companies. |
| **API Route** | `/api/follow/streaming-service` | Handles POST/DELETE requests for following/unfollowing streaming services. |
| **API Route** | `/api/follow/tv` | Handles POST/DELETE requests for following/unfollowing TV shows. |
| **API Route** | `/api/list/add-item` | Handles POST requests to add an item to a user's list. |
| **API Route** | `/api/list/create` | Handles POST requests to create a new user list. |
| **API Route** | `/api/list/delete` | Handles DELETE requests to delete a user list. |
| **API Route** | `/api/list/edit` | Handles PUT requests to edit a user list. |
| **API Route** | `/api/list/remove-item` | Handles DELETE requests to remove an item from a user's list. |
| **API Route** | `/api/list/[slug]` | Handles GET requests for a specific user list by slug. |
| **API Route** | `/api/lists` | Handles GET requests for a user's lists. |
| **API Route** | `/api/news/categories` | Handles GET requests for news categories. |
| **API Route** | `/api/news/latest` | Handles GET requests for the latest news articles. |
| **API Route** | `/api/news/search` | Handles GET requests for searching news articles. |
| **API Route** | `/api/noir/historical` | Handles GET requests for N.O.I.R historical data. |
| **API Route** | `/api/notifications` | Handles GET requests for user notifications. |
| **API Route** | `/api/notifications/mark-all-read` | Handles POST requests to mark all notifications as read. |
| **API Route** | `/api/notifications/mark-read` | Handles POST requests to mark a specific notification as read. |
| **API Route** | `/api/notifications/unread-count` | Handles GET requests for the count of unread notifications. |
| **API Route** | `/api/progress/mark-episode-watched` | Handles POST requests to mark a TV episode as watched. |
| **API Route** | `/api/progress/mark-movie-watched` | Handles POST requests to mark a movie as watched. |
| **API Route** | `/api/progress/mark-season-watched` | Handles POST requests to mark a TV season as watched. |
| **API Route** | `/api/progress/mark-unwatched` | Handles POST requests to mark an item as unwatched. |
| **API Route** | `/api/progress/movie/[id]` | Handles GET requests for movie watch progress. |
| **API Route** | `/api/progress/tv/[id]` | Handles GET requests for TV show watch progress. |
| **API Route** | `/api/rate/movie` | Handles POST/PUT/DELETE requests for rating movies. |
| **API Route** | `/api/rate/tv` | Handles POST/PUT/DELETE requests for rating TV shows. |
| **API Route** | `/api/rated/movie` | Handles GET requests for a user's rated movies. |
| **API Route** | `/api/rated/tv` | Handles GET requests for a user's rated TV shows. |
| **API Route** | `/api/search` | Handles GET requests for global search. |
| **API Route** | `/api/search/trending` | Handles GET requests for trending search results. |
| **API Route** | `/api/sitemap` | Generates a sitemap. |
| **API Route** | `/api/sitemap/articles` | Generates a sitemap for articles. |
| **API Route** | `/api/sitemap/awards` | Generates a sitemap for awards. |
| **API Route** | `/api/sitemap/festivals` | Generates a sitemap for festivals. |
| **API Route** | `/api/sitemap/genres` | Generates a sitemap for genres. |
| **API Route** | `/api/sitemap/movies` | Generates a sitemap for movies. |
| **API Route** | `/api/sitemap/people` | Generates a sitemap for people. |
| **API Route** | `/api/sitemap/production-companies` | Generates a sitemap for production companies. |
| **API Route** | `/api/sitemap/streaming-services` | Generates a sitemap for streaming services. |
| **API Route** | `/api/sitemap/tv` | Generates a sitemap for TV shows. |
| **API Route** | `/api/sitemap/users` | Generates a sitemap for users. |
| **API Route** | `/api/user/profile` | Handles GET/PUT requests for user profile data. |
| **API Route** | `/api/user/username-available` | Handles GET requests to check username availability. |
| **API Route** | `/api/watchlist/add` | Handles POST requests to add an item to the watchlist. |
| **API Route** | `/api/watchlist/remove` | Handles DELETE requests to remove an item from the watchlist. |
| **API Route** | `/api/watchlist/status` | Handles GET requests for an item's watchlist status. |
| **API Route** | `/api/watchlist/user` | Handles GET requests for a user's watchlist. |
| **Workflow** | `gitset-knowledge` | Refreshes the project's AI knowledge base. |
| **Workflow** | `sync-hero-data` | Synchronizes hero and noir enrichment data. |
| **Workflow** | `sync-noir-historical` | Synchronizes N.O.I.R historical data. |

## Core Components
*   `.github`: Manages GitHub-specific configurations, including funding and CI workflows.
*   `(root)`: Contains core application files like the main Vue component, Nuxt configuration, and Docker setup.
*   `assets`: Stores static assets such as images, fonts, and stylesheets.
*   `components`: Houses reusable Vue components for UI elements, including global components, festival-specific cards, and media display components.
*   `composables`: Provides Vue composables for shared logic, such as consent management.
*   `layouts`: Defines application layouts, including the default layout with navigation and modals.
*   `middleware`: Implements Nuxt.js middleware for route protection and authentication.
*   `mixins`: Offers Vue mixins for common functionalities like carousel management, data enrichment, filtering, and utility functions.
*   `pages`: Contains Vue components for application routes, covering various sections like festivals, movies, TV shows, news, and user profiles.
*   `plugins`: Registers Nuxt.js plugins for global functionalities like an event bus and lazy loading.
*   `public`: Stores publicly accessible static files, including the web app manifest and a self-destroying service worker.
*   `scripts`: Contains one-shot and synchronization scripts for database seeding and data fetching.
*   `server/api`: Implements API endpoints for data retrieval, user actions, and content management.
*   `server/middleware`: Provides server-side middleware for API requests.
*   `server/plugins`: Registers server-side plugins.
*   `server/routes`: Defines server-side routes.
*   `server/types`: Contains TypeScript type definitions for server-side code.
*   `server/utils`: Provides server-side utility functions, including database interactions.
*   `services`: Encapsulates external service integrations.
*   `stores`: Manages application state using Pinia.
*   `types`: Contains global TypeScript type definitions.
*   `utils`: Provides client-side utility functions.

## Data Flow
1.  User interacts with the client-side Nuxt.js application, triggering a request.
2.  Client-side middleware ([middleware/auth.global.ts](../../middleware/auth.global.ts)) checks for authentication status.
3.  Request is routed to a Nuxt page component (e.g., [pages/movie/[id].vue](../../pages/movie/[id].vue)).
4.  Page component dispatches a request to a server-side API endpoint (e.g., `/api/movie/[id]`).
5.  Server-side API endpoint ([server/api/movie/[id].get.ts](../../server/api/imdb-rating/[id].get.ts)) processes the request.
6.  API endpoint interacts with the Turso database or external APIs (e.g., TMDB).
7.  Data is retrieved, processed, and returned to the client.
8.  Client-side components ([components/movie/MovieInfo.vue](../../components/movie/MovieInfo.vue)) render the data in the UI.

## External Dependencies
*   `~`: Used for various internal modules and components.
*   `~~`: Used for various internal modules and components.
*   `h3`: A minimal HTTP framework used in server-side routes and middleware.
*   `vue`: The core JavaScript framework for building user interfaces.
*   `@/components`: Imports from the local components module.
*   `@libsql/client`: Client for interacting with the LibSQL database (Turso).
*   `vue-router`: The official router for Vue.js.
*   `@/utils`: Imports from the local utils module.
*   `fs`: Node.js file system module for server-side operations.
*   `path`: Node.js path module for server-side operations.
*   `pinia`: The official state management library for Vue.js.
*   `striptags`: A utility for stripping HTML tags from strings.
*   `url`: Node.js URL module for server-side operations.
*   `#imports`: Nuxt.js auto-imports.
*   `dotenv`: Loads environment variables from a `.env` file.
