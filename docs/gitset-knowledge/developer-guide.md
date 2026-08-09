# Developer Guide

## Prerequisites

To develop on Cinemagoria, you need:

*   Node.js (version 18 or later)
*   npm (Node Package Manager)

## Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/cinemagoria/cinemagoria.git
    cd cinemagoria
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Prepare Nuxt**:
    ```bash
    npm run postinstall
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Project Layout

*   [.github/](../../.github/) - GitHub Actions workflows and funding configuration.
*   [assets/](../../assets/) - Static assets like images, fonts, or stylesheets.
*   [components/](../../components/) - Reusable Vue components.
*   [composables/](../../composables/) - Vue composable functions for shared logic.
*   [layouts/](../../layouts/) - Application layouts.
*   [middleware/](../../middleware/) - Nuxt middleware for route handling.
*   [pages/](../../pages/) - Vue components for application routes.
*   [plugins/](../../plugins/) - Nuxt plugins for extending functionality.
*   [public/](../../public/) - Static files served directly.
*   [scripts/](../../scripts/) - Utility scripts for data synchronization and seeding.
*   [server/api/](../../server/api/) - API routes handled by the Nuxt server.
*   [server/middleware/](../../server/middleware/) - Server-side middleware.
*   [server/plugins/](../../server/plugins/) - Server-side Nuxt plugins.
*   [server/routes/](../../server/routes/) - Server-side routes.
*   [server/utils/](../../server/utils/) - Server-side utility functions.
*   [stores/](../../stores/) - Pinia stores for state management.
*   [types/](../../types/) - TypeScript type definitions.
*   [utils/](../../utils/) - Client-side utility functions.

## Testing

The provided structural digest and file summaries do not contain information about testing frameworks, test scripts, or test files. Therefore, no information can be provided for this section.

## Release & Deployment

The application uses Google Cloud Build and Docker for deployment.

*   **Docker Image Build**: The [Dockerfile](../../Dockerfile) defines the build process, including dependencies and environment setup for production.
*   **Cloud Build Configuration**: The [cloudbuild.yaml](../../cloudbuild.yaml) file configures Google Cloud Build to:
    *   Build a Docker image.
    *   Push the image to Artifact Registry.
    *   Deploy the image to Cloud Run.
*   **Nuxt Build**: The `npm run build` script executes `nuxt build` to compile the application for production.
*   **Nuxt Generate**: The `npm run generate` script executes `nuxt generate` to pre-render every route to HTML files.
*   **Nuxt Preview**: The `npm run preview` script executes `nuxt preview` to locally preview your production build.
