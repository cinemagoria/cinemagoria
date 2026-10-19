# Thessaloniki 2026 — Third Wave (Batch 7)

Audit trail for the import of 18 October 2026, after the catalog refresh
(#583). Tracked in #591 (parent #545).

## Why

On 16 October the festival announced its NextGen section, for children and
teenagers: 8 features and 8 shorts, screened for schools and at family
screenings. None of them was in the catalog.

## What was imported

| Section | Titles |
| --- | ---: |
| NextGen | 16 |

Every row carries the director, year, runtime and synopsis the festival
published. `source_url` is the festival's announcement, because the titles have
no film page on its site yet. Titles also selected by other festivals get their
own row here, as in earlier waves.

The announcement gives a few screening slots, but the timetable is not
published. No screenings were imported, so the Schedule tab keeps its pending
block until the full timetable is imported.

The section stays on the festival page and out of the release calendar, like
the children's sections of the other festivals.

## What was not imported

The same day the festival announced its industry works-in-progress showcase.
Those are films in post-production presented to sales agents, distributors and
programmers, not part of the public programme.

## Matching rule

A match is accepted only when the **title, director, production countries and
runtime** all agree with the festival's announcement. A runtime one minute apart
is accepted for shorts.

| Outcome | Rows |
| --- | ---: |
| Matched (5 features, 5 shorts) | 10 |
| Held: TMDB has no runtime, or gives another runtime | 4 |
| Rejected: title only, director spelled differently | 1 |
| No candidate on TMDB | 1 |

The 6 rows without `tmdb_id` are stored so they are not lost. The page shows a
row once it has one.

## State after the import

* 102 titles in 12 sections, no screenings.
* 82 rows with `tmdb_id`, which the page shows.

A rollback snapshot was written before the write. The 86 earlier rows were not
modified, and no other festival's rows were touched. A second run inserts
nothing.

## Verification queries

```sql
-- Rows of the new section, with and without tmdb_id (expected: 10 / 6)
SELECT SUM(tmdb_id IS NOT NULL), SUM(tmdb_id IS NULL) FROM festival_films
WHERE festival_name = 'Thessaloniki International Film Festival' AND festival_year = 2026
  AND category = 'NextGen';

-- Whole festival (expected: 102)
SELECT COUNT(*) FROM festival_films
WHERE festival_name = 'Thessaloniki International Film Festival' AND festival_year = 2026;
```
