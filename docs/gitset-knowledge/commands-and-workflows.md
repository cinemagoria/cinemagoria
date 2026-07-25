# Commands & Workflows

## Package Scripts

| Script        | Command          | Description                                                                     |
| :------------ | :--------------- | :------------------------------------------------------------------------------ |
| `build`       | `nuxt build`     | Builds the Nuxt application for production.                                     |
| `dev`         | `nuxt dev`       | Starts the Nuxt development server.                                             |
| `generate`    | `nuxt generate`  | Generates the Nuxt application for static deployment.                           |
| `preview`     | `nuxt preview`   | Locally previews the Nuxt application built for production.                     |
| `postinstall` | `nuxt prepare`   | Prepares the Nuxt project after dependencies are installed.                     |

## CLI Commands

*   `node scripts/seed_tribeca_2026_awards.cjs` — Seeds the `festival_awards` table with 2026 Tribeca Festival feature film award winners.

## CI Workflows

*   [gitset-knowledge.yml](../../.github/workflows/gitset-knowledge.yml): Incrementally refreshes the project's AI knowledge base using Gitset, creating a pull request for changes. Triggered on `workflow_dispatch` and `push` to `main` (excluding docs, markdown, gitignore, LICENSE).
*   [sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml): Automates the synchronization of hero enrichment data from a Turso database into JSON files, committing and pushing updates. Triggered on `schedule` (cron: '0 6 * * *') and `workflow_dispatch`.
*   [sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml): Automates the synchronization of N.O.I.R historical data and regenerates noir enrichment data, committing the updated JSON file. Triggered on `workflow_dispatch`.

## Common Tasks

*   **Building for production**: Use `npm run build` or `yarn build`.
*   **Running in development**: Use `npm run dev` or `yarn dev`.
*   **Generating static site**: Use `npm run generate` or `yarn generate`.
*   **Previewing production build**: Use `npm run preview` or `yarn preview`.
*   **Post-installation setup**: `npm run postinstall` or `yarn postinstall` prepares the Nuxt project.
*   **Seeding Tribeca 2026 awards**: Run `node scripts/seed_tribeca_2026_awards.cjs`.
*   **Synchronizing custom overrides**: The `scripts/syncCustomOverrides.js` script fetches custom title override data from the `title_overrides` Turso database table and writes it to a JSON file.
*   **Synchronizing hero data**: The `scripts/syncHeroData.js` script retrieves hero selection data from the `hero_selections` Turso database table and saves it as a JSON file.
*   **Synchronizing Noir enrichment data**: The `scripts/syncNoirEnrichmentData.js` script fetches enrichment data for 'noir historical' titles from the `noir_historical` Turso database table and writes it to a JSON file.
*   **Synchronizing Noir historical data**: The `scripts/syncNoirHistorical.js` script synchronizes new hero selections into the `noir_historical` Turso database table, optionally fetching Spanish titles from TMDB.
