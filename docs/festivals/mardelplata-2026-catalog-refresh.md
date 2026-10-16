# Mar del Plata 2026 — Catalog Refresh (Batch 6)

Audit trail for the refresh that followed the festival's announcements of
15 October 2026. It records what changed in `festival_films`, where each change
came from, and how to verify it. Tracked in #584 (parent #258).

## Source

Two announcements published on the festival's own site on 2026-10-15:

* One that places the circuit award winners already in the catalog in a strand
  of Panorama.
* One that presents a section whose titles were already in the catalog.

## What changed

| Change | Rows |
| --- | ---: |
| `category` set on rows that had none | 9 |
| `source_url` moved from press coverage to the official announcement | 12 |

The new strand is stored as `Panorama – Ganadoras de grandes festivales`, with
the same prefix as the other two Panorama strands, so the three sit together in
the catalog.

`source_url` follows one rule across the festival: the festival's film page
where one exists, otherwise its official announcement, and press coverage only
while the festival has published neither. The films endpoint exposes
`source_url` only when it points at the festival's site.

No title, director or `tmdb_id` changed, and no other festival's rows were
touched. A rollback snapshot of every row was written before each update.

## State after the refresh

* 73 titles, 16 sections, 0 rows without `category`.
* 18 of 73 rows with an official `source_url`.
* No screenings yet: the festival has not published its timetable.

## Page

`pages/festival/mardelplata-2026/index.vue` adds the strand to
`CATEGORY_ORDER` and to the section glossary of the Info tab. The programme
status note and the early-lineup notice no longer describe titles waiting for a
section.

## Verification queries

```sql
-- Rows without a section (expected: 0)
SELECT COUNT(*) FROM festival_films
WHERE festival_name = 'Mar del Plata International Film Festival'
  AND festival_year = 2026 AND category IS NULL;

-- Rows per section (expected: 16 sections, 73 rows)
SELECT category, COUNT(*) FROM festival_films
WHERE festival_name = 'Mar del Plata International Film Festival'
  AND festival_year = 2026
GROUP BY category ORDER BY category;

-- Rows with an official source (expected: 18)
SELECT COUNT(*) FROM festival_films
WHERE festival_name = 'Mar del Plata International Film Festival'
  AND festival_year = 2026 AND source_url LIKE 'https://mardelplatafilmfest.com/%';
```
