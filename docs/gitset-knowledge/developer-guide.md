# Developer Guide

## Prerequisites

To develop with Cinemagoria, you need:

*   Node.js (version 18 or later recommended)
*   npm or Yarn
*   A Turso database for local development (optional, but recommended for full functionality)

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/cinemagoria/cinemagoria.git
    cd cinemagoria
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
    The `postinstall` script will automatically run `nuxt prepare`.
3.  **Environment Variables:** Create a `.env` file in the root directory and configure necessary environment variables (e.g., database connection strings, API keys).
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Nuxt.js development server, typically accessible at `http://localhost:3000`.

## Project Layout

*   [.github/](../../.github/) — GitHub Actions workflows and funding configuration.
*   [assets/](../../assets/) — Static assets like images, fonts, or stylesheets.
*   [components/](../../components/) — Reusable Vue components, including global and festival-specific UI elements.
*   [composables/](../../composables/) — Vue composables for reusable logic.
*   [layouts/](../../layouts/) — Application layouts, such as the default layout.
*   [middleware/](../../middleware/) — Nuxt.js middleware for route protection and global logic.
*   [mixins/](../../mixins/) — Vue mixins for shared component logic.
*   [pages/](../../pages/) — Vue pages that define the application's routes.
*   [plugins/](../../plugins/) — Nuxt.js plugins for extending Vue or Nuxt functionality.
*   [public/](../../public/) — Static files served directly, like `manifest.json` and `sw.js`.
*   [scripts/](../../scripts/) — Utility scripts for data synchronization and seeding.
*   [server/api/](../../server/api/) — API endpoints for handling data requests.
*   [server/middleware/](../../server/middleware/) — Server-side middleware.
*   [server/routes/](../../server/routes/) — Server-side routes.
*   [server/utils/](../../server/utils/) — Server-side utility functions.
*   [stores/](../../stores/) — Pinia stores for state management.
*   [types/](../../types/) — TypeScript type definitions.
*   [utils/](../../utils/) — Client-side utility functions.

## Testing

The provided structural digest and file summaries do not contain information about testing frameworks, test files, or testing scripts.

## Release & Deployment

Cinemagoria uses Google Cloud Build and Google Cloud Run for deployment.

*   The [Dockerfile](../../Dockerfile) defines the Docker image.
*   [cloudbuild.yaml](../../cloudbuild.yaml) configures the build, push, and deployment process to Google Cloud Run.
*   The `build` script (`nuxt build`) is used to compile the application for production.
*   The `generate` script (`nuxt generate`) is used to pre-render all routes to static HTML files.
*   The `preview` script (`nuxt preview`) is used to locally preview your production build.
