# Developer Guide

## Prerequisites

To develop on Cinemagoria, you need:

*   Node.js (v18 or later recommended)
*   npm or Yarn
*   A modern web browser

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
3.  **Prepare Nuxt.js**:
    ```bash
    npm run postinstall
    ```
4.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Project Layout

*   [.github/](../../.github/) - GitHub Actions workflows for CI/CD and automation.
*   [assets/](../../assets/) - Static assets like images, fonts, and stylesheets.
*   [components/](../../components/) - Reusable Vue components.
*   [pages/](../../pages/) - Vue components defining the application's routes and views.
*   [public/](../../public/) - Static files served directly, such as `manifest.json`.
*   [server/](../../server/) - Backend API routes, middleware, and utilities.

## Testing

The provided structural digest and file summaries do not contain information about testing frameworks, test files, or testing scripts.

## Release & Deployment

Cinemagoria uses Google Cloud Build for deployment. The [cloudbuild.yaml](../../cloudbuild.yaml) configuration builds a Docker image, pushes it to Google Artifact Registry, and updates a Cloud Run service.

To build the application for production:

```bash
npm run build
```

To generate static files:

```bash
npm run generate
```

To preview the production build locally:

```bash
npm run preview
