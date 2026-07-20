# Architecture

## System Overview
Cinemagoria is a Nuxt.js application designed to help users discover movies and TV shows. It provides detailed information on media, tracks user watch progress, manages custom lists, and offers comprehensive festival coverage. The system integrates with external APIs for media data and uses a Turso database for internal data management. It supports user authentication, notifications, and content discovery through various filters and search capabilities. The application is built with a multi-stage Docker setup and deployed via Google Cloud Build to Google Cloud Run.

## Entry Points
| Type | Name | Description |
|---|---|---|
| Package Script | `build` | Builds the Nuxt application. |
| Package Script | `dev` | Runs the Nuxt application in development mode. |
| Package Script | `generate` | Generates the Nuxt application for static hosting. |
| Package Script | `preview` | Previews the Nuxt application after a build. |
| Package Script | `postinstall` | Prepares the Nuxt application after installation. |
| CI Workflow | `.github/workflows/sync-hero-data.yml` | Periodically syncs and updates hero and noir enrichment data. |
| CI Workflow | `.github/workflows/sync-noir-historical.yml` | Manually syncs historical N.O.I.R. data and regenerates `noir-enrichment.json`. |
| Server Route | `/api/article-report` | Handles POST requests to report article issues. |
| Server Route | `/api/article/[slug]` | Handles GET requests for a specific article. |
| Server Route | `/api/article/rss` | Permanently redirects to `/feed`. |
| Server Route | `/api/articles/by-slugs` | Retrieves multiple articles by slugs. |
| Server Route | `/api/awards/index-page` | Retrieves awards data for a specific award type and year. |
| Server Route | `/api/awards` | Retrieves awards data filtered by various criteria. |
| Server Route | `/api/contact` | Handles POST requests for the contact form. |
| Server Route | `/api/festival-report` | Handles POST requests to report festival data issues. |
| Server Route | `/api/festival/bafici/awards` | Retrieves BAFICI 2026 awards data. |
| Server Route | `/api/festival/bafici/films` | Retrieves BAFICI 2026 film list. |
| Server Route | `/api/festival/bafici/schedule` | Retrieves BAFICI 2026 screening schedule. |
| Server Route | `/api/festival/berlinale/awards` | Retrieves Berlinale 2026 awards data. |
| Server Route | `/api/festival/berlinale/films` | Retrieves Berlinale 2026 film list. |
| Server Route | `/api/festival/berlinale/schedule` | Retrieves Berlinale 2026 screening schedule. |
| Server Route | `/api/festival/bifff/awards` | Retrieves BIFFF 2026 awards data. |
| Server Route | `/api/festival/bifff/films` | Retrieves BIFFF 2026 film list. |
| Server Route | `/api/festival/bifff/schedule` | Retrieves BIFFF 2026 screening schedule. |
| Server Route | `/api/festival/cannes/awards` | Retrieves Cannes 2026 awards data. |
| Server Route | `/api/festival/cannes/films` | Retrieves Cannes 2026 film list. |
| Server Route | `/api/festival/cannes/schedule` | Retrieves Cannes 2026 screening schedule. |
| Server Route | `/api/festival/cuff/awards` | Fetches CUFF 2026 awards. |
| Server Route | `/api/festival/cuff/films` | Retrieves CUFF 2026 films. |
| Server Route | `/api/festival/cuff/schedule` | Retrieves CUFF 2026 screening schedule. |
| Server Route | `/api/festival/fantasia/awards` | Fetches Fantasia 2026 awards. |
| Server Route | `/api/festival/fantasia/films` | Retrieves Fantasia 2026 films. |
| Server Route | `/api/festival/fantasia/schedule` | Retrieves Fantasia 2026 screening schedule. |
| Server Route | `/api/festival/films-batch` | Fetches films for multiple festivals. |
| Server Route | `/api/festival/frightfest/awards` | Fetches FrightFest 2026 awards. |
| Server Route | `/api/festival/frightfest/films` | Retrieves FrightFest 2026 films. |
| Server Route | `/api/festival/frightfest/schedule` | Retrieves FrightFest 2026 screening schedule. |
| Server Route | `/api/festival/kviff/awards` | Fetches KVIFF 2026 awards. |
| Server Route | `/api/festival/kviff/films` | Retrieves KVIFF 2026 films. |
| Server Route | `/api/festival/kviff/schedule` | Retrieves KVIFF 2026 screening schedule. |
| Server Route | `/api/festival/romford/awards` | Fetches Romford 2026 awards. |
| Server Route | `/api/festival/romford/films` | Retrieves Romford 2026 films. |
| Server Route | `/api/festival/romford/schedule` | Retrieves Romford 2026 screening schedule. |
| Server Route | `/api/festival/rotterdam/awards` | Fetches Rotterdam 2026 awards. |
| Server Route | `/api/festival/rotterdam/films` | Retrieves Rotterdam 2026 films. |
| Server Route | `/api/festival/rotterdam/schedule` | Retrieves Rotterdam 2026 screening schedule. |
| Server Route | `/api/festival/slamdance/awards` | Fetches Slamdance 2026 awards. |
| Server Route | `/api/festival/slamdance/films` | Retrieves Slamdance 2026 films. |
| Server Route | `/api/festival/slamdance/schedule` | Retrieves Slamdance 2026 screening schedule. |
| Server Route | `/api/festival/sundance/awards` | Fetches Sundance 2026 awards. |
| Server Route | `/api/festival/sundance/films` | Retrieves Sundance 2026 films. |
| Server Route | `/api/festival/sundance/schedule` | Retrieves Sundance 2026 screening schedule. |
| Server Route | `/api/festival/sxsw/awards` | Fetches SXSW 2026 awards. |
| Server Route | `/api/festival/sxsw/films` | Retrieves SXSW 2026 films. |
| Server Route | `/api/festival/sxsw/schedule` | Retrieves SXSW 2026 screening schedule. |
| Server Route | `/api/festival/tribeca/awards` | Fetches Tribeca 2026 awards. |
| Server Route | `/api/festival/tribeca/films` | Retrieves Tribeca 2026 films. |
| Server Route | `/api/festival/tribeca/schedule` | Retrieves Tribeca 2026 screening schedule. |
| Server Route | `/api/feed` | Generates an RSS feed for articles. |
| Server Route | `/api/hero-data` | Retrieves hero selection data. |
| Server Route | `/api/list/[slug]` | Handles GET, PUT, and DELETE requests for user lists. |
| Server Route | `/api/lists` | Handles GET and POST requests for user lists. |
| Server Route | `/api/login` | Handles user login requests. |
| Server Route | `/api/media/external-ratings` | Retrieves external ratings for media. |
| Server Route | `/api/media/images` | Retrieves images for a media item. |
| Server Route | `/api/media/providers` | Retrieves streaming providers for a media item. |
| Server Route | `/api/media/recommendations` | Retrieves media recommendations. |
| Server Route | `/api/media/related-articles` | Retrieves related articles for a media item. |
| Server Route | `/api/media/reviews` | Retrieves reviews for a media item. |
| Server Route | `/api/media/search` | Performs a global media search. |
| Server Route | `/api/media/similar` | Retrieves similar media items. |
| Server Route | `/api/media/soundtracks` | Retrieves soundtracks for a media item. |
| Server Route | `/api/media/videos` | Retrieves videos for a media item. |
| Server Route | `/api/movie/category/[name]` | Retrieves movies by category. |
| Server Route | `/api/movie/genre/[id]` | Retrieves movies by genre. |
| Server Route | `/api/movie/[id]` | Retrieves detailed movie information. |
| Server Route | `/api/noir-historical` | Retrieves noir historical data. |
| Server Route | `/api/notifications` | Handles GET, PUT, and DELETE requests for user notifications. |
| Server Route | `/api/person/[id]` | Retrieves detailed person information. |
| Server Route | `/api/production-company/[slug]` | Retrieves production company details. |
| Server Route | `/api/production-companies` | Retrieves a list of production companies. |
| Server Route | `/api/rated` | Handles GET, PUT, and DELETE requests for user ratings. |
| Server Route | `/api/recovery` | Handles password recovery requests. |
| Server Route | `/api/register` | Handles user registration requests. |
| Server Route | `/api/settings` | Handles GET, PUT, and DELETE requests for user settings. |
| Server Route | `/api/streaming-platform/[slug]` | Retrieves streaming platform details. |
| Server Route | `/api/streaming-platforms` | Retrieves a list of streaming platforms. |
| Server Route | `/api/title-overrides` | Retrieves custom title override data. |
| Server Route | `/api/tv/category/[name]` | Retrieves TV shows by category. |
| Server Route | `/api/tv/genre/[id]` | Retrieves TV shows by genre. |
| Server Route | `/api/tv/[id]` | Retrieves detailed TV show information. |
| Server Route | `/api/user/[alias]` | Retrieves public user profile data. |
| Server Route | `/api/user/follow` | Handles user follow/unfollow requests. |
| Server Route | `/api/user/lists` | Retrieves user's custom lists. |
| Server Route | `/api/user/notifications` | Retrieves user notifications. |
| Server Route | `/api/user/rated` | Retrieves user's rated items. |
| Server Route | `/api/user/watchlist` | Retrieves user's watchlist. |
| Server Route | `/api/vimeo-oembed` | Retrieves Vimeo oEmbed data. |
| Server Route | `/api/watchlist` | Handles GET, POST, and DELETE requests for user watchlists. |
| Server Route | `/auth-success` | Handles post-authentication redirects. |
| Server Route | `/awards` | Displays a browsable list of major film awards. |
| Server Route | `/changelog` | Displays the platform's changelog. |
| Server Route | `/contact` | Provides a contact form. |
| Server Route | `/faq` | Presents a Frequently Asked Questions page. |
| Server Route | `/festival/bafici-2026` | Displays BAFICI 2026 festival details. |
| Server Route | `/festival/berlinale-2026` | Displays Berlinale 2026 festival details. |
| Server Route | `/festival/bifff-2026` | Displays BIFFF 2026 festival details. |
| Server Route | `/festival/cannes-2026` | Displays Cannes 2026 festival details. |
| Server Route | `/festival/cuff-2026` | Displays CUFF 2026 festival details. |
| Server Route | `/festival/fantasia-2026` | Displays Fantasia 2026 festival details. |
| Server Route | `/festival/frightfest-2026` | Displays FrightFest 2026 festival details. |
| Server Route | `/festival/kviff-2026` | Displays KVIFF 2026 festival details. |
| Server Route | `/festival/romford-2026` | Displays Romford 2026 festival details. |
| Server Route | `/festival/rotterdam-2026` | Displays Rotterdam 2026 festival details. |
| Server Route | `/festival/slamdance-2026` | Displays Slamdance 2026 festival details. |
| Server Route | `/festival/sundance-2026` | Displays Sundance 2026 festival details. |
| Server Route | `/festival/sxsw-2026` | Displays SXSW 2026 festival details. |
| Server Route | `/festival/tribeca-2026` | Displays Tribeca 2026 festival details. |
| Server Route | `/genre/[id]/movie` | Displays movies by genre. |
| Server Route | `/genre/[id]/tv` | Displays TV shows by genre. |
| Server Route | `/` | Serves as the homepage. |
| Server Route | `/lists/[slug]` | Displays a specific user-created list. |
| Server Route | `/lists` | Displays a user's custom lists. |
| Server Route | `/login` | Serves as the login page. |
| Server Route | `/movie/[id]` | Displays detailed movie information. |
| Server Route | `/movie/category/[name]` | Displays movies by category. |
| Server Route | `/movie/followed` | Displays content from followed movie-related entities. |
| Server Route | `/movie` | Serves as the main discovery page for movies. |
| Server Route | `/news/[slug]` | Displays a single news article. |
| Server Route | `/news` | Displays a feed of the latest news articles. |
| Server Route | `/noir` | Displays the N.O.I.R Archive. |
| Server Route | `/notifications` | Displays user notifications. |
| Server Route | `/person/[id]` | Displays detailed person information. |
| Server Route | `/production-companies` | Displays a grid of production companies. |
| Server Route | `/production/[slug]` | Displays a detailed page for a specific production company. |
| Server Route | `/recovery` | Provides a user interface for password recovery. |
| Server Route | `/register` | Serves as the registration page. |
| Server Route | `/search` | Implements a dynamic search results page. |
| Server Route | `/settings` | Provides a user interface for managing account settings. |
| Server Route | `/streaming-services` | Displays a grid of streaming services. |
| Server Route | `/streaming/[slug]` | Displays details for a specific streaming platform. |
| Server Route | `/streaming/followed` | Displays a user's followed streaming content. |
| Server Route | `/tv/[id]` | Displays detailed TV show information. |
| Server Route | `/tv/category/[name]` | Displays TV shows by category. |
| Server Route | `/tv/followed` | Displays TV shows that a user has followed. |
| Server Route | `/tv` | Serves as the main discovery page for TV shows. |
| Server Route | `/u/[alias]` | Displays a user's public profile. |
| Server Route | `/usage-policies` | Presents the platform's usage policies. |
| Server Route | `/watchlist` | Displays a user's watchlist. |
| Server Route | `/wip` | Displays a 'Work in Progress' page. |

## Core Components
*   `.github`: Manages GitHub-specific configurations and workflows.
*   `(root)`: Contains core application files like `app.vue` and Nuxt configuration.
*   `assets`: Stores static assets such as images and stylesheets.
*   `components`: Houses reusable Vue components for UI elements and content display.
*   `composables`: Provides reusable Vue composition functions for logic encapsulation.
*   `docs`: Contains documentation files.
*   `layouts`: Defines application layouts, such as the default layout.
*   `middleware`: Implements Nuxt route middleware for client-side authentication.
*   `mixins`: Provides reusable Vue mixins for common functionalities.
*   `pages`: Contains Vue components that define the application's routes and views.
*   `plugins`: Integrates Nuxt plugins for global functionalities like an event bus and lazy loading.
*   `public`: Serves static files directly, including the web app manifest and a self-destroying service worker.
*   `scripts`: Contains one-shot and synchronization scripts for data management.
*   `server/api`: Defines API endpoints for data retrieval and manipulation.
*   `server/data`: Stores static data files, such as `awards.json`.
*   `server/middleware`: Implements server-side middleware.
*   `server/plugins`: Integrates server-side plugins.
*   `server/routes`: Defines server-side routes.
*   `server/types`: Contains TypeScript type definitions for server-side code.
*   `server/utils`: Provides utility functions for server-side operations, including database interactions.
*   `services`: Contains service-layer logic for interacting with external APIs or databases.
*   `stores`: Manages application state using Pinia stores.
*   `types`: Contains TypeScript type definitions for client-side code.
*   `utils`: Provides general utility functions for client-side operations.

## Data Flow
1.  User interacts with the client-side application (e.g., navigates to a page, performs a search).
2.  Vue components in `pages` and `components` trigger data fetching via API calls.
3.  Client-side API requests are routed to `server/api` endpoints.
4.  `server/api` endpoints process requests, often utilizing `server/utils` for database interactions or `services` for external API calls.
5.  Data is retrieved from the Turso database (e.g., `hero_selections`, `noir_historical`, `festival_awards`) or external sources.
6.  `server/api` formats the data and sends it back to the client.
7.  Client-side `stores` (Pinia) manage the fetched data, making it available to components.
8.  Vue components render the data, updating the UI.
9.  User actions (e.g., reporting an article, submitting a contact form) trigger POST requests to `server/api` for data persistence.

## External Dependencies
*   `~`: General alias for the project root, used for internal imports.
*   `~~`: General alias for the project root, used for internal imports.
*   `h3`: HTTP framework for building API routes.
*   `vue`: Core JavaScript framework for building user interfaces.
*   `@/components`: Alias for importing components from the `components` directory.
*   `@libsql/client`: Client library for interacting with the Turso database.
*   `vue-router`: Official router for Vue.js.
*   `@/utils`: Alias for importing utilities from the `utils` directory.
*   `fs`: Node.js file system module (server-side).
*   `path`: Node.js path module (server-side).
*   `pinia`: State management library for Vue.js.
*   `striptags`: Library for stripping HTML tags from strings.
*   `url`: Node.js URL module (server-side).
*   `#imports`: Nuxt auto-imports.
*   `dotenv`: Module for loading environment variables from a `.env` file.
