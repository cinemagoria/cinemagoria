# Developer Guide

## Prerequisites

To develop with Cinemagoria, you need:

*   Node.js (version specified in [package.json](../../package.json))
*   npm (version specified in [package.json](../../package.json))

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
3.  **Prepare Nuxt:**
    ```bash
    npm run postinstall
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:3000`.

## Project Layout

*   `.github`: GitHub Actions workflows and funding configuration.
*   `assets`: Static assets like images and fonts.
*   `components`: Reusable Vue components, including global, common, and festival-specific UI elements.
*   `composables`: Vue composables for reusable logic.
*   `layouts`: Vue layouts defining the overall structure of pages.
*   `middleware`: Nuxt middleware for route protection and other global logic.
*   `pages`: Vue components representing application routes.
*   `plugins`: Nuxt plugins for extending Vue or Nuxt functionality.
*   `public`: Static files served directly, like `manifest.json` and `sw.js`.
*   `scripts`: One-shot Node.js scripts for data synchronization and seeding.
*   `server`: Backend API routes, middleware, and utilities.
*   `stores`: Pinia stores for state management.
*   `types`: TypeScript type definitions.
*   `utils`: General utility functions.

## Testing

The provided structural digest and file summaries do not contain information about testing frameworks, scripts, or conventions.

## Release & Deployment

Cinemagoria uses Google Cloud Build for building and deploying Docker images to Google Cloud Run. The deployment process is configured in [cloudbuild.yaml](../../cloudbuild.yaml) and involves:

1.  Building a Docker image based on the [Dockerfile](../../Dockerfile).
2.  Pushing the image to Google Artifact Registry.
3.  Deploying the image to the `cinemagoria-main` service on Google Cloud Run.

To generate a static site for deployment:

```bash
npm run generate
```

To preview a production build locally:

```bash
npm run preview
