# Cannes 2026 — Official Screenings Ingestion (Batch 4)

Audit trail for the data-only batch that closes the Cannes 2026 milestone.
This document records *what* was inserted, *where it came from*, and *how to
verify or reproduce* the import. The page renderer at
[`pages/festival/cannes-2026/index.vue`](../../pages/festival/cannes-2026/index.vue)
and the API at
[`server/api/festival/cannes/schedule.get.ts`](../../server/api/festival/cannes/schedule.get.ts)
are unchanged — they were already wired in Batch 1 behind the
`showSchedulePending = (screenings.length === 0)` conditional and now serve
the live schedule.

## Source

Official PDF released by Festival de Cannes on **2026-05-07**, manually
transcribed and disambiguated against `festival_films.tmdb_data` to keep the
1-to-1 mapping with our catalog auditable.

## What was inserted

* Table: `festival_screenings`
* Rows: **264**
* Films covered: **112 / 112** supported features (full coverage)
* Date range: **2026-05-12 → 2026-05-23** (12 festival days)
* Time format: ISO 8601 with offset, e.g. `2026-05-12T20:00:00+02:00`
* `time_zone`: `CEST` (Europe/Paris)
* `is_in_person = 1`, `is_online = 0`, `is_sold_out = 0`

### Rows by category

| Category             | Screenings |
| -------------------- | ---------: |
| QUINZAINE            |         57 |
| COMPETITION          |         55 |
| ACID                 |         42 |
| UN CERTAIN REGARD    |         35 |
| CRITICS' CHOICE      |         30 |
| CANNES PREMIERE      |         17 |
| SPECIAL SCREENINGS   |         13 |
| OUT OF COMPETITION   |          9 |
| MIDNIGHT SCREENINGS  |          5 |
| FAMILY SCREENING     |          1 |

### Rows by venue

| Venue                  | Screenings |
| ---------------------- | ---------: |
| Grand Théâtre Lumière  |         55 |
| Théâtre Croisette      |         42 |
| Salle Agnès Varda      |         38 |
| Salle Debussy          |         35 |
| Espace Miramar         |         30 |
| Les Arcades            |         28 |
| Alexandre III          |         10 |
| Studio 13              |          9 |
| Salle Bazin            |          6 |
| Olympia                |          5 |
| Le Raimu               |          5 |
| Salle Buñuel           |          1 |

## Out of scope (explicit exclusions)

The PDF lists material outside Cinemagoria's catalog scope. These are
intentionally not ingested:

* Cannes Classics revivals
* Cinéma de la Plage open-air programme
* Shorts and student programs
* Masterclasses (Rendez-vous avec Peter Jackson / Cate Blanchett /
  Tilda Swinton)
* Opening / closing ceremonies and prize-giving

## Title disambiguation

Several entries in the PDF do not match our catalog title verbatim. The
non-obvious mappings, verified against `festival_films.tmdb_data`:

| PDF title                              | Catalog title                          |
| -------------------------------------- | -------------------------------------- |
| `THE MATCH`                            | `El Partido`                           |
| `L'AFFAIRE MARIE-CLAIRE`               | `Gisèle - Au nom de toutes`            |
| `LE JOURNAL D'UNE FEMME DE CHAMBRE`    | `Femme De Chambre` (Radu Jude)         |
| `MARIE MADELEINE`                      | `Maria Magdalena`                      |
| `KOKUROJO`                             | `The Samurai and the Prisoner`         |
| `GUN-CHE`                              | `Colony`                               |
| `CENIZA EN LA BOCA`                    | `A Mouthful of Ash`                    |
| `LA BATAILLE DE GAULLE`                | `De Gaulle: Tilting Iron (Film 1)`     |

## Verification queries

```sql
-- Total screenings for Cannes 2026 (expected: 264)
SELECT COUNT(*) FROM festival_screenings fs
JOIN festival_films ff ON ff.id = fs.film_id
WHERE ff.festival_name = 'Cannes Film Festival'
  AND ff.festival_year = 2026;

-- Films with no screening (expected: 0)
SELECT ff.id, ff.title, ff.category
FROM festival_films ff
LEFT JOIN festival_screenings fs ON fs.film_id = ff.id
WHERE ff.festival_name = 'Cannes Film Festival'
  AND ff.festival_year = 2026
GROUP BY ff.id
HAVING COUNT(fs.id) = 0;
```

API smoke check:

```http
GET /api/festival/cannes/schedule
→ { "success": true, "count": 264, "schedule_pending": false, "results": [...] }
```

## Idempotency / rerun

`festival_screenings` has no UNIQUE constraint on
`(film_id, start_time, venue)`. The import script aborts the transaction if
any row references an unknown `film_id` and prints a per-film coverage report
before running. To re-import, delete the existing Cannes 2026 rows first:

```sql
DELETE FROM festival_screenings
WHERE film_id IN (
  SELECT id FROM festival_films
  WHERE festival_name = 'Cannes Film Festival' AND festival_year = 2026
);
```

The ingestion script and verification helpers live in the
`cinemagoria-festivals-support` repo (out of scope for this repo).

## Cache invalidation post-deploy

* Nitro `routeRules` cache `/api/festival/**` for 1 h and `/festival/**` for
  2 h. After deploy, purge Cloudflare for `/festival/cannes-2026` and
  `/api/festival/cannes/*` so users see the new schedule immediately rather
  than waiting for the natural TTL.

## Related

* Parent issue: #250
* Sub-issues: #313 (Batch 1), #322 (Batch 2), #326 (Batch 3), #345 (Batch 4)
