# Developer Guide

## Prerequisites

To develop with Cinemagoria, you need:

*   Node.js (version 18 or later)
*   npm (version 8 or later)

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
4.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Project Layout

*   [components/](../../components/): Vue components, including global, common, festival-specific, and media-specific components.
*   [layouts/](../../layouts/): Defines the default application layout.
*   [middleware/](../../middleware/): Nuxt route middleware, such as global authentication.
*   [pages/](../../pages/): Vue pages that define the application's routes and views.
*   [plugins/](../../plugins/): Nuxt plugins for global functionalities like an event bus or lazy loading.
*   [server/api/](../../server/api/): API endpoints for data fetching and submission.
*   [scripts/](../../scripts/): One-shot and synchronization scripts for data management.

## Testing

This repository does not contain dedicated test files.

## Release & Deployment

Cinemagoria uses GitHub Actions for continuous integration and deployment.

**CI Workflows:**

| Workflow                                                              | Trigger(s)                                                              | Description                                                                                             |
| :-------------------------------------------------------------------- | :---------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| [.github/workflows/gitset-knowledge.yml](../../.github/workflows/gitset-knowledge.yml) | `workflow_dispatch`, `push` on `main` (excluding docs, markdown, gitignore, LICENSE) | Incrementally refreshes the project's AI knowledge base using Gitset and creates a pull request.        |
| [.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml)     | `cron: 0 6 * * *`, `workflow_dispatch`                                  | Automates synchronization of hero and noir enrichment data, committing updated JSON files.              |
| [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml) | `workflow_dispatch`                                                     | Automates synchronization of N.O.I.R historical data and regenerates noir enrichment data.              |

**Deployment:**

The [cloudbuild.yaml](../../cloudbuild.yaml) file configures Google Cloud Build to:

*   Build a Docker image of the application.
*   Push the image to Artifact Registry.
*   Deploy the image to Cloud Run.
