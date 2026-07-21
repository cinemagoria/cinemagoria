# Architecture

## System Overview
Cinemagoria is a Nuxt.js application (v4.14.0) designed to help users discover movies and TV shows. It provides a rich user interface for browsing, searching, and tracking media content, including detailed information, festival coverage, and user-specific lists and ratings. The system integrates with external APIs for media data and uses a Turso database for internal data management. It supports user authentication, content following, and a progressive web application (PWA) experience.

## Entry Points
| Entry Point | Type | Description |
|---|---|---|
| `nuxt build` | Script | Builds the Nuxt.js application for production. |
| `nuxt dev` | Script | Starts the Nuxt.js development server. |
| `nuxt generate` | Script | Generates a static Nuxt.js application. |
| `nuxt preview` | Script | Locally previews a Nuxt.js production build. |
| `nuxt prepare` | Script | Prepares the Nuxt.js project after installation. |
| `node scripts/seed_tribeca_2026_awards.cjs` | Script | Seeds the `festival_awards` table with 2026 Tribeca Festival feature film award winners. |
| `workflow_dispatch` | GitHub Action | Manually triggers workflows for knowledge base refresh, hero data sync, and noir historical data sync. |
| `push` on `main` | GitHub Action | Triggers knowledge base refresh on pushes to the `main` branch (excluding docs, markdown, gitignore, LICENSE). |
| `schedule` (cron: '0 6 * * *') | GitHub Action | Triggers hero data synchronization daily at 6 AM UTC. |
| `/` | Route | Homepage displaying featured content, news, and festival banners. |
| `/auth-success` | Route | Handles post-authentication redirects. |
| `/awards` | Route | Displays a browsable list of major film awards. |
| `/changelog` | Route | Displays the platform's release changelog. |
| `/contact` | Route | Provides a contact form for user inquiries. |
| `/faq` | Route | Presents a Frequently Asked Questions page. |
| `/festival/:name-2026` | Route | Displays detailed information for specific 2026 film festivals (e.g., BAFICI, Berlinale, Cannes). |
| `/genre/:id/movie` | Route | Displays movies belonging to a specific genre. |
| `/genre/:id/tv` | Route | Displays TV shows belonging to a specific genre. |
| `/lists` | Route | Displays a user's custom lists. |
| `/lists/:slug` | Route | Displays a specific user-created list. |
| `/login` | Route | Login page displaying an authentication modal. |
| `/movie/:id` | Route | Displays detailed information for a specific movie. |
| `/movie/category/:name` | Route | Displays movies belonging to a specific category. |
| `/movie/followed` | Route | Displays content from followed movie-related entities. |
| `/movie` | Route | Main discovery page for movies. |
| `/news` | Route | Displays a feed of the latest news articles. |
| `/news/:slug` | Route | Displays a single news article. |
| `/noir` | Route | Displays the N.O.I.R Archive. |
| `/notifications` | Route | Displays user notifications. |
| `/person/:id` | Route | Displays detailed information for a specific person. |
| `/production-companies` | Route | Displays a grid of production companies. |
| `/production/:slug` | Route | Displays a detailed page for a specific production company. |
| `/recovery` | Route | Provides a user interface for password recovery. |
| `/register` | Route | Registration page displaying an authentication modal. |
| `/search` | Route | Dynamic search results page. |
| `/settings` | Route | User account settings management. |
| `/streaming-services` | Route | Displays a grid of streaming services. |
| `/streaming/:slug` | Route | Displays details for a specific streaming platform. |
| `/streaming/followed` | Route | Displays a user's followed streaming content. |
| `/tv/:id` | Route | Displays detailed information for a specific TV show. |
| `/tv/category/:name` | Route | Displays TV shows belonging to a specific category. |
| `/tv/followed` | Route | Displays TV shows that a user has followed. |
| `/tv` | Route | Main discovery page for TV shows. |
| `/u/:alias` | Route | Displays a user's public profile. |
| `/usage-policies` | Route | Presents the platform's usage policies. |
| `/watchlist` | Route | Displays a user's watchlist. |
| `/wip` | Route | Displays a 'Work in Progress' page. |
| `/api/article-report` | API Endpoint | Handles POST requests to report issues with articles. |
| `/api/article/:slug` | API Endpoint | Handles GET requests for a specific article by slug. |
| `/api/article/rss` | API Endpoint | Provides a permanent redirect to the canonical /feed URL. |
| `/api/articles/by-slugs` | API Endpoint | Retrieves multiple articles based on a list of slugs. |
| `/api/awards/index-page` | API Endpoint | Retrieves awards data for a specific award type and year. |
| `/api/awards` | API Endpoint | Retrieves awards data filtered by various criteria. |
| `/api/contact` | API Endpoint | Handles POST requests for the contact form. |
| `/api/festival-report` | API Endpoint | Handles POST requests to report issues with festival data. |
| `/api/festival/:festival/awards` | API Endpoint | Fetches award information for specific festivals (e.g., BAFICI, Berlinale). |
| `/api/festival/:festival/films` | API Endpoint | Retrieves films for specific festivals. |
| `/api/festival/:festival/schedule` | API Endpoint | Retrieves the screening schedule for specific festivals. |
| `/api/festival/films-batch` | API Endpoint | Fetches films for multiple festivals in a single request. |

## Core Components
*   `.github`: Manages GitHub Actions workflows for CI/CD and data synchronization.
*   `(root)`: Contains core application files like [app.vue](../../app.vue), [nuxt.config.ts](../../nuxt.config.ts), and Docker configurations.
*   `assets`: Stores static assets like images, fonts, and stylesheets.
*   `components`: Houses reusable Vue components for UI elements, cards, carousels, modals, and festival-specific displays.
*   `composables`: Provides reusable Vue composition functions, such as `useConsentGuard`.
*   `docs`: Contains project documentation.
*   `layouts`: Defines application layouts, including the [default.vue](../../layouts/default.vue) layout.
*   `middleware`: Implements Nuxt.js route middleware, like [auth.global.ts](../../middleware/auth.global.ts) for client-side authentication.
*   `mixins`: Offers reusable Vue mixins for carousel logic, media details, data formatting, and infinite scrolling.
*   `pages`: Contains Vue components for individual application routes and views.
*   `plugins`: Provides Nuxt.js plugins for global functionalities like an event bus and lazy loading.
*   `public`: Stores publicly accessible static files, including the PWA manifest and service worker.
*   `scripts`: Contains utility scripts for data seeding and synchronization with the database.
*   `server/api`: Implements API endpoints for data retrieval, user interactions, and festival-specific data.
*   `server/data`: Stores static data files, such as [awards.json](../../server/data/awards.json).
*   `server/middleware`: Implements server-side middleware.
*   `server/plugins`: Provides server-side Nuxt.js plugins.
*   `server/routes`: Defines server-side routes.
*   `server/types`: Contains TypeScript type definitions for server-side data.
*   `server/utils`: Provides server-side utility functions, including database interactions.
*   `services`: Contains service-layer logic for interacting with external APIs or databases.
*   `stores`: Implements Pinia stores for state management.
*   `types`: Contains TypeScript type definitions for client-side data.
*   `utils`: Provides client-side utility functions.

## Data Flow
1.  User interacts with the client-side application (Vue components in `components` and `pages`).
2.  Client-side components dispatch actions to Pinia stores (`stores`) or directly call server API endpoints (`server/api`).
3.  Nuxt.js middleware (`middleware`) can intercept requests for authentication or other global logic.
4.  Server API endpoints (`server/api`) receive requests.
5.  Server API endpoints utilize server-side utilities (`server/utils`) for tasks like database interaction (e.g., `server/utils/db.ts`) or data fetching.
6.  Some API endpoints may access static data files (`server/data/awards.json`).
7.  Server API endpoints process data and return responses to the client.
8.  Client-side components update the UI based on the received data.
9.  Background scripts (`scripts`) periodically synchronize data from external sources or databases (e.g., Turso) into local JSON files or the database.
10. GitHub Actions workflows (`.github/workflows`) automate data synchronization and knowledge base updates.

## External Dependencies
*   `~`: General alias for the project root.
*   `~~`: General alias for the project root.
*   `h3`: HTTP framework used by Nuxt.js server.
*   `vue`: Core JavaScript framework for building user interfaces.
*   `@/components`: Alias for the `components` module.
*   `@libsql/client`: Client for interacting with the Turso database.
*   `vue-router`: Official router for Vue.js.
*   `@/utils`: Alias for the `utils` module.
*   `fs`: Node.js file system module.
*   `path`: Node.js path module.
*   `pinia`: State management library for Vue.js.
*   `striptags`: Library for stripping HTML tags from strings.
*   `url`: Node.js URL module.
*   `#imports`: Nuxt.js auto-imports.
*   `dotenv`: Module to load environment variables from a `.env` file.
