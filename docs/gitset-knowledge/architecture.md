# Architecture

## System Overview
Cinemagoria is a Nuxt.js application, version 4.15.0, designed to help users discover movies and TV shows. It provides a rich user interface with features like content discovery, personalized lists, progress tracking, and festival coverage. The system leverages a multi-stage Docker build for deployment to Google Cloud Run and uses Turso for database interactions. Automated GitHub Actions workflows handle tasks such as AI knowledge base refreshing and data synchronization.

## Entry Points
The application's primary entry points are:

| Type | Name | Description |
|---|---|---|
| Package Script | `build` | Compiles the Nuxt application for production. |
| Package Script | `dev` | Starts the Nuxt development server. |
| Package Script | `generate` | Generates static files for the Nuxt application. |
| Package Script | `preview` | Locally previews a Nuxt production build. |
| Package Script | `postinstall` | Prepares the Nuxt project after installation. |
| CLI Command | `node scripts/seed_tribeca_2026_awards.cjs` | Seeds the `festival_awards` table with Tribeca 2026 award winners. |
| Route | `GET /api/article-report` | Handles POST requests to submit article reports. |
| Route | `GET /api/article/[slug]` | Retrieves a specific article by its slug. |
| Route | `GET /api/article/rss` | Redirects to the canonical RSS feed URL. |
| Route | `GET /api/articles/by-slugs` | Retrieves multiple articles by a list of slugs. |
| Route | `GET /api/awards/index-page` | Retrieves awards data for the awards index page. |
| Route | `GET /api/awards/index` | Retrieves general award information for films or people. |
| Route | `GET /api/contact` | Handles POST requests for the contact form. |
| Route | `GET /api/festival-report` | Handles POST requests to submit festival reports. |
| Route | `GET /api/festival/bafici/awards` | Fetches BAFICI 2026 awards data. |
| Route | `GET /api/festival/bafici/films` | Fetches BAFICI 2026 film data. |
| Route | `GET /api/festival/bafici/schedule` | Retrieves BAFICI 2026 festival screening schedule. |
| Route | `GET /api/festival/berlinale/awards` | Fetches Berlinale 2026 awards data. |
| Route | `GET /api/festival/berlinale/films` | Fetches Berlinale 2026 film data. |
| Route | `GET /api/festival/berlinale/schedule` | Retrieves Berlinale 2026 festival screening schedule. |
| Route | `GET /api/festival/bifff/awards` | Fetches BIFFF 2026 awards data. |
| Route | `GET /api/festival/bifff/films` | Fetches BIFFF 2026 film data. |
| Route | `GET /api/festival/bifff/schedule` | Retrieves BIFFF 2026 festival screening schedule. |
| Route | `GET /api/festival/cannes/awards` | Fetches Cannes 2026 awards data. |
| Route | `GET /api/festival/cannes/films` | Fetches Cannes 2026 film data. |
| Route | `GET /api/festival/cannes/schedule` | Retrieves Cannes 2026 festival screening schedule. |
| Route | `GET /api/festival/cuff/awards` | Fetches CUFF 2026 awards data. |
| Route | `GET /api/festival/cuff/films` | Fetches CUFF 2026 film data. |
| Route | `GET /api/festival/cuff/schedule` | Retrieves CUFF 2026 festival screening schedule. |
| Route | `GET /api/festival/fantasia/awards` | Fetches Fantasia 2026 awards data. |
| Route | `GET /api/festival/fantasia/films` | Fetches Fantasia 2026 film data. |
| Route | `GET /api/festival/fantasia/schedule` | Retrieves Fantasia 2026 festival screening schedule. |
| Route | `GET /api/festival/frightfest/awards` | Fetches FrightFest 2026 awards data. |
| Route | `GET /api/festival/frightfest/films` | Fetches FrightFest 2026 film data. |
| Route | `GET /api/festival/frightfest/schedule` | Retrieves FrightFest 2026 festival screening schedule. |
| Route | `GET /api/festival/kviff/awards` | Fetches KVIFF 2026 awards data. |
| Route | `GET /api/festival/kviff/films` | Fetches KVIFF 2026 film data. |
| Route | `GET /api/festival/kviff/schedule` | Retrieves KVIFF 2026 festival screening schedule. |
| Route | `GET /api/festival/romford/awards` | Fetches Romford 2026 awards data. |
| Route | `GET /api/festival/romford/films` | Fetches Romford 2026 film data. |
| Route | `GET /api/festival/romford/schedule` | Retrieves Romford 2026 festival screening schedule. |
| Route | `GET /api/festival/rotterdam/awards` | Fetches Rotterdam 2026 awards data. |
| Route | `GET /api/festival/rotterdam/films` | Fetches Rotterdam 2026 film data. |
| Route | `GET /api/festival/rotterdam/schedule` | Retrieves Rotterdam 2026 festival screening schedule. |
| Route | `GET /api/festival/slamdance/awards` | Fetches Slamdance 2026 awards data. |
| Route | `GET /api/festival/slamdance/films` | Fetches Slamdance 2026 film data. |
| Route | `GET /api/festival/slamdance/schedule` | Retrieves Slamdance 2026 festival screening schedule. |
| Route | `GET /api/festival/sundance/awards` | Fetches Sundance 2026 awards data. |
| Route | `GET /api/festival/sundance/films` | Fetches Sundance 2026 film data. |
| Route | `GET /api/festival/sundance/schedule` | Retrieves Sundance 2026 festival screening schedule. |
| Route | `GET /api/festival/sxsw/awards` | Fetches SXSW 2026 awards data. |
| Route | `GET /api/festival/sxsw/films` | Fetches SXSW 2026 film data. |
| Route | `GET /api/festival/sxsw/schedule` | Retrieves SXSW 2026 festival screening schedule. |
| Route | `GET /api/festival/tiff/awards` | Fetches TIFF 2026 awards data. |
| Route | `GET /api/festival/tiff/films` | Fetches TIFF 2026 film data. |
| Route | `GET /api/festival/tiff/schedule` | Retrieves TIFF 2026 festival screening schedule. |
| Route | `GET /api/festival/tribeca/awards` | Fetches Tribeca 2026 awards data. |
| Route | `GET /api/festival/tribeca/films` | Fetches Tribeca 2026 film data. |
| Route | `GET /api/festival/tribeca/schedule` | Retrieves Tribeca 2026 festival screening schedule. |
| Route | `GET /api/festival/venice/awards` | Fetches Venice 2026 awards data. |
| Route | `GET /api/festival/venice/films` | Fetches Venice 2026 film data. |
| Route | `GET /api/festival/venice/schedule` | Retrieves Venice 2026 festival screening schedule. |
| Route | `GET /api/feed` | Generates an RSS feed of articles. |
| Route | `GET /api/hero-data` | Retrieves hero selection data. |
| Route | `GET /api/list/[id]` | Retrieves a specific user list. |
| Route | `GET /api/list/add-item` | Adds an item to a user list. |
| Route | `GET /api/list/create` | Creates a new user list. |
| Route | `GET /api/list/delete` | Deletes a user list. |
| Route | `GET /api/list/edit` | Edits an existing user list. |
| Route | `GET /api/list/remove-item` | Removes an item from a user list. |
| Route | `GET /api/list/reorder` | Reorders items within a user list. |
| Route | `GET /api/list/user-lists` | Retrieves all lists for the authenticated user. |
| Route | `GET /api/lists/by-slugs` | Retrieves multiple lists by a list of slugs. |
| Route | `GET /api/lists/public` | Retrieves public user lists. |
| Route | `GET /api/movie/[id]/awards` | Retrieves awards for a specific movie. |
| Route | `GET /api/movie/[id]/credits` | Retrieves credits for a specific movie. |
| Route | `GET /api/movie/[id]/external-links` | Retrieves external links for a specific movie. |
| Route | `GET /api/movie/[id]/images` | Retrieves images for a specific movie. |
| Route | `GET /api/movie/[id]/releases` | Retrieves release information for a specific movie. |
| Route | `GET /api/movie/[id]/soundtracks` | Retrieves soundtracks for a specific movie. |
| Route | `GET /api/movie/[id]/videos` | Retrieves videos for a specific movie. |
| Route | `GET /api/movie/[id]` | Retrieves detailed information for a specific movie. |
| Route | `GET /api/movie/category/[name]` | Retrieves movies by category. |
| Route | `GET /api/movie/discover` | Discovers movies based on various filters. |
| Route | `GET /api/movie/followed` | Retrieves movies from followed production companies/streaming platforms. |
| Route | `GET /api/movie/trending` | Retrieves trending movies. |
| Route | `GET /api/news` | Retrieves news articles. |
| Route | `GET /api/noir/enrichment` | Retrieves noir enrichment data. |
| Route | `GET /api/noir/historical` | Retrieves noir historical data. |
| Route | `GET /api/notification/mark-all-read` | Marks all user notifications as read. |
| Route | `GET /api/notification/mark-read` | Marks a specific notification as read. |
| Route | `GET /api/notification/mark-unread` | Marks a specific notification as unread. |
| Route | `GET /api/notifications` | Retrieves user notifications. |
| Route | `GET /api/person/[id]/awards` | Retrieves awards for a specific person. |
| Route | `GET /api/person/[id]/credits` | Retrieves credits for a specific person. |
| Route | `GET /api/person/[id]/images` | Retrieves images for a specific person. |
| Route | `GET /api/person/[id]` | Retrieves detailed information for a specific person. |
| Route | `GET /api/production-company/[id]` | Retrieves details for a specific production company. |
| Route | `GET /api/production-companies` | Retrieves a list of all production companies. |
| Route | `GET /api/rating/add` | Adds a rating for a movie or TV show. |
| Route | `GET /api/rating/delete` | Deletes a rating for a movie or TV show. |
| Route | `GET /api/rating/edit` | Edits an existing rating. |
| Route | `GET /api/rating/user-ratings` | Retrieves user ratings. |
| Route | `GET /api/search` | Performs a general search across content types. |
| Route | `GET /api/streaming-platform/[id]` | Retrieves details for a specific streaming platform. |
| Route | `GET /api/streaming-platforms` | Retrieves a list of all streaming platforms. |
| Route | `GET /api/title-overrides` | Retrieves custom title override data. |
| Route | `GET /api/tracking/add` | Adds watch progress for a movie or TV show. |
| Route | `GET /api/tracking/delete` | Deletes watch progress for a movie or TV show. |
| Route | `GET /api/tracking/edit` | Edits watch progress for a movie or TV show. |
| Route | `GET /api/tracking/user-tracking` | Retrieves user watch progress. |
| Route | `GET /api/tv/[id]/awards` | Retrieves awards for a specific TV show. |
| Route | `GET /api/tv/[id]/credits` | Retrieves credits for a specific TV show. |
| Route | `GET /api/tv/[id]/episodes` | Retrieves episodes for a specific TV show. |
| Route | `GET /api/tv/[id]/external-links` | Retrieves external links for a specific TV show. |
| Route | `GET /api/tv/[id]/images` | Retrieves images for a specific TV show. |
| Route | `GET /api/tv/[id]/soundtracks` | Retrieves soundtracks for a specific TV show. |
| Route | `GET /api/tv/[id]/videos` | Retrieves videos for a specific TV show. |
| Route | `GET /api/tv/[id]` | Retrieves detailed information for a specific TV show. |
| Route | `GET /api/tv/category/[name]` | Retrieves TV shows by category. |
| Route | `GET /api/tv/discover` | Discovers TV shows based on various filters. |
| Route | `GET /api/tv/followed` | Retrieves TV shows from followed production companies/streaming platforms. |
| Route | `GET /api/tv/trending` | Retrieves trending TV shows. |
| Route | `GET /api/user/[alias]` | Retrieves public user profile information. |
| Route | `GET /api/user/follow` | Follows a user, production company, or streaming service. |
| Route | `GET /api/user/following` | Retrieves the list of entities a user is following. |
| Route | `GET /api/user/login` | Handles user login. |
| Route | `GET /api/user/logout` | Handles user logout. |
| Route | `GET /api/user/me` | Retrieves the authenticated user's profile. |
| Route | `GET /api/user/notifications` | Retrieves user notification settings. |
| Route | `GET /api/user/password-recovery` | Handles password recovery requests. |
| Route | `GET /api/user/register` | Handles user registration. |
| Route | `GET /api/user/settings` | Updates user settings. |
| Route | `GET /api/user/unfollow` | Unfollows a user, production company, or streaming service. |
| Route | `GET /api/user/update-avatar` | Updates a user's avatar. |
| Route | `GET /api/user/update-password` | Updates a user's password. |
| Route | `GET /api/user/update-privacy` | Updates user privacy settings. |
| Route | `GET /api/user/verify-email` | Verifies a user's email address. |
| Route | `GET /api/utils/vimeo-oembed` | Retrieves Vimeo oEmbed data. |
| Route | `GET /api/watchlist/add` | Adds an item to the user's watchlist. |
| Route | `GET /api/watchlist/delete` | Deletes an item from the user's watchlist. |
| Route | `GET /api/watchlist/user-watchlist` | Retrieves the user's watchlist. |
| Workflow | `.github/workflows/gitset-knowledge.yml` | Incrementally refreshes the project's AI knowledge base. |
| Workflow | `.github/workflows/sync-hero-data.yml` | Synchronizes hero and noir enrichment data. |
| Workflow | `.github/workflows/sync-noir-historical.yml` | Synchronizes N.O.I.R historical data and regenerates noir enrichment data. |

## Core Components
*   **(root)**: Defines the core Nuxt application, including configuration, Docker setup, and the main Vue app component.
*   **components**: Houses all reusable Vue components, from generic cards and carousels to specific festival badges and modals.
*   **composables**: Provides Vue composables for reactive logic, such as consent management.
*   **layouts**: Defines the default application layout, including navigation and modals.
*   **middleware**: Contains Nuxt middleware for client-side authentication and route protection.
*   **mixins**: Offers Vue mixins for common functionalities like carousel management, data enrichment, filtering, and utility functions.
*   **pages**: Contains all application pages, covering content discovery, festival details, user profiles, and settings.
*   **plugins**: Nuxt plugins for global functionalities like an event bus and lazy loading images.
*   **public**: Stores static assets and the Progressive Web App (PWA) manifest and service worker.
*   **scripts**: Contains one-shot and synchronization scripts for database seeding and data fetching.
*   **server/api**: Implements all API endpoints for data retrieval, user interactions, and content management.
*   **server/data**: Stores static data, such as `awards.json`.
*   **server/middleware**: Server-side middleware for request processing.
*   **server/plugins**: Server-side plugins for Nuxt.
*   **server/routes**: Defines server-side routes.
*   **server/types**: Contains TypeScript type definitions for server-side code.
*   **server/utils**: Provides server-side utility functions, including database interaction (`db.ts`) and RSS feed generation (`rss-feed.ts`).
*   **services**: Contains service-layer logic.
*   **stores**: Manages application state using Pinia.
*   **types**: Contains TypeScript type definitions for client-side code.
*   **utils**: Provides client-side utility functions.

## Data Flow
1.  User interacts with the client-side application (e.g., navigates to a page, performs a search).
2.  Vue components in [components/](../../components/) and [pages/](../../pages/) dispatch actions or make API calls.
3.  Client-side logic, potentially using [composables/useConsentGuard.js](../../composables/useConsentGuard.js) or [mixins/Details.js](../../mixins/Details.js), prepares requests.
4.  Requests are sent to the Nuxt server, handled by routes defined in [server/api/](../../server/api/) or [server/routes/](../../server/routes/).
5.  Server-side API endpoints (e.g., [server/api/movie/[id].get.ts](../../server/api/imdb-rating/[id].get.ts)) process the request, often interacting with the database via [server/utils/db.ts](../../server/utils/db.ts).
6.  Data may be enriched or transformed using utilities in [server/utils/](../../server/utils/) or static data from [server/data/awards.json](../../server/data/awards.json).
7.  The server responds with data, which is then received by the client.
8.  Client-side components render the received data, updating the UI.
9.  User authentication is managed by [middleware/auth.global.ts](../../middleware/auth.global.ts) on the client and corresponding API routes on the server.

## External Dependencies
*   `~`: Used for various internal module imports.
*   `~~`: Used for various internal module imports.
*   `h3`: Web framework for Nuxt server routes.
*   `vue`: Core JavaScript framework for building user interfaces.
*   `@/components`: Alias for importing components.
*   `@libsql/client`: Client for interacting with the Turso database.
*   `vue-router`: Official router for Vue.js.
*   `@/utils`: Alias for importing utility functions.
*   `fs`: Node.js file system module (server-side).
*   `path`: Node.js path module (server-side).
*   `pinia`: State management library for Vue.js.
*   `striptags`: Used for stripping HTML tags from strings.
*   `url`: Node.js URL module (server-side).
*   `#imports`: Nuxt auto-imports.
*   `dotenv`: Loads environment variables from a `.env` file.
