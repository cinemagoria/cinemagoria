# Commands & Workflows

This document outlines the command-line interface (CLI) commands, package scripts, and continuous integration (CI) workflows for the Cinemagoria project.

## Package Scripts

The following scripts are defined in the `package.json` file for various development and build tasks:

| Script      | Command           | Description                                                                  |
| :---------- | :---------------- | :--------------------------------------------------------------------------- |
| `build`     | `nuxt build`      | Builds the Nuxt.js application for production.                               |
| `dev`       | `nuxt dev`        | Starts the Nuxt.js development server.                                       |
| `generate`  | `nuxt generate`   | Generates the Nuxt.js application for static hosting.                        |
| `preview`   | `nuxt preview`    | Previews the Nuxt.js production build locally.                               |
| `postinstall` | `nuxt prepare`    | Prepares the Nuxt.js project after dependencies are installed.               |

## CLI Commands

*   `node scripts/seed_tribeca_2026_awards.cjs` — Seeds the `festival_awards` table with 2026 Tribeca Festival feature film award winners.

## CI Workflows

The project uses GitHub Actions for continuous integration and automation.

| Workflow                                     | Trigger(s)                                                                                              | Description                                                                                             |
| :------------------------------------------- | :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------ |
| [.github/workflows/gitset-knowledge.yml](../../.github/workflows/gitset-knowledge.yml) | `workflow_dispatch`, `push` on `main` (excluding `docs`, `markdown`, `.gitignore`, `LICENSE`) | Incrementally refreshes the project's AI knowledge base using Gitset and creates a pull request.        |
| [.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml)     | `cron: 0 6 * * *`, `workflow_dispatch`                                                                  | Automates the synchronization of hero and noir enrichment data, committing updated JSON files.          |
| [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml) | `workflow_dispatch`                                                                                     | Automates the synchronization of N.O.I.R historical data and regenerates noir enrichment data.          |

## Common Tasks

*   **Building the application**: Run `npm run build` or `yarn build`.
*   **Running the development server**: Run `npm run dev` or `yarn dev`.
*   **Generating static site**: Run `npm run generate` or `yarn generate`.
*   **Previewing a production build**: Run `npm run preview` or `yarn preview`.
*   **Seeding Tribeca 2026 awards data**: Execute `node scripts/seed_tribeca_2026_awards.cjs`.
