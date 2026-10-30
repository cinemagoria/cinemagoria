# Tallinn Black Nights 2026 — Complete Programme (Batch 9)

Audit trail for the import of 30 October 2026, when the festival's site carried
its complete programme. Tracked in #599 (parent #546).

## Why

The catalog held 266 titles in 22 sections and 399 screenings, everything the
festival had published by 18 October. The complete programme adds 232 titles
in 17 sections that were not in the catalog yet, and 660 screenings: 509 for the
new titles and 151 more for titles already listed.

## What was imported

Each title is its own row, keyed by the festival's id for it. Short films are
published inside blocks: each short is its own row, carries the screenings of
its block, and its `source_url` is the block's page on the festival's site. A
title the festival lists under several programmes keeps the first one, as in
earlier waves.

| Section | Titles | Screenings |
| --- | ---: | ---: |
| Shorts Alternatives | 45 | 96 |
| Shorts Panorama | 38 | 75 |
| Best of Festivals | 30 | 90 |
| Doc@Shorts | 22 | 22 |
| Best of Docs | 13 | 39 |
| Rebels With Their Shorts | 13 | 13 |
| Doc@PÖFF International Competition | 11 | 33 |
| Old Gold: Classic Films Come to Life | 11 | 16 |
| In Focus: the Baltic States | 9 | 16 |
| Midnight Shivers | 7 | 19 |
| Doc@PÖFF Baltic Competition | 7 | 21 |
| Estonian Olympic Committee Sports Film Programme | 7 | 21 |
| Special Screenings | 6 | 14 |
| Environmental and Science Film Programme | 6 | 18 |
| Standing with Ukraine | 4 | 11 |
| PÖFF Is Celebrating! This Is Where It All Began | 2 | 2 |
| Spotlight: Basque Audiovisual | 1 | 3 |
| **Total** | **232** | **509** |

Screenings carry cinema and hall, as ISO 8601 with `+02:00`. One new venue
appears in the timetable, Von Krahl in Tallinn.

One short of the national competition, *The Terror of the Gulls*, moved to
another block page with a new festival id. Its row was re-keyed to the new id
instead of being added twice.

## Matching rule

A match is accepted only when TMDB has the same **director** and the same
**original title**, a release within a year of the festival's, **production
countries** that all appear on the festival's page, and a **runtime** within one
minute for shorts and three minutes for features.

| Outcome | Rows |
| --- | ---: |
| Matched | 96 |
| Held: director, title and year agree, but TMDB lists another production country or none, another original title, or another runtime or none | 87 |
| Held: the candidate agrees only in part (title, director or year) | 19 |
| No candidate on TMDB | 30 |

Rows without `tmdb_id` are stored so they are not lost, and the page shows them
once they have one. The rows already in the catalog without `tmdb_id` were
matched again under the same rule: 2 of the 67 now have one.

## Festival page

- The 17 new sections join the catalog order: the documentary competitions and
  the out-of-competition programmes after the main competitions, and the short
  film programmes after the short film competitions.
- The Info tab's glossary describes each of them, with localized labels on the
  Spanish frontend.
- The programme status note describes the complete programme, the venue list
  adds Von Krahl, and the early-lineup notice is turned off.

## State after the import

* 498 titles in 39 sections and 1,059 screenings: the 1,050 on the festival's
  site, plus nine earlier times of screenings the festival has since moved,
  which the additive import leaves in place.
* 297 rows with `tmdb_id`. The 201 without one are stored for later matching.

A rollback snapshot was written before each write. The import is additive and
festival-scoped: earlier rows were not modified apart from the re-keyed short,
and no other festival's rows were touched. A second run inserts nothing.

## Verification queries

```sql
-- Whole festival
SELECT COUNT(DISTINCT f.id), COUNT(s.id) FROM festival_films f
LEFT JOIN festival_screenings s ON s.film_id = f.id
WHERE f.festival_name = 'Tallinn Black Nights Film Festival' AND f.festival_year = 2026;

-- Titles per section
SELECT category, COUNT(*) FROM festival_films
WHERE festival_name = 'Tallinn Black Nights Film Festival' AND festival_year = 2026
GROUP BY category ORDER BY 2 DESC;
```
