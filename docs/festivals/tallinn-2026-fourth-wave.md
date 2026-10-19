# Tallinn Black Nights 2026 — Fourth Wave (Batch 8)

Audit trail for the import of 18 October 2026, between the catalog refresh
(#582) and the complete programme due on 31 October. Tracked in #590 (parent
#546).

## Why

The festival published its national short film competition: 26 shorts in five
blocks, each block with one screening. None of them was in the catalog.

## What was imported

Each short is its own row, keyed by the festival's id for that short, and
carries the screening of its block. Its `source_url` is the block's page on the
festival's site, because the festival publishes shorts only inside blocks.

| Section | Titles | Screenings |
| --- | ---: | ---: |
| Shorts National Competition | 26 | 26 |

Screenings carry cinema and hall, as ISO 8601 with `+02:00`. Some shorts are
also listed by the festival under other programmes; each row keeps the first
programme the festival lists, as in earlier waves.

## Matching rule

A match is accepted only when the **original title, director, production
countries and runtime** all agree with the festival's page. A runtime one minute
apart is accepted for shorts.

| Outcome | Rows |
| --- | ---: |
| Matched | 4 |
| Held: title and director agree, but TMDB has no runtime, lists another production country, or gives another runtime | 7 |
| Rejected: title only, different director | 5 |
| No candidate on TMDB | 10 |

The 22 rows without `tmdb_id` are stored so they are not lost. The page shows a
row once it has one.

## State after the import

* 266 titles in 22 sections and 399 screenings, the same as the festival's
  site.
* 199 rows with `tmdb_id`. The 67 without one are all shorts.

A rollback snapshot was written before the write. The 240 earlier rows and their
373 screenings were not modified, and no other festival's rows were touched. A
second run inserts nothing.

## Verification queries

```sql
-- Titles and screenings of the new section (expected: 26 / 26)
SELECT COUNT(DISTINCT f.id), COUNT(s.id) FROM festival_films f
LEFT JOIN festival_screenings s ON s.film_id = f.id
WHERE f.festival_name = 'Tallinn Black Nights Film Festival' AND f.festival_year = 2026
  AND f.category = 'Shorts National Competition';

-- Whole festival (expected: 266 / 399)
SELECT COUNT(DISTINCT f.id), COUNT(s.id) FROM festival_films f
LEFT JOIN festival_screenings s ON s.film_id = f.id
WHERE f.festival_name = 'Tallinn Black Nights Film Festival' AND f.festival_year = 2026;
```
