# Architecture

## System Overview
Cinemagoria is a Nuxt.js application designed to help users discover movies and TV shows. It provides features such as personalized recommendations, festival coverage, news articles, and user-managed watchlists. The application leverages a multi-stage Docker build process for deployment to Google Cloud Run and uses a Turso database for data storage. GitHub Actions workflows automate data synchronization and knowledge base refreshes.

## Entry Points
The application provides several entry points for interaction:

| Type | Name | Description |
|---|---|---|
| **Web Interface** | `/` | The main homepage for browsing content. |
| **Web Interface** | `/login` | Displays the authentication modal for user login. |
| **Web Interface** | `/register` | Displays the authentication modal with the registration tab pre-selected. |
| **Web Interface** | `/search` | Global search functionality for various content types. |
| **Web Interface** | `/movie/[id]` | Detailed information page for a specific movie. |
| **Web Interface** | `/tv/[id]` | Detailed information page for a specific TV show. |
| **Web Interface** | `/person/[id]` | Detailed information page for a specific person. |
| **Web Interface** | `/news/[slug]` | Displays a single news article. |
| **Web Interface** | `/festival/:festival-year` | Pages for specific film festivals (e.g., `/festival/cannes-2026`). |
| **API Route** | `/api/*` | Various API endpoints for data retrieval and submission (e.g., `/api/article/[slug]`, `/api/contact`). |
| **CLI Script** | `build` | Builds the Nuxt.js application for production. |
| **CLI Script** | `dev` | Starts the Nuxt.js development server. |
| **CLI Script** | `generate` | Generates a static Nuxt.js application. |
| **CLI Script** | `preview` | Previews the Nuxt.js production build. |
| **CLI Script** | `postinstall` | Prepares the Nuxt.js project after installation. |
| **CLI Script** | `node scripts/seed_tribeca_2026_awards.cjs` | Seeds the database with Tribeca 2026 awards data. |

## Core Components
*   **app.vue**: The root Vue component defining the main layout and structured data for SEO.
*   **components**: Reusable Vue components for UI elements like cards, carousels, modals, and navigation.
*   **composables**: Vue composables for reusable logic, such as `useConsentGuard`.
*   **layouts**: Defines application layouts, with `default.vue` providing the main structure.
*   **middleware**: Nuxt.js middleware for route protection and client-side authentication.
*   **mixins**: Vue mixins for common functionalities like carousel management, data formatting, and infinite scrolling.
*   **pages**: Vue components representing individual application pages and their routes.
*   **plugins**: Nuxt.js plugins for global functionalities like an event bus and lazy loading.
*   **server/api**: API endpoints for handling data requests and business logic.
*   **server/middleware**: Server-side middleware for request processing.
*   **server/plugins**: Server-side plugins for extending Nuxt's server capabilities.
*   **server/routes**: Server-side routes for specific functionalities.
*   **server/utils**: Server-side utility functions, including database interactions.
*   **services**: Modules for interacting with external APIs and services.
*   **stores**: Pinia stores for managing application state.
*   **utils**: Client-side utility functions.

## Data Flow
1.  User interacts with the client-side application (e.g., navigates to a page, performs a search).
2.  Vue components dispatch actions or make API calls to the Nuxt.js server.
3.  Server-side API routes (`server/api/*`) handle the requests.
4.  API routes interact with the database (Turso) or external services (e.g., TMDB).
5.  Data is retrieved, processed, and returned to the client.
6.  Client-side Pinia stores update the application state.
7.  Vue components react to state changes and render updated UI.
8.  For authentication, `middleware/auth.global.ts` checks for a local access token and redirects if necessary.
9.  GitHub Actions workflows (`.github/workflows/*.yml`) periodically synchronize data from the Turso database into JSON files or refresh the AI knowledge base.

## External Dependencies
*   **Nuxt.js**: The web framework for building the application.
*   **Vue.js**: The progressive JavaScript framework for building user interfaces.
*   **Pinia**: The state management library for Vue.js.
*   **h3**: A performant HTTP framework used by Nuxt.js server routes.
*   **@libsql/client**: Client for interacting with the Turso database.
*   **dotenv**: For loading environment variables.
*   **striptags**: For sanitizing HTML input.
*   **mitt**: Used for the global event bus.
*   **Google Cloud Run**: Deployment platform for the Docker image.
*   **Google Cloud Build**: CI/CD service for building and deploying the application.
*   **GitHub Actions**: For automated workflows (data sync, knowledge base refresh).
*   **TMDB (The Movie Database)**: External API for movie and TV show data.
*   **Vimeo**: External service for video embedding.
*   **YouTube**: External service for video playback.
*   **MusicBrainz**: External service for soundtrack information.
*   **IMDb, Letterboxd, Rotten Tomatoes, Trakt**: External links for media information.
