# Commands & Workflows

This document outlines the command-line interface (CLI) commands, package scripts, and continuous integration (CI) workflows used within the Cinemagoria project.

## Package Scripts

The following scripts are defined in the `package.json` file for common development and build tasks:

| Script      | Command         | Description                                                      |
| :---------- | :-------------- | :--------------------------------------------------------------- |
| `build`     | `nuxt build`    | Builds the Nuxt.js application for production.                   |
| `dev`       | `nuxt dev`      | Runs the Nuxt.js application in development mode.                |
| `generate`  | `nuxt generate` | Generates the Nuxt.js application for static deployment.         |
| `preview`   | `nuxt preview`  | Locally previews the Nuxt.js application after a build.          |
| `postinstall` | `nuxt prepare` | Prepares the Nuxt.js project after dependencies are installed.   |

## CLI Commands

* `node scripts/seed_tribeca_2026_awards.cjs` — Seeds the `festival_awards` table with 2026 Tribeca Festival feature film award winners, including bilingual fields (EN/ES).

## CI Workflows

The Cinemagoria repository uses GitHub Actions for continuous integration. The following workflow files are configured:

*   [.github/workflows/gitset-knowledge.yml](../../.github/workflows/gitset-knowledge.yml): Refreshes the project's AI knowledge base incrementally using Gitset, creating a pull request for changes. Triggered on `workflow_dispatch` and `push` to the `main` branch (excluding `docs`, `markdown`, `.gitignore`, `LICENSE`).
*   [.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml): Automates synchronization of hero enrichment data from a Turso database into JSON files, committing and pushing updates. Triggered by a daily `schedule` (cron: `0 6 * * *`) and `workflow_dispatch`.
*   [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml): Automates synchronization of N.O.I.R historical data and regenerates noir enrichment data, committing the updated JSON file. Triggered by `workflow_dispatch`.

## Common Tasks

*   **Building the application**: Run `npm run build` or `yarn build`.
*   **Developing locally**: Run `npm run dev` or `yarn dev`.
*   **Generating static site**: Run `npm run generate` or `yarn generate`.
*   **Previewing a build**: Run `npm run preview` or `yarn preview`.
*   **Preparing Nuxt.js after install**: This is automatically handled by the `postinstall` script, running `nuxt prepare`.
