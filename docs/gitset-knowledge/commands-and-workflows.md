# Commands & Workflows

## Package Scripts

| Script        | Command          | Description                                                                  |
| :------------ | :--------------- | :--------------------------------------------------------------------------- |
| `build`       | `nuxt build`     | Builds the Nuxt application for production.                                  |
| `dev`         | `nuxt dev`       | Starts the Nuxt development server.                                          |
| `generate`    | `nuxt generate`  | Generates static files for the Nuxt application.                             |
| `preview`     | `nuxt preview`   | Previews the Nuxt build.                                                     |
| `postinstall` | `nuxt prepare`   | Prepares the Nuxt project after dependencies are installed.                  |

## CLI Commands

* `node scripts/seed_tribeca_2026_awards.cjs` — Seeds the `festival_awards` table with 2026 Tribeca Festival feature film award winners.

## CI Workflows

| Workflow                                     | Trigger                                    | Description                                                                                             |
| :------------------------------------------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| [.github/workflows/sync-hero-data.yml](../../.github/workflows/sync-hero-data.yml)         | `workflow_dispatch`, `schedule` (daily at 6 AM UTC) | Syncs and updates hero and noir enrichment data, then commits changes to the repository.                |
| [.github/workflows/sync-noir-historical.yml](../../.github/workflows/sync-noir-historical.yml) | `workflow_dispatch`                        | Manually syncs historical N.O.I.R. data and regenerates the `noir-enrichment.json` file, then commits. |

## Common Tasks

| Task                                  | Script/Command                                | Description
