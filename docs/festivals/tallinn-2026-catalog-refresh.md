# Tallinn Black Nights 2026 — Catalog Refresh (Batch 7)

Audit trail for the refresh of 16 October 2026, between the third wave (#579)
and the complete programme due on 31 October. Tracked in #582 (parent #546).

## Why

The festival announced nothing new. Two things changed outside the catalog:

* TMDB now lists titles that were stored without `tmdb_id`, because they had no
  entry when they were imported.
* The festival scheduled one more screening for a title already in the catalog.

## Matching rule

Every row without `tmdb_id` was matched against TMDB again. A match is accepted
only when the **original title, director, production countries and runtime** all
agree with the festival's film page. A runtime one minute apart is accepted for
shorts. Candidates that match only by title are rejected, and so is any
candidate that cannot be confirmed on every one of those points.

| Outcome | Rows |
| --- | ---: |
| Matched (12 features, 3 shorts) | 15 |
| Rejected: title only, different director | 8 |
| Rejected: not confirmable (no director on the festival's page, or a different original title) | 2 |
| No candidate on TMDB | 35 |

On matched rows only `tmdb_id`, `tmdb_data`, `imdb_id`, the poster and the
runtime changed. 2 of the 15 bring a TMDB poster; the other 13 keep the
festival's still, which the films endpoint falls back to.

## Screenings

1 screening added, with cinema and hall, as ISO 8601 with `+02:00`. The importer
skips any screening already stored with the same film, start time and venue.

## State after the refresh

* 240 titles and 373 screenings, the same as the festival's site.
* 195 rows with `tmdb_id`, which the page shows. The 45 without one are all
  shorts.

A rollback snapshot was written before each write. No title, director or
section changed, and no other festival's rows were touched.

## Verification queries

```sql
-- Rows with and without tmdb_id (expected: 195 / 45)
SELECT SUM(tmdb_id IS NOT NULL), SUM(tmdb_id IS NULL) FROM festival_films
WHERE festival_name = 'Tallinn Black Nights Film Festival' AND festival_year = 2026;

-- Screenings (expected: 373)
SELECT COUNT(*) FROM festival_screenings s
JOIN festival_films f ON f.id = s.film_id
WHERE f.festival_name = 'Tallinn Black Nights Film Festival' AND f.festival_year = 2026;
```
