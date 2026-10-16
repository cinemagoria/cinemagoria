# Thessaloniki 2026 — Catalog Refresh (Batch 6)

Audit trail for the refresh of 16 October 2026, between the second wave (#581)
and the rest of the competitions. Tracked in #583 (parent #545).

## Why

The festival announced nothing new. TMDB now lists one title that was stored
without `tmdb_id`, because it had no entry when it was imported.

## Matching rule

Every row without `tmdb_id` was matched against TMDB again. A match is accepted
only when it can be confirmed on every point the festival publishes. For the
matched row, the title, director and synopsis agree with the festival's
announcement. The same film is in another festival's catalog, matched to the
same TMDB entry, where the production countries and runtime agree with that
festival's film page.

| Outcome | Rows |
| --- | ---: |
| Matched | 1 |
| Rejected: title only, different director | 1 |
| No candidate on TMDB | 13 |

Only `tmdb_id`, `tmdb_data`, `imdb_id` and the runtime changed on the matched
row. TMDB has no poster for it yet and the festival published no still, so its
card shows without an image until TMDB adds a poster.

## State after the refresh

* 86 titles, no screenings yet.
* 72 rows with `tmdb_id`, which the page shows. Of the 14 without one, five
  belong to a tribute to a Greek filmmaker and TMDB does not list them; the
  other nine are new Greek titles.

A rollback snapshot was written before the write. No title, director or section
changed, and no other festival's rows were touched.

## Verification query

```sql
-- Rows with and without tmdb_id (expected: 72 / 14)
SELECT SUM(tmdb_id IS NOT NULL), SUM(tmdb_id IS NULL) FROM festival_films
WHERE festival_name = 'Thessaloniki International Film Festival' AND festival_year = 2026;
```
